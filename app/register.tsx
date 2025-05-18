import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useCallback, useState } from 'react'
import { TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import useUser from '@/hooks/useUser'
import { pimlicoBaseSepoliaUrl, pimlicoClient } from '@/lib/account'
import { getNonce } from '@/lib/NonceManager'
import { Status } from '@/lib/types'
import {
  getWebAuthnValidator,
  MOCK_ATTESTER_ADDRESS,
  RHINESTONE_ATTESTER_ADDRESS
} from "@rhinestone/module-sdk"
import { PublicKey } from "ox"
import { createSmartAccountClient, SmartAccountClient } from "permissionless"
import {
  toSafeSmartAccount,
  ToSafeSmartAccountReturnType
} from "permissionless/accounts"
import { erc7579Actions, Erc7579Actions } from "permissionless/actions/erc7579"
import { Chain, createPublicClient, http, Transport } from "viem"
import {
  createWebAuthnCredential,
  entryPoint07Address,
  P256Credential
} from "viem/account-abstraction"
import { toAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

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

  const createSafe = useCallback(async (_credential: P256Credential) => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

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
      client: publicClient,
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
        MOCK_ATTESTER_ADDRESS, // Mock Attester - do not use in production
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
      paymaster: pimlicoClient,
      chain: mainnet,
      userOperation: {
        estimateFeesPerGas: async () =>
          (await pimlicoClient.getUserOperationGasPrice()).fast,
      },
      bundlerTransport: http(pimlicoBaseSepoliaUrl),
    }).extend(erc7579Actions());

    setSmartAccountClient(_smartAccountClient as any);  
    // @ts-ignore
    setCount(await getCount({ publicClient, account: safeAccount.address }));
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
    setCredential(_credential);
    localStorage.setItem(
      "credential",
      JSON.stringify({
        id: _credential.id,
        publicKey: _credential.publicKey,
      }),
    );
    await createSafe(_credential);
  }, [createSafe, credential, username]);

  // const handleSignupForm = () => {
  //   handleSignup(username)
  // }

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
              onPress={handleCreateCredential}
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
