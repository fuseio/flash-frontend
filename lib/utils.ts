import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Address } from "viem"

import { refreshToken } from "./api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function eclipseAddress(address: Address, start = 6, end = 4) {
  return address.slice(0, start) + "..." + address.slice(-end)
}

export function compactNumberFormat(number: number) {
  return new Intl.NumberFormat('en-us', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(number)
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

export const withRefreshToken = async <T>(
  promise: Promise<T>,
  { onError }: { onError?: () => void } = {}
): Promise<T | undefined> => {
  try {
    return await promise;
  } catch (error: any) {
    if (error?.status !== 401) {
      console.error(error);
      throw error;
    }
    try {
      await refreshToken();
      return await promise;
    } catch (refreshTokenError) {
      console.error(refreshTokenError)
      onError?.();
    }
  }
}
