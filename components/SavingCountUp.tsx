import {useCallback, useEffect, useState} from "react";
import {TextStyle, View} from "react-native";
import {AnimatedRollingNumber} from "react-native-animated-rolling-numbers";

import {Text} from "@/components/ui/text";
import {cn} from "@/lib/utils";

type ClassNames = {
  wrapper?: string;
  decimalSeparator?: string;
};

type Styles = {
  wholeText?: TextStyle;
  decimalText?: TextStyle;
};

interface SavingCountUpProps {
  balance: number;
  apy: number;
  lastTimestamp: number;
  principal?: number;
  mode?: "total" | "interest-only";
  decimalPlaces?: number;
  classNames?: ClassNames;
  styles?: Styles;
}

const SECONDS_PER_YEAR = 31_557_600;
const DURATION = 500;

const SavingCountUp = ({
  balance,
  apy,
  lastTimestamp,
  principal,
  mode = "total",
  decimalPlaces = 2,
  classNames,
  styles,
}: SavingCountUpProps) => {
  const [liveYield, setLiveYield] = useState<number>(0);

  const calculateLiveYield = useCallback(
    (currentTime: number) => {
      if (principal !== undefined && principal > 0) {
        const deltaTime = currentTime - lastTimestamp;
        const timeInYears = deltaTime / SECONDS_PER_YEAR;

        const compoundedValue =
          principal * Math.pow(1 + apy / 100, timeInYears);

        if (mode === "interest-only") {
          return compoundedValue - principal;
        } else {
          return compoundedValue;
        }
      }
      if (mode === "interest-only") {
        const deltaTime = currentTime - lastTimestamp;
        const timeInYears = deltaTime / SECONDS_PER_YEAR;
        const estimatedInterest = balance * (apy / 100) * timeInYears;
        return estimatedInterest;
      }

      const deltaTime = currentTime - lastTimestamp;
      const yieldEarned = balance * (apy / SECONDS_PER_YEAR) * deltaTime;
      return balance + yieldEarned;
    },
    [balance, apy, lastTimestamp, principal, mode]
  );

  useEffect(() => {
    const updateYield = () => {
      const now = Math.floor(Date.now() / 1000);
      setLiveYield(calculateLiveYield(now));
    };

    updateYield();

    const interval = setInterval(updateYield, 1000);
    return () => clearInterval(interval);
  }, [balance, apy, lastTimestamp, principal, mode, calculateLiveYield]);

  const wholeNumber = Math.floor(liveYield);
  const decimalPart = Number(
    (liveYield - wholeNumber).toFixed(decimalPlaces).slice(2)
  );

  return (
    <View className={cn("flex-row items-baseline", classNames?.wrapper)}>
      <AnimatedRollingNumber
        value={wholeNumber}
        textStyle={styles?.wholeText}
        spinningAnimationConfig={{duration: DURATION}}
      />
      <Text className={classNames?.decimalSeparator}>.</Text>
      <AnimatedRollingNumber
        value={decimalPart}
        formattedText={decimalPart.toString().padStart(decimalPlaces, "0")}
        textStyle={styles?.decimalText}
        spinningAnimationConfig={{duration: DURATION}}
      />
    </View>
  );
};

export default SavingCountUp;
