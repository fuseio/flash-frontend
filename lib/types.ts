import { PasskeyCoordinates } from "@safe-global/protocol-kit"
import { Address } from "viem"
import type { RegistrationResponseJSON } from "@simplewebauthn/browser"

export enum Status {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
}

export interface User {
  username: string
  safeAddress: Address
  passkey: {
    rawId: string
    coordinates: PasskeyCoordinates
  }
}

export interface RegistrationResponse extends RegistrationResponseJSON {
  safeAddress: Address
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
  image: string;
  coingeckoId: string;
  isComingSoon?: boolean;
}

export type TokenMap = {
  [key in number]: Token[];
}

export type TokenPriceUsd = {
  [key: string]: {
    usd: number;
  };
};
