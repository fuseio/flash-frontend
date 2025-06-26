import React, { useEffect } from "react"
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
import { useDepositStore } from "@/store/useDepositStore"
import { DepositModal } from "@/lib/types"
import { DepositToVaultModal } from "../DepositToVault"

const DepositOptionModal = () => {
  const { depositModal, setDepositModal } = useDepositStore();
  const { status } = useAccount()

  useEffect(() => {
    if (status === "disconnected" && depositModal !== DepositModal.CLOSE) {
      setDepositModal(DepositModal.OPEN_OPTIONS);
    }
  }, [status, setDepositModal]);

  return (
    <>
      <DepositToVaultModal />
      <Dialog
        open={depositModal === DepositModal.OPEN_OPTIONS}
        onOpenChange={(value) => {
          setDepositModal(value ? DepositModal.OPEN_OPTIONS : DepositModal.CLOSE)
        }}
      >
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
          <DepositOptions />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DepositOptionModal
