import { useCallback, useEffect, useState } from 'react';
import { TextStyle, View } from 'react-native';
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";

import { Text } from "@/components/ui/text";
import { cn } from '@/lib/utils';

type ClassNames = {
  wrapper?: string;
  decimalSeparator?: string;
}

type Styles = {
  wholeText?: TextStyle;
  decimalText?: TextStyle;
}

interface SavingCountUpProps {
  balance: number;
  apy: number;
  lastTimestamp: number;
  classNames?: ClassNames;
  styles?: Styles;
}

const SECONDS_PER_YEAR = 31_557_600;
const DURATION = 500;
const DECIMAL_PLACES = 2;

const SavingCountUp = ({ balance, apy, lastTimestamp, classNames, styles }: SavingCountUpProps) => {
  const [liveYield, setLiveYield] = useState<number>(0);

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
  const decimalPart = Number((liveYield - wholeNumber).toFixed(DECIMAL_PLACES).slice(2));

  return (
    <View className={cn("flex-row items-baseline", classNames?.wrapper)}>
      <AnimatedRollingNumber
        value={wholeNumber}
        textStyle={styles?.wholeText}
        spinningAnimationConfig={{ duration: DURATION }}
      />
      <Text className={classNames?.decimalSeparator}>.</Text>
      <AnimatedRollingNumber
        value={decimalPart}
        formattedText={decimalPart.toString().padStart(DECIMAL_PLACES, '0')}
        textStyle={styles?.decimalText}
        spinningAnimationConfig={{ duration: DURATION }}
      />
    </View>
  );
};

export default SavingCountUp;
