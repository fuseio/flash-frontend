import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Platform, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import useUser from '@/hooks/useUser'
import { Status } from '@/lib/types'

export default function Register() {
  const [username, setUsername] = useState('')
  const { signupInfo, handleSignup, loginInfo, handleLogin, handleDummyLogin } = useUser()

  const handleSignupForm = () => {
    handleSignup(username)
  }

  return (
    <SafeAreaView className="bg-background text-foreground flex-1">
      <View className='flex-1 justify-between p-4'>
        <View className="flex-1 justify-center items-center gap-20 w-full max-w-lg mx-auto">
          <View className="flex-row items-center gap-5">
            <Image
              source={require("@/assets/images/solid-logo.png")}
              alt="Solid logo"
              style={{ width: 73, height: 73 }}
              contentFit="contain"
            />
            <Image
              source={require("@/assets/images/solid.png")}
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
                onPress={handleSignupForm}
                disabled={signupInfo.status === Status.PENDING || !username}
                className="rounded-xl md:rounded-twice h-14"
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
              className="rounded-xl md:rounded-twice h-14"
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

            {/* TODO: Remove when passkey works */}
            {Platform.OS !== 'web' && (
              <Button
                onPress={handleDummyLogin}
                variant="outline"
                className="rounded-xl md:rounded-twice h-14"
              >
                <Text className="text-lg font-semibold">
                  Dummy Login
                </Text>
              </Button>
            )}

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
      </View>
    </SafeAreaView>
  )
}
