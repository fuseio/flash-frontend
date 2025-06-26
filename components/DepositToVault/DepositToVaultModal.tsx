import { useAccount } from "wagmi"
import { ArrowLeft } from "lucide-react-native"
import { View } from "react-native"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DepositToVaultForm from "./DepositToVaultForm"
import { useDepositStore } from "@/store/useDepositStore"
import { DepositModal } from "@/lib/types"
import { Button } from "../ui/button"

const DepositToVaultModal = () => {
  const { depositModal, setDepositModal } = useDepositStore();
  const { address } = useAccount();

  return (
    <Dialog
      open={address && depositModal === DepositModal.OPEN_FORM}
      onOpenChange={() => setDepositModal(DepositModal.CLOSE)}
    >
      <DialogContent className="p-8 pt-6 md:gap-8 md:max-w-md">
        <DialogHeader className="flex-row justify-between items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-full p-0 web:hover:bg-transparent web:hover:opacity-70"
            onPress={() => setDepositModal(DepositModal.OPEN_OPTIONS)}
          >
            <ArrowLeft color="white" size={20} />
          </Button>
          <DialogTitle className="text-2xl">Deposit</DialogTitle>
          <View className="w-10" />
        </DialogHeader>
        <DepositToVaultForm />
      </DialogContent>
    </Dialog>
  )
}

export default DepositToVaultModal
