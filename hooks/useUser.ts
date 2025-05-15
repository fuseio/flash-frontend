import { useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { Safe4337Pack } from '@safe-global/relay-kit'
import { mainnet } from "viem/chains"
import { Address } from "viem";
import * as passkeys from "react-native-passkeys"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { USER } from "@/lib/config"
import { PasskeyArgType, Status, User } from "@/lib/types"
import { bufferToBase64URLString, withRefreshToken } from "@/lib/utils"
import { path } from "@/constants/path"
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthentication, verifyRegistration } from "@/lib/api"
import { rpcUrls } from "@/lib/wagmi";

const initUser = {
  username: "",
  safeAddress: "" as Address,
  passkey: {
    rawId: "",
    coordinates: {
      x: "",
      y: "",
    },
  },
};

const useUser = () => {
  const [signupInfo, setSignupInfo] = useState<{
    status: Status;
    message?: string;
  }>({ status: Status.IDLE, message: "" });
  const [loginInfo, setLoginInfo] = useState<{
    status: Status;
    message?: string;
  }>({ status: Status.IDLE, message: "" });
  const [userStatus, setUserStatus] = useState<Status>(Status.IDLE);
  const [user, setUser] = useState<User>();
  const router = useRouter();

  async function storeUser(user: { [K in keyof User]?: User[K] }) {
    let newUser = null;
    setUser((prevUser) => {
      newUser = {
        ...prevUser,
        ...user,
      } as User;
      return newUser;
    });
    await AsyncStorage.setItem(USER.storageKey, JSON.stringify(newUser));
  }

  const loadUser = useCallback(async () => {
    try {
      setUserStatus(Status.PENDING);
      const user = await AsyncStorage.getItem(USER.storageKey);
      if (!user) {
        throw new Error("User not found");
      }

      const parsedUser = JSON.parse(user);
      setUser(parsedUser);
      setUserStatus(Status.SUCCESS);

      return parsedUser;
    } catch (error) {
      console.log(error);
      setUserStatus(Status.ERROR);
    }
  }, []);

  async function handleSignup(username: string) {
    try {
      setSignupInfo({ status: Status.PENDING });

      const optionsJSON = await generateRegistrationOptions(username);
      const authenticatorReponse = await passkeys.create(optionsJSON)
      if (!authenticatorReponse) {
        throw new Error("Error while creating passkey registration");
      }

      const publicKey = bufferToBase64URLString(authenticatorReponse.response.getPublicKey())

      const user = await withRefreshToken(
        verifyRegistration({
          ...authenticatorReponse,
          response: {
            ...authenticatorReponse.response,
            publicKey,
          },
        }),
        { onError: handleLogin }
      );

      if (user) {
        storeUser(user);
        setSignupInfo({ status: Status.SUCCESS });
        router.replace(path.DEPOSIT);
      } else {
        throw new Error("Error while verifying passkey registration");
      }
    } catch (error: any) {
      if (error?.status === 409) {
        setSignupInfo({
          status: Status.ERROR,
          message: "Username already exists",
        });
      } else {
        setSignupInfo({ status: Status.ERROR });
      }
      console.error(error);
    }
  }

  async function handleLogin() {
    try {
      setLoginInfo({ status: Status.PENDING });
      const optionsJSON = await generateAuthenticationOptions();
      const authenticatorReponse = await passkeys.get(optionsJSON);
      if (!authenticatorReponse) {
        throw new Error("Error while creating passkey authentication");
      }

      const user = await verifyAuthentication(authenticatorReponse);

      if (user) {
        storeUser(user);
        setSignupInfo({ status: Status.SUCCESS });
        router.replace(path.DEPOSIT);
      } else {
        throw new Error("Error while verifying passkey authentication");
      }
    } catch (error: any) {
      console.error(error);
      setLoginInfo({ status: Status.ERROR });
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem(USER.storageKey);
    storeUser(initUser);
    router.replace(path.REGISTER);
  }

  const safeAA = useCallback(async (passkey: PasskeyArgType) => {
    return Safe4337Pack.init({
      provider: rpcUrls[mainnet.id],
      signer: passkey,
      bundlerUrl: USER.pimlicoUrl,
      // paymasterOptions: {
      //   isSponsored: true,
      //   paymasterUrl: USER.pimlicoUrl
      // },
      options: {
        owners: [],
        threshold: 1
      }
    })
  }, [])

  const userOpReceipt = useCallback(async (safe4337Pack: Safe4337Pack, userOperationHash: string) => {
    let userOperationReceipt = null
    while (!userOperationReceipt) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      userOperationReceipt = await safe4337Pack.getUserOperationReceipt(
        userOperationHash
      )
    }
    return userOperationReceipt
  }, [])

  useEffect(() => {
    loadUser();
  }, []);

  return {
    signupInfo,
    handleSignup,
    user,
    userStatus,
    loginInfo,
    handleLogin,
    handleLogout,
    safeAA,
    userOpReceipt
  };
};

export default useUser;
