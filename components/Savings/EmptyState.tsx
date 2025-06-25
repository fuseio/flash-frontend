import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NavbarMobile from "@/components/Navbar/NavbarMobile";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useTotalAPY } from "@/hooks/useAnalytics";
import { useDimension } from "@/hooks/useDimension";
import { DepositOptionModal } from "../DepositOption";

export default function SavingsEmptyState() {
  const { data: totalAPY, isLoading: isTotalAPYLoading } = useTotalAPY()
  const { isScreenMedium, isDesktop } = useDimension();

  return (
    <>
      {!isDesktop && <NavbarMobile />}
      <SafeAreaView
        className="bg-background text-foreground flex-1"
        edges={['right', 'left', 'bottom']}
      >
        <ScrollView className="flex-1">
          <View className="w-full max-w-7xl mx-auto gap-16 px-4 py-8">
            <View className="md:flex-row justify-between md:items-center gap-y-4">
              <View className="gap-3">
                <Text className="text-3xl font-semibold">
                  Your saving account
                </Text>
                <Text className="max-w-lg">
                  <Text className="opacity-70">
                    Our Solid vault will automatically manage your funds to maximize your yield without exposing you to unnecessary risk.
                  </Text>{" "}
                  <Link href="https://solid-3.gitbook.io/solid.xyz-docs" target="_blank" className='text-primary font-medium underline hover:opacity-70'>How it works</Link>
                </Text>
              </View>
              <View className="flex-row items-center gap-5 h-20">
                <DepositOptionModal />
                {/* <Link href={path.DEPOSIT} className={buttonVariants({ variant: "brand", className: "h-12 rounded-xl" })}>
                  <View className="flex-row items-center gap-2">
                    <Plus />
                    <Text className="text-primary-foreground font-bold">Deposit USD</Text>
                  </View>
                </Link> */}
              </View>
            </View>

            <LinearGradient
              colors={['rgba(148, 242, 127, 0.3)', 'rgba(148, 242, 127, 0.2)']}
              style={{
                borderRadius: isScreenMedium ? 20 : 12,
                padding: isScreenMedium ? 40 : 24,
                gap: isScreenMedium ? 96 : 40,
              }}
            >
              <Text className="text-4.5xl font-semibold max-w-lg">
                Deposit your stablecoins and earn {isTotalAPYLoading ?
                  <Skeleton className="w-24 h-10 bg-brand/20" /> :
                  <Text className="text-4.5xl text-brand font-bold underline">
                    {totalAPY?.toFixed(2)}%
                  </Text>
                } per year
              </Text>
              <View className="flex-col md:flex-row justify-between md:items-center gap-x-4 gap-y-10">
                <View className="gap-4">
                  <Image
                    source={require("@/assets/images/deposit.png")}
                    contentFit="contain"
                    style={{ width: 64, height: 64 }}
                  />
                  <Text className="text-3xl text-brand">
                    Deposit as little as $1
                  </Text>
                </View>
                <View className="gap-4">
                  <Image
                    source={require("@/assets/images/withdraw.png")}
                    contentFit="contain"
                    style={{ width: 64, height: 64 }}
                  />
                  <Text className="text-3xl text-brand">
                    Withdraw anytime
                  </Text>
                </View>
                <View className="gap-4">
                  <Image
                    source={require("@/assets/images/earn.png")}
                    contentFit="contain"
                    style={{ width: 64, height: 64 }}
                  />
                  <Text className="text-3xl text-brand">
                    Earn every second
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}