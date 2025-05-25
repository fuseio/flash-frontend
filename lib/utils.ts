import { clsx, type ClassValue } from 'clsx';
import { Platform } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Address, keccak256, toHex } from "viem";

import { refreshToken } from "./api";
import { PasskeyCoordinates } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function eclipseAddress(address: Address, start = 6, end = 4) {
  return address.slice(0, start) + "..." + address.slice(-end)
}

export function eclipseUsername(username: string, start = 10) {
  return username.slice(0, start) + (username.length > start ? "..." : "")
}

export function compactNumberFormat(number: number) {
  return new Intl.NumberFormat('en-us', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(number)
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat('en-us', {
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

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Convert URL-safe base64 to standard base64 and add padding if needed
  const standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = standardBase64 + '='.repeat((4 - standardBase64.length % 4) % 4);

  const binaryString = atob(paddedBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function base64ToHex(base64: string): string {
  // Convert URL-safe base64 to standard base64 and add padding if needed
  const standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = standardBase64 + '='.repeat((4 - standardBase64.length % 4) % 4);

  const binaryString = atob(paddedBase64);
  let hex = '';
  for (let i = 0; i < binaryString.length; i++) {
    const byte = binaryString.charCodeAt(i);
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}

export async function decodePublicKeyForWeb(publicKey: string | ArrayBuffer): Promise<PasskeyCoordinates> {
  const algorithm = {
    name: 'ECDSA',
    namedCurve: 'P-256',
    hash: { name: 'SHA-256' }
  }

  const keyBuffer = typeof publicKey === 'string'
    ? base64ToArrayBuffer(publicKey)
    : publicKey

  const key = await crypto.subtle.importKey('spki', keyBuffer, algorithm, true, ['verify'])

  const { x, y } = await crypto.subtle.exportKey('jwk', key)

  const isValidCoordinates = !!x && !!y

  if (!isValidCoordinates) {
    throw new Error('Failed to generate passkey Coordinates. crypto.subtle.exportKey() failed')
  }

  return {
    x: '0x' + base64ToHex(x),
    y: '0x' + base64ToHex(y)
  }
}

export const getNonce = ({ appId }: { appId: string }): bigint => {
  const nonce = parseInt(localStorage.getItem("accountNonce") || "0");
  const encodedNonce = keccak256(toHex(appId + nonce.toString()));
  return BigInt(encodedNonce);
};
