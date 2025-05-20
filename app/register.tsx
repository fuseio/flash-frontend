import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useCallback, useState } from 'react'
import { TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import useUser from '@/hooks/useUser'
import { bundlerUrl, pimlicoClient } from '@/lib/account'
import { getNonce } from '@/lib/NonceManager'
import { Status } from '@/lib/types'
import { publicClient } from '@/lib/wagmi'
import {
  encodeValidatorNonce,
  getAccount,
  getWebAuthnValidator,
  getWebauthnValidatorMockSignature,
  getWebauthnValidatorSignature,
  RHINESTONE_ATTESTER_ADDRESS,
  WEBAUTHN_VALIDATOR_ADDRESS
} from "@rhinestone/module-sdk"
import { PublicKey } from "ox"
import { sign } from "ox/WebAuthnP256"
import { createSmartAccountClient, getRequiredPrefund, SmartAccountClient } from "permissionless"
import {
  toSafeSmartAccount,
  ToSafeSmartAccountReturnType
} from "permissionless/accounts"
import { getAccountNonce } from "permissionless/actions"
import { erc7579Actions, Erc7579Actions } from "permissionless/actions/erc7579"
import { Chain, formatEther, http, Transport } from "viem"
import {
  createWebAuthnCredential,
  entryPoint07Address,
  getUserOperationHash,
  P256Credential
} from "viem/account-abstraction"
import { toAccount } from 'viem/accounts'
import { fuse } from 'viem/chains'

const appId = "solid";

export default function Register() {
  const [smartAccountClient, setSmartAccountClient] = useState<
    SmartAccountClient<Transport, Chain, ToSafeSmartAccountReturnType<"0.7">> &
    Erc7579Actions<ToSafeSmartAccountReturnType<"0.7">>
  >();
  const [credential, setCredential] = useState<P256Credential>(() =>
    JSON.parse(localStorage.getItem("credential") || "null"),
  );
  const [username, setUsername] = useState('')
  const { signupInfo, handleSignup, loginInfo, handleLogin } = useUser()

  const handleSendUserOp = useCallback(async () => {
    if (!smartAccountClient) {
      console.error("No smart account client");
      return;
    } else if (!credential) {
      console.error("No credential");
      return;
    }

    // const publicClient = createPublicClient({
    //   chain: baseSepolia,
    //   transport: http(),
    // });

    // setUserOpLoading(true);

    const nonce = await getAccountNonce(publicClient(fuse.id), {
      address: smartAccountClient.account.address,
      entryPointAddress: entryPoint07Address,
      key: encodeValidatorNonce({
        account: getAccount({
          address: smartAccountClient.account.address,
          type: "safe",
        }),
        validator: WEBAUTHN_VALIDATOR_ADDRESS,
      }),
    });

    const userOperation = await smartAccountClient.prepareUserOperation({
      account: smartAccountClient.account,
      calls: [{
        to: "0x7Ceabc27B1dc6A065fAD85A86AFBaF97F7692088",
        value: BigInt('1000000000000000000'),
        data: "0x",
      }],
      nonce,
      signature: getWebauthnValidatorMockSignature(),
    });

    const requiredPrefund = getRequiredPrefund({
      userOperation,
      entryPointVersion: "0.7",
    })

    const senderBalance = await publicClient(fuse.id).getBalance({
      address: userOperation.sender
    })
    // Convert to human readable format
    const senderBalanceHuman = formatEther(senderBalance);
    const requiredPrefundHuman = formatEther(requiredPrefund);
    console.log("senderBalance", senderBalanceHuman);
    console.log("requiredPrefund", requiredPrefundHuman);

    if (senderBalance < requiredPrefund) {
      throw new Error(`Sender address does not have enough native tokens`)
    }

    const userOpHashToSign = getUserOperationHash({
      chainId: fuse.id,
      entryPointAddress: entryPoint07Address,
      entryPointVersion: "0.7",
      userOperation,
    });

    const { metadata: webauthn, signature } = await sign({
      credentialId: credential.id,
      challenge: userOpHashToSign,
    });

    const encodedSignature = getWebauthnValidatorSignature({
      webauthn,
      signature,
      usePrecompiled: false,
    });

    userOperation.signature = encodedSignature;

    const userOpHash =
      await smartAccountClient.sendUserOperation(userOperation);

    const receipt = await smartAccountClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    console.log("UserOp receipt: ", receipt);

    // setCount(
    //   await getCount({
    //     // @ts-ignore
    //     publicClient,
    //     account: smartAccountClient.account.address,
    //   }),
    // );
    // setUserOpLoading(false);
  }, [credential, smartAccountClient]);


  const createSafe = useCallback(async (_credential: P256Credential) => {
    const { x, y, prefix } = PublicKey.from(_credential.publicKey);
    const webauthnValidator = getWebAuthnValidator({
      pubKey: { x, y, prefix },
      authenticatorId: _credential.id,
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
      saltNonce: getNonce({
        appId,
      }),
      client: publicClient(fuse.id),
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
      // paymaster: paymasterClient,
      chain: fuse,
      userOperation: {
        estimateFeesPerGas: async () =>
          (await pimlicoClient.getUserOperationGasPrice()).fast,
      },
      bundlerTransport: http(bundlerUrl),
    }).extend(erc7579Actions());

    setSmartAccountClient(_smartAccountClient as any);
    console.log("safeAccount", _smartAccountClient.account.address);
    // setCount(await getCount({ publicClient, account: safeAccount.address }));
  }, []);

  const handleCreateCredential = useCallback(async () => {
    let _credential;
    if (credential) {
      _credential = credential;
    } else {
      _credential = await createWebAuthnCredential({
        name: username,
      });
    }
    console.log("credential", JSON.stringify(_credential, null, 2));
    setCredential(_credential);
    localStorage.setItem(
      "credential",
      JSON.stringify({
        id: _credential.id,
        publicKey: _credential.publicKey,
      }),
    );
    await createSafe(_credential);
    // Send a test user operation
  }, [createSafe, credential, username]);

  const handleSignupForm = () => {
    handleSignup(username)
  }

  return (
    <SafeAreaView className="bg-background text-foreground flex-1 justify-between p-4">
      <View className="flex-1 justify-center items-center gap-20 w-full max-w-lg mx-auto">
        <View className="flex-row items-center gap-5">
          <Image
            source={require("@/assets/images/flash-logo.png")}
            alt="Flash logo"
            style={{ width: 73, height: 73 }}
            contentFit="contain"
          />
          <Image
            source={require("@/assets/images/flash.png")}
            alt="Flash"
            style={{ width: 153, height: 78 }}
            contentFit="contain"
          />
        </View>

        <View className='w-full flex-col gap-10'>
          <View className='flex-col gap-5'>
            <TextInput
              id="username"
              value={username}
              onChangeText={setUsername}
              placeholder='Choose a username'
              className="h-14 px-6 rounded-twice border border-border text-lg text-foreground font-semibold placeholder:text-muted-foreground"
            />
            <Button
              // onPress={handleCreateCredential}
              onPress={handleSignupForm}
              disabled={signupInfo.status === Status.PENDING || !username}
              className="rounded-twice h-14"
            >
              <Text className="text-lg font-semibold">
                {signupInfo.status === Status.ERROR ?
                  signupInfo.message || 'Error creating account' :
                  signupInfo.status === Status.PENDING ?
                    'Creating' :
                    'Create Account'
                }
              </Text>
            </Button>
          </View>

          <Text className="text-center">OR</Text>

          <Button
            onPress={handleLogin}
            disabled={loginInfo.status === Status.PENDING}
            variant="outline"
            className="rounded-twice h-14"
          >
            <Text className="text-lg font-semibold">
              {loginInfo.status === Status.ERROR ?
                loginInfo.message || 'Error logging in' :
                loginInfo.status === Status.PENDING ?
                  'Logging in' :
                  'Login'
              }
            </Text>
          </Button>
          <Button
            onPress={handleSendUserOp}
            disabled={!smartAccountClient}
            variant="outline"
            className="rounded-twice h-14"
          >
            Send User Op
          </Button>

          <Text className='text-center text-sm text-muted-foreground max-w-64 mx-auto'>
            By continuing, you agree with Flash{' '}
            <Link href="/" className='hover:underline'>Terms of Use</Link> and{' '}
            <Link href="/" className='hover:underline'>Privacy Policy</Link>.
          </Text>
        </View>
      </View>
      <Text className="text-center text-sm text-muted-foreground max-w-[19rem] mx-auto">
        Your Flash Account is secured with a passkey - a safer replacement for passwords.{' '}
        <Link href="/" className='hover:underline'>Learn more</Link>
      </Text>
    </SafeAreaView>
  )
}
