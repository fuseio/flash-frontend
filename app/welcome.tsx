import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Key } from 'lucide-react-native'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import useUser from '@/hooks/useUser'
import { path } from '@/constants/path'
import { eclipseUsername } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function Welcome() {
  const { users, removeUsers, selectUser } = useUser()
  const router = useRouter()

  return (
    <SafeAreaView className="bg-background text-foreground flex-1">
      <View className='w-full max-w-md mx-auto flex-1 justify-center items-center gap-8 px-4 py-8'>
        <View className='items-center gap-4'>
          <Image
            source={require("@/assets/images/solid-logo.png")}
            alt="Solid logo"
            style={{ width: 73, height: 73 }}
            contentFit="contain"
          />
          <Text className='text-4.5xl font-semibold'>WELCOME BACK</Text>
        </View>

        <View className='gap-2 w-full'>
          {!users.length && (
            <Skeleton className='bg-primary/10 rounded-xl h-14' />
          )}
          {users.map((user) => (
            <Button
              key={user.username}
              className='justify-between bg-primary/10 rounded-xl h-16'
              onPress={() => selectUser(user.username)}
            >
              <View className='flex-row items-center gap-2'>
                <View className='bg-primary/15 rounded-md w-8 h-8 justify-center items-center'>
                  <Text className='text-primary font-bold'>{user.username[0]}</Text>
                </View>
                <Text className='text-lg text-primary font-semibold'>{eclipseUsername(user.username, 20)}</Text>
              </View>
              <Key />
            </Button>
          ))}
        </View>

        <View className='gap-2 w-full'>
          <Button
            variant="outline"
            className="rounded-xl h-12"
            onPress={() => router.replace(path.REGISTER)}
          >
            <Text className='text-lg font-semibold'>Use another account</Text>
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl h-12"
            onPress={removeUsers}
          >
            <Text className='text-lg font-semibold'>Forget all users</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
