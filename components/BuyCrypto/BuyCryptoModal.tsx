import { View } from "react-native";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useBuyCryptoStore } from "@/store/useBuyCryptoStore";
import { buttonVariants } from "../ui/button";
import BuyCrypto from "./index";

const BuyCryptoModal = () => {
  const { isOpen, closeModal } = useBuyCryptoStore();

  console.log("BuyCryptoModal render - isOpen:", isOpen);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <View
          className={buttonVariants({
            variant: "secondary",
            className: "h-12 rounded-xl",
          })}
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-primary-foreground font-bold">
              Buy Crypto
            </Text>
          </View>
        </View>
      </DialogTrigger>
      <DialogContent className="p-0 md:max-w-4xl max-w-[95%] h-[90%]">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl">Buy Crypto</DialogTitle>
        </DialogHeader>
        <View className="flex-1">
          <BuyCrypto />
        </View>
      </DialogContent>
    </Dialog>
  );
};

export default BuyCryptoModal;
