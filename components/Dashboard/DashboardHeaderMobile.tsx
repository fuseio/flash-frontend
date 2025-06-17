import { View } from "react-native";
import { useRouter } from "expo-router";
import { CreditCard, Plus, RefreshCw, SendHorizontal } from "lucide-react-native";

import { Text } from "../ui/text";
import SavingCountUp from "../SavingCountUp";
import { path } from "@/constants/path";
import { Button } from "../ui/button";

interface DashboardHeaderMobileProps {
  balance: number;
  totalAPY: number;
  lastTimestamp: number;
}

const DashboardHeaderMobile = ({ balance, totalAPY, lastTimestamp }: DashboardHeaderMobileProps) => {
  const router = useRouter();

  return (
    <View className="gap-10 mt-20">
      <View className="flex-row justify-center items-center">
        <Text className="text-5xl font-semibold mt-2.5">$</Text>
        <SavingCountUp
          balance={balance ?? 0}
          apy={totalAPY ?? 0}
          lastTimestamp={lastTimestamp ? lastTimestamp / 1000 : 0}
        />
      </View>

      <View className="flex-row justify-between items-center gap-4 w-full max-w-sm mx-auto">
        <View className="gap-2 items-center">
          <Button
            variant="brand"
            size="icon"
            className="h-14 w-14 rounded-full"
            onPress={() => router.push(path.DEPOSIT)}
          >
            <Plus size={32} />
          </Button>
          <Text className="text-muted-foreground font-medium">Fund</Text>
        </View>

        <View className="gap-2 items-center">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full"
            onPress={() => router.push(path.SEND)}
          >
            <SendHorizontal size={28} />
          </Button>
          <Text className="text-muted-foreground font-medium">Send</Text>
        </View>

        <View className="gap-2 items-center">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full"
            onPress={() => router.push(path.CARD)}
          >
            <CreditCard size={28} />
          </Button>
          <Text className="text-muted-foreground font-medium">Card</Text>
        </View>

        <View className="gap-2 items-center">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full"
            onPress={() => router.push(path.DEPOSIT)}
          >
            <RefreshCw size={28} />
          </Button>
          <Text className="text-muted-foreground font-medium">Swap</Text>
        </View>
      </View>
    </View>
  )
}

export default DashboardHeaderMobile;
