import { ChevronDown } from "lucide-react-native"
import { View } from "react-native"

import CopyToClipboard from "@/components/CopyToClipboard"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import useUser from "@/hooks/useUser"
import { eclipseAddress } from "@/lib/utils"

const AccountCenter = () => {
  const { user } = useUser()

  return (
    <View className="flex-col gap-2 md:min-h-64">
      <Text className="text-sm text-muted-foreground">Safe Address</Text>
      <View className="flex-row justify-between items-center px-4 py-2 bg-primary/10 rounded-2xl text-primary font-medium">
        <Text>{eclipseAddress(user?.safeAddress || '')}</Text>
        <CopyToClipboard text={user?.safeAddress || ''} />
      </View>
    </View>
  )
}

const AccountCenterTrigger = (props: any) => {
  const { user } = useUser()

  let triggerButton = (
    <Button size="sm" className="w-full rounded-full animate-pulse" disabled {...props} />
  );
  if (user?.safeAddress) {
    triggerButton = (
      <Button
        size="sm"
        className="w-full rounded-full"
        {...props}
      >
        <Text className="font-semibold">{eclipseAddress(user.safeAddress, 4)}</Text>
        <ChevronDown />
      </Button>
    )
  }

  return triggerButton
}

const AccountCenterTitle = () => {
  const { user } = useUser()

  return (
    <Text className="text-lg font-semibold">Hello{user?.username ? `, ${user?.username}` : ''}</Text>
  )
}

const AccountCenterFooter = () => {
  const { handleLogout } = useUser()

  return (
    <Button
      variant="destructive"
      className="w-full"
      onPress={handleLogout}
    >
      <Text>Logout</Text>
    </Button>
  )
}

export {
  AccountCenter, AccountCenterFooter, AccountCenterTitle, AccountCenterTrigger
}

