import {
  getWebAuthnValidator,
  RHINESTONE_ATTESTER_ADDRESS
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
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthentication, verifyRegistration } from "@/lib/api";
import { USER } from "@/lib/config";
import { pimlicoClient } from '@/lib/pimlico';
import { PasskeyArgType, Status, User } from "@/lib/types";
import { bufferToBase64URLString, decodePublicKey, getNonce, setGlobalLogoutHandler, withRefreshToken } from "@/lib/utils";
import { publicClient } from "@/lib/wagmi";
import { Chain, http } from 'viem';
import {
  entryPoint07Address
} from "viem/account-abstraction";
import { useUserStore } from "@/store/useUserStore";
import { fetchIsDeposited } from "./useAnalytics";

const useUser = () => {
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
    setLoginInfo
  } = useUserStore();

  const user = useMemo(() => {
    return users.find((user: User) => user.selected)
  }, [users]);

  async function checkBalance(user: User) {
    try {
      const isDeposited = await fetchIsDeposited(queryClient, user.safeAddress);
      if (isDeposited) {
        updateUser({
          ...user,
          isDeposited: true,
        });
        router.replace(path.DASHBOARD);
        return;
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
    router.replace(path.HOME);
  }

  async function handleSignup(username: string) {
    try {
      setSignupInfo({ status: Status.PENDING });

      const optionsJSON = await generateRegistrationOptions(username);
      const authenticatorReponse = await passkeys.create(optionsJSON);
      if (!authenticatorReponse) {
        throw new Error("Error while creating passkey registration");
      }

      const publicKey = bufferToBase64URLString(authenticatorReponse.response.getPublicKey())
      const coordinates = await decodePublicKey(authenticatorReponse.response)
      const smartAccountClient = await safeAA({
        rawId: authenticatorReponse.rawId,
        credentialId: authenticatorReponse.id,
        coordinates: coordinates,
      }, mainnet);

      const user = await withRefreshToken(
        () => verifyRegistration({
          ...authenticatorReponse,
          response: {
            ...authenticatorReponse.response,
            publicKey,
          },
        }, smartAccountClient.account.address),
        { onError: handleLogin }
      );

      if (user) {
        const selectedUser = { ...user, selected: true };
        storeUser(selectedUser);
        await checkBalance(selectedUser);
        setSignupInfo({ status: Status.SUCCESS });
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
        const selectedUser = { ...user, selected: true };
        storeUser(selectedUser);
        await checkBalance(selectedUser);
        setLoginInfo({ status: Status.SUCCESS });
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
        credentialId: "dummy",
      },
    });
    router.replace(path.HOME);
  }

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

    const deadOwner = toAccount({
      address: "0x000000000000000000000000000000000000dead",
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

    const safeAccount = await toSafeSmartAccount({
      saltNonce: await getNonce({
        appId: 'solid',
      }),
      client: publicClient(chain.id),
      owners: [deadOwner],
      version: "1.4.1",
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
      safe4337ModuleAddress: "0x7579EE8307284F293B1927136486880611F20002",
      erc7579LaunchpadAddress: "0x7579011aB74c46090561ea277Ba79D510c6C00ff",
      attesters: [
        RHINESTONE_ATTESTER_ADDRESS, // Rhinestone Attester
      ],
      attestersThreshold: 1,
      validators: [
        {
          address: webauthnValidator.address,
          context: webauthnValidator.initData,
        },
      ],
    });
    const _smartAccountClient = createSmartAccountClient({
      account: safeAccount,
      chain: chain,
      paymaster: pimlicoClient(chain.id),
      userOperation: {
        estimateFeesPerGas: async () =>
          (await pimlicoClient(chain.id).getUserOperationGasPrice()).fast,
      },
      bundlerTransport: http(USER.pimlicoUrl(chain.id)),
    }).extend(erc7579Actions());

    return _smartAccountClient
  }, [])

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
    safeAA
  };
};

export default useUser;
