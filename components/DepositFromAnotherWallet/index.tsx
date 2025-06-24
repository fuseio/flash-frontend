import { Plus } from "lucide-react-native"
import { View } from "react-native"
import { useAccount } from "wagmi"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Text } from "@/components/ui/text"
import { buttonVariants } from "../ui/button"
import DepositOptions from "./DepositOptions"
import DepositToVaultForm from "./DepositToVaultForm"

const DepositFromAnotherWallet = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
  const { address } = useAccount()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <View className={buttonVariants({ variant: "brand", className: "h-12 pr-6 rounded-xl" })}>
          <View className="flex-row items-center gap-4">
            <Plus color="black" />
            <Text className="text-primary-foreground font-bold hidden md:block">Deposit</Text>
          </View>
        </View>
      </DialogTrigger>
      <DialogContent className="p-8 md:min-h-[40rem] md:gap-8 md:max-w-md">
        <DialogTitle className="text-2xl">Deposit</DialogTitle>
        <View className="gap-4">
          {address ? <DepositToVaultForm setOpen={setOpen} /> : <DepositOptions />}
        </View>
      </DialogContent>
    </Dialog>
  )
}

export default DepositFromAnotherWallet
