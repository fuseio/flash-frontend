import { Image } from "expo-image";
import { View } from "react-native";

import { LayerZeroTransactionStatus } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { Text } from "./ui/text";

const Transaction = ({
  title,
  timestamp,
  amount,
  status,
}: {
  title: string;
  timestamp: string;
  amount: number;
  status: LayerZeroTransactionStatus;
}) => {
  const isSuccess = status === LayerZeroTransactionStatus.DELIVERED;
  const isPending =
    status === LayerZeroTransactionStatus.INFLIGHT ||
    status === LayerZeroTransactionStatus.CONFIRMING;

  const statusColor = isSuccess
    ? "bg-brand"
    : isPending
      ? "bg-yellow-500"
      : "bg-red-500";
  const statusText = isSuccess ? "Success" : isPending ? "Pending" : "Failed";

  return (
    <View className="flex-row items-center justify-between bg-card p-2 md:px-6 md:py-4 rounded-xl md:rounded-twice">
      <View className="flex-row items-center gap-2 md:gap-4">
        <Image
          source={require("@/assets/images/usdc.png")}
          style={{ width: 34, height: 34 }}
        />
        <View>
          <Text className="text-lg font-medium">{title}</Text>
          <Text className="text-sm text-muted-foreground">
            {new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2 md:gap-4">
        <Text className="text-lg font-medium">${formatNumber(amount, 5)}</Text>
        <View
          className={cn(
            "w-20 h-8 rounded-twice items-center justify-center",
            statusColor
          )}
        >
          <Text className="text-sm text-primary-foreground font-medium">
            {statusText}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Transaction;
