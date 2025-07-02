import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Address } from "viem";
import { fuse, mainnet } from "viem/chains";
import { useBalance } from "wagmi";

import NavbarMobile from "@/components/Navbar/NavbarMobile";
import { Text } from "@/components/ui/text";
import { WalletTabs } from "@/components/Wallet";
import WithdrawToAddressModal from "@/components/WithdrawToAddressModal/WithdrawToAddressModal";
import { useBalances } from "@/hooks/useBalances";
import { useDimension } from "@/hooks/useDimension";
import useUser from "@/hooks/useUser";
import { ADDRESSES } from "@/lib/config";
import { formatNumber } from "@/lib/utils";
import Navbar from "@/components/Navbar";

export default function Wallet() {
  const { user } = useUser();
  const {
    totalUSD: totalBalance,
    ethereumTokens,
    fuseTokens,
    refresh,
  } = useBalances();
  const { isDesktop } = useDimension();
  const { data: usdcBalance } = useBalance({
    address: user?.safeAddress as Address,
    token: ADDRESSES.ethereum.usdc,
    chainId: mainnet.id,
  })
  const { data: soUSDBalance } = useBalance({
    address: user?.safeAddress as Address,
    token: ADDRESSES.fuse.vault,
    chainId: fuse.id,
  })

  useEffect(() => {
    refresh()
  }, [soUSDBalance, usdcBalance])

  const hasFunds = ethereumTokens.length > 0 || fuseTokens.length > 0;

  return (
    <React.Fragment>
      {!isDesktop && <NavbarMobile />}
      <SafeAreaView
        className="bg-background text-foreground flex-1"
        edges={['right', 'left', 'bottom']}
      >
        <ScrollView className="flex-1">
          {isDesktop && <Navbar />}
          <View className="gap-16 px-4 py-8 md:py-16 w-full max-w-7xl mx-auto">
            <View className="flex-col md:flex-row items-center justify-between gap-y-4">
              <View className="flex-row items-center gap-6">
                <Text className="text-5xl font-semibold">${formatNumber(totalBalance ?? 0)}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <WithdrawToAddressModal />
              </View>
            </View>

            {hasFunds && (
              <View className="md:mt-6">
                <WalletTabs />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
}
