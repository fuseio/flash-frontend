import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Withdraw,
  WithdrawFooter,
  WithdrawTitle,
  WithdrawTrigger
} from "."

const WithdrawModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <WithdrawTrigger />
      </DialogTrigger>
      <DialogContent className="md:gap-8 md:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            <WithdrawTitle />
          </DialogTitle>
        </DialogHeader>
        <Withdraw />
        <DialogFooter>
          <WithdrawFooter />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WithdrawModal
