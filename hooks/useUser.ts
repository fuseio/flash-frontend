import AsyncStorage from '@react-native-async-storage/async-storage'
import { Safe4337Pack } from '@safe-global/relay-kit'
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { useCallback, useEffect, useMemo, useState } from "react"
import * as passkeys from "react-native-passkeys"
import { mainnet } from "viem/chains"

import { path } from "@/constants/path"
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthentication, verifyRegistration } from "@/lib/api"
import { USER } from "@/lib/config"
import { PasskeyArgType, Status, User } from "@/lib/types"
import { bufferToBase64URLString, withRefreshToken } from "@/lib/utils"
import { rpcUrls } from "@/lib/wagmi"
import { fetchBalance } from "./useToken"
import { TOKEN_MAP } from '@/constants/tokens'

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
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  async function storeUser(user: User) {
    let newUsers;
    setUsers((prevUsers) => {
      let isUserExists = false;
      prevUsers.forEach((prevUser) => {
        if (prevUser.username === user.username) {
          isUserExists = true;
          prevUser.selected = true;
        } else {
          prevUser.selected = false;
        }
      });

      if (isUserExists) {
        newUsers = prevUsers
      } else {
        newUsers = [...prevUsers, user];
      }

      return newUsers;
    });

    if (newUsers) {
      await AsyncStorage.setItem(USER.storageKey, JSON.stringify(newUsers));
    }
  }

  const loadUsers = useCallback(async () => {
    try {
      setUserStatus(Status.PENDING);
      const users = await AsyncStorage.getItem(USER.storageKey);
      if (!users) {
        throw new Error("User not found");
      }

      const parsedUsers = JSON.parse(users);
      setUsers(parsedUsers);
      setUserStatus(Status.SUCCESS);

      return parsedUsers;
    } catch (error) {
      console.log(error);
      setUserStatus(Status.ERROR);
    }
  }, []);

  const selectUser = async (username: string) => {
    let newUsers;
    setUsers((prevUsers) => {
      newUsers = prevUsers.map((user) => ({ ...user, selected: user.username === username }));
      return newUsers;
    });
    await AsyncStorage.setItem(USER.storageKey, JSON.stringify(newUsers));
    router.replace(path.HOME);
  }

  const unselectUser = async () => {
    let newUsers;
    setUsers((prevUsers) => {
      newUsers = prevUsers.map((user) => ({ ...user, selected: false }));
      return newUsers;
    });
    await AsyncStorage.setItem(USER.storageKey, JSON.stringify(newUsers));
  }

  const user = useMemo(() => {
    if (!users.length) return;

    return users.find((user) => user.selected);
  }, [users]);

  const removeUsers = async () => {
    setUsers([]);
    await AsyncStorage.removeItem(USER.storageKey);
    router.replace(path.REGISTER);
  }

  async function checkBalance(user: User) {
    try {
      const balance = await fetchBalance(TOKEN_MAP[mainnet.id], user.safeAddress, queryClient);
      if (balance?.total) {
        router.replace(path.DASHBOARD);
        return;
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
    router.replace(path.HOME);
  }

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
        storeUser({ ...user, selected: true });
        setSignupInfo({ status: Status.SUCCESS });
        await checkBalance(user);
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
        storeUser({ ...user, selected: true });
        setSignupInfo({ status: Status.SUCCESS });
        await checkBalance(user);
      } else {
        throw new Error("Error while verifying passkey authentication");
      }
    } catch (error: any) {
      console.error(error);
      setLoginInfo({ status: Status.ERROR });
    }
  }

  async function handleDummyLogin() {
    await storeUser({
      username: "dummy",
      safeAddress: "0x0000000000000000000000000000000000000000",
      selected: true,
      passkey: {
        rawId: "dummy",
        coordinates: {
          x: "dummy",
          y: "dummy",
        },
      },
    });
    router.replace(path.HOME);
  }

  async function handleLogout() {
    await AsyncStorage.removeItem(USER.storageKey);
    unselectUser();
    router.replace(path.WELCOME);
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
    loadUsers();
  }, []);

  return {
    signupInfo,
    handleSignup,
    users,
    user,
    userStatus,
    loginInfo,
    handleLogin,
    handleDummyLogin,
    selectUser,
    handleLogout,
    removeUsers,
    safeAA,
    userOpReceipt
  };
};

export default useUser;
