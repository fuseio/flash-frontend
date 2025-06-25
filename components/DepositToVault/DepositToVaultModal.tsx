import { useAccount } from "wagmi"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import DepositToVaultForm from "./DepositToVaultForm"
import { useDepositStore } from "@/store/useDepositStore"
import { DepositModal } from "@/lib/types"

const DepositToVaultModal = () => {
  const { depositModal, setDepositModal } = useDepositStore();
  const { address } = useAccount();

  return (
    <Dialog
      open={address && depositModal === DepositModal.OPEN_FORM}
      onOpenChange={() => setDepositModal(DepositModal.CLOSE)}
    >
      <DialogContent className="p-8 md:gap-8 md:max-w-md">
        <DialogTitle className="text-2xl">Deposit</DialogTitle>
        <DepositToVaultForm />
      </DialogContent>
    </Dialog>
  )
}

export default DepositToVaultModal
