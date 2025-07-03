import {
    calculateOriginalDepositAmount,
    getEarliestDepositTimestamp
} from "@/lib/utils/financial";
import { useMemo } from "react";


export const useDashboardCalculations = (
    userDepositTransactions: any,
    balance?: number,
    lastTimestamp?: number
) => {
    const originalDepositAmount = useMemo(() => {
        const calculated = calculateOriginalDepositAmount(userDepositTransactions);
        if (calculated === 0 && balance && balance > 0) {
            return balance;
        }
        return calculated;
    }, [userDepositTransactions, balance]);

    const firstDepositTimestamp = useMemo(() => {
        return getEarliestDepositTimestamp(userDepositTransactions, lastTimestamp);
    }, [userDepositTransactions, lastTimestamp]);

    return {
        originalDepositAmount,
        firstDepositTimestamp,
    };
}; 