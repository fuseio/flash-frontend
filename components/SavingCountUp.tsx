import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";

import { Text } from "@/components/ui/text";
import { useDimension } from '@/hooks/useDimension';

interface SavingCountUpProps {
  balance: number;
  apy: number;
  lastTimestamp: number;
}

const SECONDS_PER_YEAR = 31_557_600;
const DURATION = 500;

const SavingCountUp = ({ balance, apy, lastTimestamp }: SavingCountUpProps) => {
  const [liveYield, setLiveYield] = useState<number>(0);
  const { isDesktop } = useDimension();

  const calculateLiveYield = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimestamp;
    const yieldEarned = balance * (apy / SECONDS_PER_YEAR) * deltaTime;
    const totalBalance = balance + yieldEarned;
    return totalBalance;
  }, [balance, apy, lastTimestamp]);

  useEffect(() => {
    const updateYield = () => {
      const now = Math.floor(Date.now() / 1000);
      setLiveYield(calculateLiveYield(now));
    };

    updateYield();

    const interval = setInterval(updateYield, 1000);
    return () => clearInterval(interval);
  }, [balance, apy, lastTimestamp, calculateLiveYield]);

  const wholeNumber = Math.floor(liveYield);
  const decimalPart = Number((liveYield - wholeNumber).toFixed(7).slice(2));

  return (
    <View className="flex-row items-baseline text-foreground">
      <AnimatedRollingNumber
        value={wholeNumber}
        textStyle={{ fontSize: isDesktop ? 96 : 36, ...styles.digit }}
        spinningAnimationConfig={{ duration: DURATION }}
      />
      <Text className="text-2xl md:text-4.5xl font-medium">.</Text>
      <AnimatedRollingNumber
        value={decimalPart}
        formattedText={decimalPart.toString().padStart(7, '0')}
        textStyle={{ fontSize: isDesktop ? 40 : 24, ...styles.digit }}
        spinningAnimationConfig={{ duration: DURATION }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  digit: {
    fontWeight: "medium",
    color: "#ffffff",
  },
});

export default SavingCountUp;
