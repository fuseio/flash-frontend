import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { Text } from "@/components/ui/text";

interface SavingCountUpProps {
  balance: number;
  apy: number;
  lastTimestamp: number;
}

const SECONDS_PER_YEAR = 31_557_600;

const SavingCountUp = ({ balance, apy, lastTimestamp }: SavingCountUpProps) => {
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
  const decimalPart = (liveYield - wholeNumber).toFixed(7).slice(1);

  return (
    <View className="flex-row items-baseline">
      <Text className="text-4xl md:text-8xl font-medium">{wholeNumber}</Text>
      <Text className="text-2xl md:text-4.5xl font-medium">{decimalPart}</Text>
    </View>
  );
};

export default SavingCountUp;
