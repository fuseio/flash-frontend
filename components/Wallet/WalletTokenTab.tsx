import { FlashList } from '@shopify/flash-list';
import React, { useMemo, useState } from 'react';
import { Image, LayoutChangeEvent, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Text } from '@/components/ui/text';
import { cn, compactNumberFormat, formatNumber } from '@/lib/utils';
import { useDimension } from '@/hooks/useDimension';

const TOKENS = new Array(2).fill(0).map(() => ({
  name: "USDC",
  balance: 0.0026476,
  balanceUSD: 2131.96,
  balanceUSDChange: -0.8,
  priceUSD: 2131.96,
  priceUSDChange: -4,
  network: "Ethereum"
}));

const MIN_COLUMN_WIDTHS = new Array(4).fill(50);

const WalletTokenTab = () => {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const { isScreenMedium } = useDimension();

  const format = isScreenMedium ? formatNumber : compactNumberFormat;

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setWidth(width);
  };

  const columnWidths = useMemo(() => {
    return MIN_COLUMN_WIDTHS.map((minWidth) => {
      const evenWidth = width / MIN_COLUMN_WIDTHS.length;
      return evenWidth > minWidth ? evenWidth : minWidth;
    });
  }, [width]);

  return (
    <>
      <View className='w-full' onLayout={handleLayout} />
      <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false}>
        <Table aria-labelledby='token-table'>
          <TableHeader>
            <TableRow className='border-0 web:hover:bg-transparent'>
              <TableHead className='px-3 md:px-6' style={{ width: columnWidths[0] }}>
                <Text className="text-sm">Asset</Text>
              </TableHead>
              <TableHead className='px-3 md:px-6' style={{ width: columnWidths[1] }}>
                <Text className="text-sm">Balance</Text>
              </TableHead>
              <TableHead className='px-3 md:px-6' style={{ width: columnWidths[2] }}>
                <Text className="text-sm">Price</Text>
              </TableHead>
              <TableHead className='px-3 md:px-6' style={{ width: columnWidths[3] }}>
                <Text className="text-sm">Networks</Text>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <FlashList
              data={TOKENS}
              estimatedItemSize={45}
              contentContainerStyle={{
                paddingBottom: insets.bottom,
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: token, index }) => {
                return (
                  <TableRow
                    key={token.name}
                    className={cn('bg-card active:bg-secondary items-center border-border/40',
                      index === 0 && 'rounded-t-twice',
                      index === TOKENS.length - 1 && 'rounded-b-twice border-0',
                    )}
                  >
                    <TableCell className="p-3 md:p-6" style={{ width: columnWidths[0] }}>
                      <View className='flex-row items-center gap-2'>
                        <Image source={require('@/assets/images/usdc.png')} style={{ width: isScreenMedium ? 34 : 24, height: isScreenMedium ? 34 : 24 }} />
                        <View className='items-start'>
                          <Text className='font-bold'>{token.name}</Text>
                          <Text className='text-sm text-muted-foreground'>
                            {isScreenMedium ?
                              token.balance :
                              !token.balance ?
                                "0" :
                                token.balance < 0.001 ?
                                  "<0.001" :
                                  token.balance.toFixed(3)
                            } {isScreenMedium ? token.name : ''}
                          </Text>
                        </View>
                      </View>
                    </TableCell>
                    <TableCell className="p-3 md:p-6" style={{ width: columnWidths[1] }}>
                      <View className='items-start'>
                        <Text className='font-bold'>${format(token.balanceUSD)}</Text>
                        <Text className={cn(
                          'text-sm text-muted-foreground font-medium',
                          token.balanceUSDChange > 0 ? 'text-green-500' : 'text-red-500'
                        )}>
                          {token.balanceUSDChange > 0 ? '+' : '-'}${format(Math.abs(token.balanceUSDChange))}
                        </Text>
                      </View>
                    </TableCell>
                    <TableCell className="p-3 md:p-6" style={{ width: columnWidths[2] }}>
                      <View className='items-start'>
                        <Text className='font-bold'>${format(token.balanceUSD)}</Text>
                        <Text className={cn(
                          'text-sm text-muted-foreground font-medium',
                          token.balanceUSDChange > 0 ? 'text-green-500' : 'text-red-500'
                        )}>
                          {token.balanceUSDChange > 0 ? '+' : '-'}${format(Math.abs(token.balanceUSDChange))}
                        </Text>
                      </View>
                    </TableCell>
                    <TableCell className="p-3 md:p-6" style={{ width: columnWidths[3] }}>
                      <Image source={require('@/assets/images/ethereum-square-4x.png')} style={{ width: 21, height: 21 }} />
                    </TableCell>
                  </TableRow>
                );
              }}
            />
          </TableBody>
        </Table>
      </ScrollView>
    </>
  );
}

export default WalletTokenTab;
