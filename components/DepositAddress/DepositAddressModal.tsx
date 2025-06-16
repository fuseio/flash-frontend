import { Plus } from "lucide-react-native"
import { useState } from "react"
import { View } from "react-native"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Text } from "@/components/ui/text"
import { TOKEN_MAP } from "@/constants/tokens"
import { Token } from "@/lib/types"
// import TokenSelector from "."
import { buttonVariants } from "../ui/button"
import TokenSelectorFooter from "./Footer"
import TokenSelectorDeposit from "./QRCodeAndAddress"

const DepositAddressModal = () => {
  const [open, setOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token>(TOKEN_MAP[1][0]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <View className={buttonVariants({ variant: "brand", className: "h-12 rounded-xl" })}>
          <View className="flex-row items-center gap-2">
            <Plus color="black" />
            <Text className="text-primary-foreground font-bold hidden md:block">Add funds</Text>
          </View>
        </View>
        {/* <Button className="text-primary-foreground h-12 gap-1 rounded-full">
          <Image source={TOKEN_IMAGES[selectedToken.imageId]} alt={selectedToken.symbol} style={{ width: 32, height: 32 }} />
          <Text className="text-lg font-bold">
            {selectedToken.symbol}
          </Text>
          <ChevronDown />
        </Button> */}
      </DialogTrigger>
      <DialogContent className="md:gap-8 md:max-w-sm">
        {/* <View className="gap-2 md:gap-4">
          <DialogTitle>Select token</DialogTitle>
          <TokenSelector tokens={TOKEN_MAP[1]} setSelectedToken={setSelectedToken} setOpen={setOpen} />
        </View> */}
        <View className="gap-2 md:gap-4">
          <DialogTitle>Deposit address</DialogTitle>
          <TokenSelectorDeposit />
        </View>
        <TokenSelectorFooter selectedToken={TOKEN_MAP[1][0]} />
      </DialogContent>
    </Dialog>
  )
}

export default DepositAddressModal
