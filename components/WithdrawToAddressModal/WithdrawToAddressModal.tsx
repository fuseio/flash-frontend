import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  WithdrawTitle,
  WithdrawToAddress,
  WithdrawTrigger
} from "."

const WithdrawToAddressModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <WithdrawTrigger />
      </DialogTrigger>
      <DialogContent className="md:gap-8 md:max-w-md bg-modal-background">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            <WithdrawTitle />
          </DialogTitle>
        </DialogHeader>
        <WithdrawToAddress />
      </DialogContent>
    </Dialog>
  )
}

export default WithdrawToAddressModal
