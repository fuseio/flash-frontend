import { Address } from "viem"

export enum Status {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
}

// from @safe-global/protocol-kit as the package
// is throwing static class blocks error
export type PasskeyCoordinates = {
  x: string;
  y: string;
};

export type PasskeyArgType = {
  rawId: string;
  coordinates: PasskeyCoordinates;
  customVerifierAddress?: string;
};

export interface User {
  username: string
  safeAddress: Address
  passkey: {
    rawId: string
    coordinates: PasskeyCoordinates
  }
}

export interface TokenTransfer {
  items: {
    timestamp: string
  }[]
}

export type Token = {
  name: string;
  address: Address;
  symbol: string;
  decimals: number;
  imageId: string;
  coingeckoId: string;
  isComingSoon?: boolean;
}

export type TokenWithBalance = Token & {
  balance: number;
  balanceUSD: number;
}

export type TokenMap = {
  [key in number]: Token[];
}

export type TokenPriceUsd = {
  [key: string]: {
    usd: number;
  };
};
