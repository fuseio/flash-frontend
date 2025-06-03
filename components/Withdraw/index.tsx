import { Image, TextInput, View } from "react-native"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

import WithdrawIcon from "@/assets/images/withdraw"

const Withdraw = () => {
  const [amount, setAmount] = useState('')

  return (
    <View className="flex-col gap-4 min-h-64 md:min-h-72">
      <View className="flex-row justify-between items-center">
        <Text className="opacity-40">Witdraw amount</Text>
        <Text className="opacity-40">Balance: 30 FUSE</Text>
      </View>

      <View className="flex-row justify-between items-center gap-2 bg-primary/10 rounded-2xl p-4">
        <TextInput
          keyboardType="numeric"
          className="w-full text-2xl md:text-3xl text-primary font-semibold web:focus:outline-none"
          value={amount}
          placeholder="0.0"
          onChangeText={setAmount}
        />
        <View className="flex-row items-center gap-2">
          <Image source={require("@/assets/images/usdc.png")} alt="USDC" style={{ width: 34, height: 34 }} />
          <View className="flex-col items-start">
            <Text className="font-bold">USDC</Text>
            <Text className="text-xs opacity-40">On ethereum</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const WithdrawTrigger = (props: any) => {
  return (
    <Button
      variant="outline"
      className="flex-col items-center gap-3 w-28 h-20 rounded-xl md:rounded-twice"
      {...props}
    >
      <WithdrawIcon className="size-6" />
      <Text className="font-semibold">Withdraw</Text>
    </Button>
  )
}

const WithdrawTitle = () => {
  return (
    <Text className="text-lg font-semibold">Withdraw</Text>
  )
}

const WithdrawFooter = () => {
  return (
    <Button
      variant="brand"
      className="w-full rounded-xl"
      onPress={() => { }}
    >
      <Text className="font-bold">Withdraw</Text>
    </Button>
  )
}

export {
  Withdraw, WithdrawFooter, WithdrawTitle, WithdrawTrigger
}
