import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Withdraw,
  WithdrawTitle,
  WithdrawTrigger
} from "."

const WithdrawModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <WithdrawTrigger />
      </DialogTrigger>
      <DialogContent className="md:gap-8 md:max-w-sm bg-modal-background">
        <DialogHeader>
          <DialogTitle>
            <WithdrawTitle />
          </DialogTitle>
        </DialogHeader>
        <Withdraw />
      </DialogContent>
    </Dialog>
  )
}

export default WithdrawModal
