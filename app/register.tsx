import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Platform, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useAuthRelay } from '@/hooks/useAuthRelayer'
import useUser from '@/hooks/useUser'
import { LoginMethod, Status } from '@/lib/types'
import { useUserStore } from '@/store/useUserStore'

export default function Register() {
  const [username, setUsername] = useState('')
  const { handleSignup, handleLogin, handleDummyLogin } = useUser()
  const { signupInfo, loginInfo } = useUserStore()
  const { state, signUpWithPasskey, loginWithPasskey, clearError } = useAuthRelay();

  // const handleSignupForm = () => {
  //   handleSignup(username)
  // }

  // const handlePasskeySignup = async () => {
  //   if (!username.trim()) return;

  //   try {
  //     await signUpWithPasskey(username);
  //   } catch (error) {
  //     console.error('Passkey signup error:', error);
  //   }
  // };

  const handlePasskeyLogin = async () => {
    try {
      await loginWithPasskey(username);
    } catch (error) {
      console.error('Passkey login error:', error);
    }
  };

  const isPasskeyLoading = state.loading === LoginMethod.Passkey;

  return (
    <SafeAreaView className="bg-background text-foreground flex-1">
      <View className='flex-1 justify-between px-4 py-8'>
        <View className="flex-1 justify-center items-center gap-20 w-full max-w-lg mx-auto">
          <View className="flex-row items-center gap-5">
            <Image
              source={require("@/assets/images/solid-logo-4x.png")}
              alt="Solid logo"
              style={{ width: 73, height: 73 }}
              contentFit="contain"
            />
            <Image
              source={require("@/assets/images/solid-4x.png")}
              alt="Solid"
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
                className="h-14 px-6 rounded-xl md:rounded-twice border border-border text-lg text-foreground font-semibold placeholder:text-muted-foreground"
              />
              <Button
                variant="brand"
                onPress={handlePasskeyLogin}
                disabled={isPasskeyLoading || signupInfo.status === Status.PENDING || !username}
                className="rounded-xl md:rounded-twice h-14"
              >
                <Text className="text-lg font-semibold">
                  {isPasskeyLoading ?
                    `Creating Account (${Platform.OS})...` :
                    state.error ?
                      state.error :
                      signupInfo.status === Status.ERROR ?
                        signupInfo.message || 'Error creating account' :
                        signupInfo.status === Status.PENDING ?
                          'Creating' :
                          `Create Account`
                  }
                </Text>
                {(signupInfo.status === Status.PENDING || isPasskeyLoading) && (
                  <ActivityIndicator color="gray" />
                )}
              </Button>
            </View>

            {/* <Text className="text-center">OR</Text> */}

            {/* <Button
              disabled={isPasskeyLoading || loginInfo.status === Status.PENDING}
              onPress={handlePasskeyLogin}
              variant="outline"
              className="rounded-xl md:rounded-twice h-14"
            >
              <Text className="text-lg font-semibold">
                {isPasskeyLoading ?
                  `Logging in (${Platform.OS})...` :
                  state.error ?
                    state.error :
                    loginInfo.status === Status.ERROR ?
                      loginInfo.message || 'Error logging in' :
                      loginInfo.status === Status.PENDING ?
                        'Logging in' :
                        'Login with Passkey'
                }
              </Text>
              {(loginInfo.status === Status.PENDING || isPasskeyLoading) && (
                <ActivityIndicator color="gray" />
              )}
            </Button> */}

            {/* Dummy login for development/testing */}
            {__DEV__ && (
              <Button
                onPress={handleDummyLogin}
                variant="outline"
                className="rounded-xl md:rounded-twice h-14"
              >
                <Text className="text-lg font-semibold">
                  Dummy Login (Dev Only)
                </Text>
              </Button>
            )}

            {/* Success message for cross-platform auth */}
            {state.user && (
              <View style={{
                backgroundColor: '#e8f5e8',
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#4caf50'
              }}>
                <Text style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  ✅ Passkey Authentication Successful!
                </Text>
                <Text style={{ color: '#2e7d32', fontSize: 12, marginTop: 4 }}>
                  Platform: {Platform.OS === 'web' ? 'Web (Browser SDK)' : 'Mobile (React Native SDK)'}
                </Text>
              </View>
            )}

            <Text className='text-center text-sm text-muted-foreground max-w-64 mx-auto'>
              By continuing, you agree with Solid{' '}
              <Link href="/" className='hover:underline'>Terms of Use</Link> and{' '}
              <Link href="/" className='hover:underline'>Privacy Policy</Link>.
            </Text>
          </View>
        </View>
        <Text className="text-center text-sm text-muted-foreground max-w-[19rem] mx-auto">
          Your Solid Account is secured with a passkey - a safer replacement for passwords.{' '}
          <Link href="/" className='hover:underline'>Learn more</Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}
