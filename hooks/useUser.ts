import AsyncStorage from '@react-native-async-storage/async-storage';
import { Safe4337Pack } from '@safe-global/relay-kit';
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as passkeys from "react-native-passkeys";
import { Address } from "viem";
import { mainnet } from "viem/chains";

import { path } from "@/constants/path";
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthentication, verifyRegistration } from "@/lib/api";
import { USER } from "@/lib/config";
import { PasskeyArgType, Status, User } from "@/lib/types";
import { bufferToBase64URLString, withRefreshToken } from "@/lib/utils";
import { rpcUrls } from "@/lib/wagmi";

interface UserState {
  user: User | undefined;
  status: Status;
  error?: string;
}

interface AuthState {
  status: Status;
  message?: string;
}

const initUser: User = {
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
  const [userState, setUserState] = useState<UserState>({ user: undefined, status: Status.IDLE });
  const [signupInfo, setSignupInfo] = useState<AuthState>({ status: Status.IDLE });
  const [loginInfo, setLoginInfo] = useState<AuthState>({ status: Status.IDLE });
  const router = useRouter();

  const storeUser = useCallback(async (user: Partial<User>) => {
    try {
      const newUser = { ...userState.user, ...user } as User;
      setUserState(prev => ({ ...prev, user: newUser }));
      await AsyncStorage.setItem(USER.storageKey, JSON.stringify(newUser));
    } catch (error) {
      console.error('Error storing user:', error);
      setUserState(prev => ({ ...prev, status: Status.ERROR, error: 'Failed to store user data' }));
    }
  }, [userState.user]);

  const loadUser = useCallback(async () => {
    try {
      setUserState(prev => ({ ...prev, status: Status.PENDING }));
      const user = await AsyncStorage.getItem(USER.storageKey);

      if (!user) {
        throw new Error("User not found");
      }

      const parsedUser = JSON.parse(user);
      setUserState({ user: parsedUser, status: Status.SUCCESS });
      return parsedUser;
    } catch (error) {
      console.error('Error loading user:', error);
      setUserState(prev => ({ ...prev, status: Status.ERROR, error: 'Failed to load user data' }));
    }
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      setLoginInfo({ status: Status.PENDING });
      const optionsJSON = await generateAuthenticationOptions();
      const authenticatorResponse = await passkeys.get(optionsJSON);

      if (!authenticatorResponse) {
        throw new Error("Error while creating passkey authentication");
      }

      const user = await verifyAuthentication(authenticatorResponse);

      if (user) {
        await storeUser(user);
        setLoginInfo({ status: Status.SUCCESS });
        router.replace(path.DEPOSIT);
      } else {
        throw new Error("Error while verifying passkey authentication");
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginInfo({ status: Status.ERROR, message: 'Authentication failed' });
    }
  }, [router, storeUser]);

  const handleSignup = useCallback(async (username: string) => {
    try {
      setSignupInfo({ status: Status.PENDING });

      const optionsJSON = await generateRegistrationOptions(username);
      const authenticatorResponse = await passkeys.create(optionsJSON);
      console.log("authenticatorResponse", JSON.stringify(authenticatorResponse, null, 2));

      if (!authenticatorResponse) {
        throw new Error("Error while creating passkey registration");
      }

      const publicKey = bufferToBase64URLString(authenticatorResponse.response.getPublicKey());

      const user = await withRefreshToken(
        verifyRegistration({
          ...authenticatorResponse,
          response: {
            ...authenticatorResponse.response,
            publicKey,
          },
        }),
        { onError: handleLogin }
      );

      if (user) {
        await storeUser(user);
        setSignupInfo({ status: Status.SUCCESS });
        router.replace(path.DEPOSIT);
      } else {
        throw new Error("Error while verifying passkey registration");
      }
    } catch (error: any) {
      setSignupInfo({
        status: Status.ERROR,
        message: error?.status === 409 ? "Username already exists" : "Registration failed",
      });
      console.error('Signup error:', error);
    }
  }, [router, storeUser, handleLogin]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(USER.storageKey);
      setUserState({ user: initUser, status: Status.IDLE });
      router.replace(path.REGISTER);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  const safeAA = useCallback(async (passkey: PasskeyArgType) => {
    return Safe4337Pack.init({
      provider: rpcUrls[mainnet.id],
      signer: passkey,
      bundlerUrl: USER.pimlicoUrl,
      options: {
        owners: [],
        threshold: 1
      }
    });
  }, []);

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
  }, [loadUser]);

  const memoizedState = useMemo(() => ({
    signupInfo,
    handleSignup,
    user: userState.user,
    userStatus: userState.status,
    loginInfo,
    handleLogin,
    handleLogout,
    safeAA,
    userOpReceipt
  }), [
    signupInfo,
    handleSignup,
    userState.user,
    userState.status,
    loginInfo,
    handleLogin,
    handleLogout,
    safeAA,
    userOpReceipt
  ]);

  return memoizedState;
};

export default useUser;
