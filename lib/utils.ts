import { clsx, type ClassValue } from 'clsx';
import { Platform } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Address } from "viem";

import { refreshToken } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function eclipseAddress(address: Address, start = 6, end = 4) {
  return address.slice(0, start) + "..." + address.slice(-end);
}

export function eclipseUsername(username: string, start = 10) {
  return username.slice(0, start) + (username.length > start ? "..." : "");
}

export function compactNumberFormat(number: number) {
  return new Intl.NumberFormat('en-us', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(number);
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat('en-us', {
    maximumFractionDigits: 2,
  }).format(number);
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

let globalLogoutHandler: (() => void) | null = null;

export const setGlobalLogoutHandler = (handler: () => void) => {
  globalLogoutHandler = handler;
};

export const withRefreshToken = async <T>(
  apiCall: () => Promise<T>,
  { onError }: { onError?: () => void } = {},
): Promise<T | undefined> => {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error?.status !== 401) {
      console.error(error);
      throw error;
    }
    try {
      await refreshToken();
      return await apiCall();
    } catch (refreshTokenError) {
      console.error(refreshTokenError);
      if (onError) {
        onError();
      } else {
        globalLogoutHandler?.();
      }
    }
  }
};

// see: https://github.com/MasterKale/SimpleWebAuthn/blob/736ea0360953d7ce6a0b4390ce260d0bcab1e191/packages/browser/src/helpers/bufferToBase64URLString.ts
export function bufferToBase64URLString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }

  const base64String = btoa(str);

  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function isDesktop() {
  if (Platform.OS !== 'web') return false;
  return window.innerWidth >= 768;
}
