import { Image } from "expo-image"
import { ChevronDown } from "lucide-react-native"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Text } from "@/components/ui/text"
import { TOKEN_IMAGES, TOKEN_MAP } from "@/constants/tokens"
import { Token } from "@/lib/types"
import TokenSelector from "."

const TokenSelectorModal = () => {
  const [open, setOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token>(TOKEN_MAP[1][0]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-primary-foreground h-12 gap-1 rounded-full">
          <Image source={TOKEN_IMAGES[selectedToken.imageId]} alt={selectedToken.symbol} className="w-8 h-8" />
          <Text className="text-lg font-bold">
            {selectedToken.symbol}
          </Text>
          <ChevronDown />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:gap-8 md:max-w-sm">
        <DialogHeader>
          <DialogTitle>Select token</DialogTitle>
        </DialogHeader>
        <TokenSelector tokens={TOKEN_MAP[1]} setSelectedToken={setSelectedToken} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

export default TokenSelectorModal
