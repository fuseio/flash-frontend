import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Address } from "viem";

import DepositAddressModal from "@/components/DepositAddress/DepositAddressModal";
import { Text } from "@/components/ui/text";
import { SavingCard, WalletCard, WalletTabs } from "@/components/Wallet";
import WithdrawToAddressModal from "@/components/WithdrawToAddressModal/WithdrawToAddressModal";
import { useLatestTokenTransfer, useTotalAPY } from "@/hooks/useAnalytics";
import { useBalances } from "@/hooks/useBalances";
import useUser from "@/hooks/useUser";
import { useFuseVaultBalance } from "@/hooks/useVault";
import { ADDRESSES } from "@/lib/config";
import { formatNumber } from "@/lib/utils";

// const points = 50;

export default function Wallet() {
  const { user } = useUser();
  const { data: fuseVaultBalance } = useFuseVaultBalance(
    user?.safeAddress as Address
  );
  const {
    totalUSD: totalBalance,
    // soUSDValue,
    totalUSDExcludingSoUSD,
    // isLoading: isBalanceLoading
  } = useBalances(user?.safeAddress);
  const { data: totalAPY } = useTotalAPY();
  const { data: lastTimestamp } = useLatestTokenTransfer(
    user?.safeAddress ?? "",
    ADDRESSES.fuse.vault
  );

  return (
    <SafeAreaView
      className="bg-background text-foreground flex-1"
      edges={['right', 'left', 'bottom']}
    >
      <ScrollView className="flex-1">
        <View className="gap-16 px-4 py-8 md:py-16 w-full max-w-7xl mx-auto">
          <View className="flex-col md:flex-row items-center justify-between gap-y-4">
            <View className="flex-row items-center gap-6">
              <Text className="text-5xl font-semibold">${formatNumber(totalBalance ?? 0)}</Text>
              {/* <PointsBadge points={points} /> */}
            </View>

            <View className="flex-row items-center gap-2">
              <DepositAddressModal />
              <WithdrawToAddressModal />
            </View>
          </View>

          <View className="flex-col md:flex-row items-center justify-between gap-6">
            <WalletCard balance={totalUSDExcludingSoUSD ?? 0} className="w-full md:w-[50%] h-40" />
            <SavingCard
              balance={fuseVaultBalance ?? 0}
              apy={totalAPY ?? 0}
              lastTimestamp={lastTimestamp ? lastTimestamp / 1000 : 0}
              className="w-full md:w-[50%] h-40"
            />
          </View>

          <View className="md:mt-16">
            <WalletTabs />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
