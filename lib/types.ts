import { type TurnkeyApiTypes } from "@turnkey/sdk-react-native";
import { CountryCode } from "react-native-country-picker-modal";
import { Address } from "viem";

export enum LoginMethod {
  Passkey = "PASSKEY",
  Email = "EMAIL",
  Phone = "PHONE",
  OAuth = "OAUTH",
}

export enum OtpType {
  Email = "OTP_TYPE_EMAIL",
  Sms = "OTP_TYPE_SMS",
}

export enum HashFunction {
  NoOp = "HASH_FUNCTION_NO_OP",
  SHA256 = "HASH_FUNCTION_SHA256",
  KECCAK256 = "HASH_FUNCTION_KECCAK256",
  NotApplicable = "HASH_FUNCTION_NOT_APPLICABLE",
}

export enum PayloadEncoding {
  Hexadecimal = "PAYLOAD_ENCODING_HEXADECIMAL",
  TextUTF8 = "PAYLOAD_ENCODING_TEXT_UTF8",
}

export interface ParsedPhoneNumber {
  country: CountryCode;
  nationalNumber: string;
}

export type SignRawPayloadResult = TurnkeyApiTypes["v1SignRawPayloadResult"];


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
  isDeposited?: boolean;
}

export interface BlockscoutTransaction {
  items: {
    to: {
      hash: Address;
    },
    token: {
      address: Address;
    },
    total: {
      decimals: string;
      value: string;
    },
    transaction_hash: string,
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

export enum CardStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  FROZEN = 'frozen',
}

enum FreezeReason {
  LOST_OR_STOLEN = 'lost_or_stolen',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  PLANNED_INACTIVITY = 'planned_inactivity',
  SUSPECTED_FRAUD = 'suspected_fraud',
  OTHER = 'other',
}

enum FreezeInitiator {
  BRIDGE = 'bridge',
  DEVELOPER = 'developer',
  CUSTOMER = 'customer',
}

interface CardDetails {
  last_4: string;
  expiry: string;
  bin: string;
}

interface Balance {
  amount: string;
  currency: string;
}

interface Balances {
  available: Balance;
  hold: Balance;
}

interface CryptoAccount {
  type: string;
  address: string;
}

interface FundingInstructions {
  currency: string;
  chain: string;
  address: string;
  memo: string;
}

interface Freeze {
  initiator: FreezeInitiator;
  card_account_id: string;
  reason: FreezeReason;
  reason_detail?: string;
  starting_at?: string;
  ending_at?: string;
  created_at: string;
}

export interface CardResponse {
  id: string;
  client_reference_id: string;
  customer_id: string;
  card_image_url: string;
  status: CardStatus;
  status_reason: string;
  card_details: CardDetails;
  balances: Balances;
  freezes: Freeze[];
  crypto_account: CryptoAccount;
  funding_instructions: FundingInstructions;
}

export interface CardStatusResponse {
  status: CardStatus;
}

export enum LayerZeroTransactionStatus {
  INFLIGHT = "INFLIGHT",
  CONFIRMING = "CONFIRMING",
  FAILED = "FAILED",
  DELIVERED = "DELIVERED",
  BLOCKED = "BLOCKED",
  PAYLOAD_STORED = "PAYLOAD_STORED",
  APPLICATION_BURNED = "APPLICATION_BURNED",
  APPLICATION_SKIPPED = "APPLICATION_SKIPPED",
  UNRESOLVABLE_COMMAND = "UNRESOLVABLE_COMMAND",
  MALFORMED_COMMAND = "MALFORMED_COMMAND"
}

export type LayerZeroTransaction = {
  data: {
    status: {
      name: LayerZeroTransactionStatus;
    };
  }[];
}

export type Transaction = {
  title: string;
  timestamp: string;
  amount: number;
  status: LayerZeroTransactionStatus;
}

export type Faq = {
  question: string;
  answer: string;
}

export type StatusInfo = {
  status: Status;
  message?: string;
}
