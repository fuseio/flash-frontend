import { Address } from "viem";

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
  credentialId: string;
};

export interface User {
  username: string
  safeAddress: Address
  selected: boolean
  passkey: {
    rawId: string
    coordinates: PasskeyCoordinates,
    credentialId: string,
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

export type KycLink = {
  link: string;
  tosLink: string;
}

export type BridgeCustomerResponse = {
  bridgeCustomerId: string;
  kycStatus: KycStatus;
  tosStatus: TermsOfServiceStatus;
  kycLinkId: string;
}

export enum KycStatus {
  NOT_STARTED = 'not_started',
  INCOMPLETE = 'incomplete',
  AWAITING_UBO = 'awaiting_ubo',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAUSED = 'paused',
  OFFBOARDED = 'offboarded',
}

export enum TermsOfServiceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}