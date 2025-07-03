import { formatUnits } from "viem";


export const SECONDS_PER_YEAR = 31_557_600;

export const calculateOriginalDepositAmount = (userDepositTransactions: any): number => {
    if (!userDepositTransactions?.deposits?.length) {
        return 0;
    }

    return userDepositTransactions.deposits.reduce(
        (total: number, deposit: any) => {
            const depositAmount = Number(
                formatUnits(BigInt(deposit.depositAmount), 6)
            );
            return total + depositAmount;
        },
        0
    );
};

export const getEarliestDepositTimestamp = (
    userDepositTransactions: any,
    fallbackTimestamp?: number
): number | undefined => {
    if (!userDepositTransactions?.deposits?.length) {
        return fallbackTimestamp;
    }

    const earliestDeposit = userDepositTransactions.deposits.reduce(
        (earliest: any, deposit: any) => {
            const depositTime = Number(deposit.depositTimestamp);
            const earliestTime = earliest ? Number(earliest.depositTimestamp) : Infinity;
            return depositTime < earliestTime ? deposit : earliest;
        },
        null
    );

    return earliestDeposit ? Number(earliestDeposit.depositTimestamp) : fallbackTimestamp;
};

export const calculateCompoundInterest = (
    principal: number,
    apy: number,
    timeInSeconds: number
): number => {
    const timeInYears = timeInSeconds / SECONDS_PER_YEAR;
    return principal * Math.pow(1 + (apy / 100), timeInYears);
}; 