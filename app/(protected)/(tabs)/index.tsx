import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Address } from "viem";

import DepositAddressModal from "@/components/DepositAddress/DepositAddressModal";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import { Text } from "@/components/ui/text";
import { SavingCard, WalletCard, WalletTabs } from "@/components/Wallet";
import WithdrawToAddressModal from "@/components/WithdrawToAddressModal/WithdrawToAddressModal";
import { path } from "@/constants/path";
import { useLatestTokenTransfer, useTotalAPY } from "@/hooks/useAnalytics";
import { useBalances } from "@/hooks/useBalances";
import { useDimension } from "@/hooks/useDimension";
import useUser from "@/hooks/useUser";
import { useFuseVaultBalance } from "@/hooks/useVault";
import { ADDRESSES } from "@/lib/config";
import { formatNumber } from "@/lib/utils";
import { Link } from "expo-router";
import React, { useState } from "react";

// const points = 50;

export default function Wallet() {
  const { user } = useUser();
  const [isDepositAddressModalOpen, setIsDepositAddressModalOpen] = useState(false);
  const { data: fuseVaultBalance } = useFuseVaultBalance(
    user?.safeAddress as Address
  );
  const {
    totalUSD: totalBalance,
    ethereum,
    fuse,
    // soUSDValue,
    totalUSDExcludingSoUSD,
    // isLoading: isBalanceLoading
  } = useBalances();
  const { data: totalAPY } = useTotalAPY();
  const { data: lastTimestamp } = useLatestTokenTransfer(
    user?.safeAddress ?? "",
    ADDRESSES.fuse.vault
  );
  const { isDesktop } = useDimension();

  const hasFunds = ethereum.length > 0 || fuse.length > 0;

  return (
    <React.Fragment>
      {!isDesktop && <NavbarMobile />}
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
                <DepositAddressModal open={isDepositAddressModalOpen} setOpen={setIsDepositAddressModalOpen} />
                <WithdrawToAddressModal />
              </View>
            </View>

            {!hasFunds ? (
              <View className="flex-col md:flex-row items-center justify-between gap-6">
                {/* Fund your account card */}
                <LinearGradient
                  colors={['rgba(126, 126, 126, 0.25)', 'rgba(126, 126, 126, 0.175)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-full md:w-[50%] h-64 rounded-2xl p-6 flex justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-2xl font-semibold text-white mb-2">
                      Fund your account
                    </Text>
                    <Text className="text-gray-400 text-base leading-relaxed">
                      Fund your account with crypto{"\n"}you already own or with cash
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-end">
                    <TouchableOpacity className="bg-button-dark px-8 py-3 rounded-xl border border-[#4E4E4E]" onPress={() => setIsDepositAddressModalOpen(true)}>
                      <Text className="text-white font-medium">Add funds</Text>
                    </TouchableOpacity>

                    <Image
                      source={require('@/assets/images/fund_image.png')}
                      className="w-20 h-20"
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>

                {/* Earning opportunity card */}
                <LinearGradient
                  colors={['rgba(148, 242, 127, 0.25)', 'rgba(148, 242, 127, 0.175)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-full md:w-[50%] h-64 rounded-2xl p-6 flex justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-2xl font-semibold text-white mb-2">
                      Deposit your stablecoins{"\n"}and earn{" "}
                      <Text className="underline decoration-2">4.5%</Text> per year
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-end">
                    <Link href={path.SAVINGS} className="bg-button-earning px-6 py-3 rounded-xl">
                      <Text className="text-white font-medium">Start earning</Text>
                    </Link>

                    <Image
                      source={require('@/assets/images/deposit_image.png')}
                      className="w-20 h-20"
                      resizeMode="contain"
                    />
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View className="flex-col md:flex-row items-center justify-between gap-6">
                <WalletCard balance={totalUSDExcludingSoUSD ?? 0} className="w-full md:w-[50%] h-40" />
                <SavingCard
                  balance={fuseVaultBalance ?? 0}
                  apy={totalAPY ?? 0}
                  lastTimestamp={lastTimestamp ? lastTimestamp / 1000 : 0}
                  className="w-full md:w-[50%] h-40"
                />
              </View>
            )}

            {
              hasFunds && (
                <View className="md:mt-16">
                  <WalletTabs />
                </View>
              )
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
}
