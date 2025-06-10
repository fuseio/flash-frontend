import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Platform, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import useUser from '@/hooks/useUser'
import { Status } from '@/lib/types'
import { useUserStore } from '@/store/useUserStore'

export default function Register() {
  const [username, setUsername] = useState('')
  const { handleSignup, handleLogin, handleDummyLogin } = useUser()
  const { signupInfo, loginInfo } = useUserStore()

  const handleSignupForm = () => {
    handleSignup(username)
  }

  // Web layout (existing)
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView className="bg-background text-foreground flex-1">
        <View className='flex-1 justify-center gap-10 px-4 py-8 w-full max-w-lg mx-auto'>
          <View className="flex-row items-center gap-5">
            <Image
              source={require("@/assets/images/solid-logo-4x.png")}
              alt="Solid logo"
              style={{ width: 37, height: 40 }}
              contentFit="contain"
            />
          </View>
          <View className="gap-8">
            <View className='flex-col gap-2'>
              <Text className='text-3xl font-semibold'>Welcome!</Text>
              <Text className='text-muted-foreground max-w-[23rem]'>
                Sign up with your email or connect a Web3 wallet to get started.
              </Text>
            </View>

            <View className='w-full flex-col gap-8'>
              <View className='flex-col gap-5'>
                <TextInput
                  id="username"
                  value={username}
                  onChangeText={setUsername}
                  placeholder='Choose a username'
                  className="h-14 px-6 rounded-xl border border-border text-lg text-foreground font-semibold placeholder:text-muted-foreground"
                />
                <Button
                  variant="brand"
                  onPress={handleSignupForm}
                  disabled={signupInfo.status === Status.PENDING || !username}
                  className="rounded-xl h-14"
                >
                  <Text className="text-lg font-semibold">
                    {signupInfo.status === Status.ERROR ?
                      signupInfo.message || 'Error creating account' :
                      signupInfo.status === Status.PENDING ?
                        'Creating' :
                        'Create Account'
                    }
                  </Text>
                  {signupInfo.status === Status.PENDING && (
                    <ActivityIndicator color="gray" />
                  )}
                </Button>
              </View>

              <View className='flex-row items-center gap-4'>
                <View className='flex-1 h-px bg-border' />
                <Text className="text-center text-muted-foreground">OR</Text>
                <View className='flex-1 h-px bg-border' />
              </View>

              <Button
                onPress={handleLogin}
                disabled={loginInfo.status === Status.PENDING}
                variant="secondary"
                className="rounded-xl h-14"
              >
                <Text className="text-lg font-semibold">
                  {loginInfo.status === Status.ERROR ?
                    loginInfo.message || 'Error logging in' :
                    loginInfo.status === Status.PENDING ?
                      'Logging in' :
                      'Login'
                  }
                </Text>
                {loginInfo.status === Status.PENDING && (
                  <ActivityIndicator color="gray" />
                )}
              </Button>

              {__DEV__ && (
                <Button
                  onPress={handleDummyLogin}
                  variant="outline"
                  className="rounded-xl h-14"
                >
                  <Text className="text-lg font-semibold">
                    Dummy Login
                  </Text>
                </Button>
              )}
            </View>
            <Text className="text-sm text-muted-foreground">
              Your Solid Account is secured with a passkey - a safer replacement for seed phrases.{' '}
              <Link href="/" className='underline hover:opacity-70'>Learn more</Link>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  // Native layout (mobile design matching screenshot)
  return (
    <SafeAreaView className="bg-background text-foreground flex-1">
      <View className='flex-1 justify-between px-6 py-8'>
        {/* Top section with logo and welcome */}
        <View className='flex-1 justify-center items-center gap-12'>
          <View className='items-center gap-8'>
            <Image
              source={require("@/assets/splash/splash-icon.png")}
              alt="Solid logo"
              style={{ width: 64, height: 70 }}
              contentFit="contain"
            />
            <Text className='text-2xl font-bold tracking-wider text-center'>WELCOME</Text>
          </View>

          {/* Form section */}
          <View className='w-full max-w-sm gap-6'>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder='Choose a username'
              className="h-14 px-6 rounded-xl bg-muted text-lg text-foreground font-medium placeholder:text-muted-foreground"
              placeholderTextColor="rgba(255,255,255,0.6)"
            />

            <Button
              variant="brand"
              onPress={handleSignupForm}
              disabled={signupInfo.status === Status.PENDING || !username}
              className="rounded-xl h-14"
            >
              <Text className="text-lg font-semibold">
                {signupInfo.status === Status.ERROR ?
                  signupInfo.message || 'Error creating account' :
                  signupInfo.status === Status.PENDING ?
                    'Creating' :
                    'Create account'
                }
              </Text>
              {signupInfo.status === Status.PENDING && (
                <ActivityIndicator color="white" />
              )}
            </Button>

            <View className='flex-row items-center gap-4'>
              <View className='flex-1 h-px bg-border' />
              <Text className="text-center text-muted-foreground text-lg">OR</Text>
              <View className='flex-1 h-px bg-border' />
            </View>

            <Button
              onPress={handleLogin}
              disabled={loginInfo.status === Status.PENDING}
              variant="secondary"
              className="rounded-xl h-14"
            >
              <Text className="text-lg font-semibold">
                {loginInfo.status === Status.ERROR ?
                  loginInfo.message || 'Error logging in' :
                  loginInfo.status === Status.PENDING ?
                    'Logging in' :
                    'Login'
                }
              </Text>
              {loginInfo.status === Status.PENDING && (
                <ActivityIndicator color="white" />
              )}
            </Button>
          </View>
        </View>

        {/* Bottom section with terms and security info */}
        <View className='gap-6'>
          <Text className="text-sm text-muted-foreground text-center leading-5">
            By continuing, you agree with Flash Terms of{'\n'}Use and Privacy Policy.
          </Text>

          <Text className="text-sm text-muted-foreground text-center leading-5">
            Your Solid Account is secured with a passkey -{'\n'}a safer replacement for seed phrases. {'\n'}Learn more
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
