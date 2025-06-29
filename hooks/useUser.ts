import {
  getWebAuthnValidator,
  RHINESTONE_ATTESTER_ADDRESS,
} from "@rhinestone/module-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { PublicKey } from "ox";
import { createSmartAccountClient } from "permissionless";
import {
  toSafeSmartAccount
} from "permissionless/accounts";
import { erc7579Actions } from "permissionless/actions/erc7579";
import { useCallback, useEffect, useMemo } from "react";
import * as passkeys from "react-native-passkeys";
import { toAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

import { path } from "@/constants/path";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthentication,
  verifyRegistration,
} from "@/lib/api";
import { USER } from "@/lib/config";
import { pimlicoClient } from "@/lib/pimlico";
import { PasskeyArgType, Status, User } from "@/lib/types";
import {
  bufferToBase64URLString,
  decodePublicKey,
  getNonce,
  setGlobalLogoutHandler,
  withRefreshToken,
} from "@/lib/utils";
import { publicClient } from "@/lib/wagmi";
import { useUserStore } from "@/store/useUserStore";
import { Chain, http } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { fetchIsDeposited } from "./useAnalytics";

// Constants
const DEAD_OWNER_ADDRESS = "0x000000000000000000000000000000000000dead";
const SAFE_VERSION = "1.4.1";
const SAFE_MODULE_ADDRESS = "0x7579EE8307284F293B1927136486880611F20002";
const ERC7579_LAUNCHPAD_ADDRESS = "0x7579011aB74c46090561ea277Ba79D510c6C00ff";
const DUMMY_USER_SAFE_ADDRESS = "0x0000000000000000000000000000000000000000";

// Error messages
const ERROR_MESSAGES = {
  PASSKEY_CREATION: "Error while creating passkey registration",
  PASSKEY_AUTH: "Error while creating passkey authentication",
  PUBLIC_KEY_MISSING: "Failed to get public key from authenticator response",
  REGISTRATION_VERIFY: "Error while verifying passkey registration",
  AUTH_VERIFY: "Error while verifying passkey authentication",
  USERNAME_EXISTS: "Username already exists",
} as const;

interface UseUserReturn {
  user: User | undefined;
  handleSignup: (username: string) => Promise<void>;
  handleLogin: () => Promise<void>;
  handleDummyLogin: () => Promise<void>;
  handleSelectUser: (username: string) => void;
  handleLogout: () => void;
  handleRemoveUsers: () => void;
  safeAA: (passkey: PasskeyArgType, chain: Chain) => Promise<any>;
  checkBalance: (user: User) => Promise<void>;
}

const useUser = (): UseUserReturn => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    users,
    storeUser,
    updateUser,
    selectUser,
    unselectUser,
    removeUsers,
    setSignupInfo,
    setLoginInfo,
  } = useUserStore();

  const user = useMemo(() => {
    return users.find((user: User) => user.selected);
  }, [users]);

  const checkBalance = useCallback(async (user: User) => {
    try {
      const isDeposited = await fetchIsDeposited(queryClient, user.safeAddress);
      if (isDeposited) {
        updateUser({
          ...user,
          isDeposited: true,
        });
        router.replace(path.HOME);
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  }, [queryClient, updateUser, router]);

  const createDeadOwnerAccount = useCallback(() => {
    return toAccount({
      address: DEAD_OWNER_ADDRESS,
      async signMessage() {
        return "0x";
      },
      async signTransaction() {
        return "0x";
      },
      async signTypedData() {
        return "0x";
      },
    });
  }, []);

  const safeAA = useCallback(async (passkey: PasskeyArgType, chain: Chain) => {
    const { x, y, prefix } = PublicKey.from({
      prefix: 4,
      x: BigInt(passkey.coordinates.x),
      y: BigInt(passkey.coordinates.y),
    });

    const webauthnValidator = getWebAuthnValidator({
      pubKey: { x, y, prefix },
      authenticatorId: passkey.credentialId,
    });

    const deadOwner = createDeadOwnerAccount();

    const safeAccount = await toSafeSmartAccount({
      saltNonce: await getNonce({
        appId: "solid",
      }),
      client: publicClient(chain.id),
      owners: [deadOwner],
      version: SAFE_VERSION,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
      safe4337ModuleAddress: SAFE_MODULE_ADDRESS,
      erc7579LaunchpadAddress: ERC7579_LAUNCHPAD_ADDRESS,
      attesters: [RHINESTONE_ATTESTER_ADDRESS],
      attestersThreshold: 1,
      validators: [
        {
          address: webauthnValidator.address,
          context: webauthnValidator.initData,
        },
      ],
    });

    return createSmartAccountClient({
      account: safeAccount,
      chain: chain,
      paymaster: pimlicoClient(chain.id),
      userOperation: {
        estimateFeesPerGas: async () =>
          (await pimlicoClient(chain.id).getUserOperationGasPrice()).fast,
      },
      bundlerTransport: http(USER.pimlicoUrl(chain.id)),
    }).extend(erc7579Actions());
  }, [createDeadOwnerAccount]);

  const handleSignup = useCallback(async (username: string) => {
    try {
      setSignupInfo({ status: Status.PENDING });

      const optionsJSON = await generateRegistrationOptions(username);
      const authenticatorReponse = await passkeys.create(optionsJSON);

      if (!authenticatorReponse) {
        throw new Error(ERROR_MESSAGES.PASSKEY_CREATION);
      }

      const publicKeyData = authenticatorReponse.response.getPublicKey();
      if (!publicKeyData) {
        throw new Error(ERROR_MESSAGES.PUBLIC_KEY_MISSING);
      }

      // Handle platform differences - mobile returns base64 string, web returns ArrayBuffer
      const publicKey = typeof publicKeyData === "string"
        ? publicKeyData // Already base64 encoded on mobile
        : bufferToBase64URLString(publicKeyData); // Convert ArrayBuffer to base64 on web

      const coordinates = await decodePublicKey(authenticatorReponse.response);
      const smartAccountClient = await safeAA(
        {
          rawId: authenticatorReponse.rawId,
          credentialId: authenticatorReponse.id,
          coordinates: coordinates,
        },
        mainnet
      );

      const user = await withRefreshToken(
        () => verifyRegistration(
          {
            ...authenticatorReponse,
            response: {
              ...authenticatorReponse.response,
              publicKey,
            },
          },
          optionsJSON.sessionId,
          smartAccountClient.account.address
        ),
        { onError: handleLogin }
      );

      if (!user) {
        throw new Error(ERROR_MESSAGES.REGISTRATION_VERIFY);
      }

      const selectedUser = { ...user, selected: true };
      storeUser(selectedUser);
      await checkBalance(selectedUser);
      setSignupInfo({ status: Status.SUCCESS });
    } catch (error: any) {
      const errorMessage = error?.status === 409
        ? ERROR_MESSAGES.USERNAME_EXISTS
        : undefined;

      setSignupInfo({
        status: Status.ERROR,
        ...(errorMessage && { message: errorMessage }),
      });
      console.error(error);
    }
  }, [setSignupInfo, safeAA, storeUser, checkBalance]);

  const handleLogin = useCallback(async () => {
    try {
      setLoginInfo({ status: Status.PENDING });

      const optionsJSON = await generateAuthenticationOptions();
      const authenticatorReponse = await passkeys.get(optionsJSON);

      if (!authenticatorReponse) {
        throw new Error(ERROR_MESSAGES.PASSKEY_AUTH);
      }

      const user = await verifyAuthentication(authenticatorReponse, optionsJSON.sessionId);

      if (!user) {
        throw new Error(ERROR_MESSAGES.AUTH_VERIFY);
      }

      const selectedUser = { ...user, selected: true };
      storeUser(selectedUser);
      await checkBalance(selectedUser);
      setLoginInfo({ status: Status.SUCCESS });
    } catch (error: any) {
      console.error(error);
      setLoginInfo({ status: Status.ERROR });
    }
  }, [setLoginInfo, storeUser, checkBalance]);

  const handleDummyLogin = useCallback(async () => {
    const dummyUser: User = {
      username: "dummy",
      safeAddress: DUMMY_USER_SAFE_ADDRESS,
      selected: true,
      passkey: {
        rawId: "dummy",
        coordinates: {
          x: "dummy",
          y: "dummy",
        },
        credentialId: "dummy",
      },
    };

    await storeUser(dummyUser);
    router.replace(path.HOME);
  }, [storeUser, router]);

  const handleLogout = useCallback(() => {
    unselectUser();
    router.replace(path.WELCOME);
  }, [unselectUser, router]);

  const handleSelectUser = useCallback((username: string) => {
    selectUser(username);
    router.replace(path.HOME);
  }, [selectUser, router]);

  const handleRemoveUsers = useCallback(() => {
    removeUsers();
    router.replace(path.REGISTER);
  }, [removeUsers, router]);

  useEffect(() => {
    setGlobalLogoutHandler(handleLogout);
  }, [handleLogout]);

  return {
    user,
    handleSignup,
    handleLogin,
    handleDummyLogin,
    handleSelectUser,
    handleLogout,
    handleRemoveUsers,
    safeAA,
    checkBalance,
  };
};

export default useUser;
