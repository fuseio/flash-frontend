import axios from "axios";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "react-native-passkeys/src/ReactNativePasskeys.types";

import {
  EXPO_PUBLIC_COIN_GECKO_API_KEY,
  EXPO_PUBLIC_FLASH_ANALYTICS_API_BASE_URL,
  EXPO_PUBLIC_FLASH_API_BASE_URL,
} from "./config";
import { TokenPriceUsd, TokenTransfer, User } from "./types";

export const refreshToken = () => {
	return fetch(
		`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/auths/refresh-token`,
		{
			method: "POST",
			credentials: "include",
		},
	);
};

// use fetch because some browser doesn't support fetch wrappers such as axios
// see: https://simplewebauthn.dev/docs/advanced/browser-quirks#safari
export const generateRegistrationOptions = async (username: string) => {
	const response = await fetch(
		`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/passkeys/registration/generate-options`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ username }),
		},
	);
	if (!response.ok) throw response;
	return response.json();
};

export const verifyRegistration = async (
	registrationResponse: RegistrationResponseJSON,
	address: string,
): Promise<User> => {
	const response = await fetch(
		`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/passkeys/registration/verify`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ ...registrationResponse, address }),
		},
	);
	if (!response.ok) throw response;
	return response.json();
};

export const generateAuthenticationOptions = async () => {
	const response = await fetch(
		`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/passkeys/authentication/generate-options`,
		{
			credentials: "include",
		},
	);
	if (!response.ok) throw response;
	return response.json();
};

export const verifyAuthentication = async (
	authenticationResponse: AuthenticationResponseJSON,
): Promise<User> => {
	const response = await fetch(
		`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/passkeys/authentication/verify`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(authenticationResponse),
		},
	);
	if (!response.ok) throw response;
	return response.json();
};

export const fetchTotalAPY = async () => {
	const response = await axios.get<number>(
		`${EXPO_PUBLIC_FLASH_ANALYTICS_API_BASE_URL}/analytics/v1/yields/total-apy`,
	);
	return response.data;
};

export const fetchTokenTransfer = async (
	address: string,
	token: string,
	type = "ERC-20",
	filter = "to",
) => {
	const response = await axios.get<TokenTransfer>(
		`https://explorer.fuse.io/api/v2/addresses/${address}/token-transfers?type=${type}&filter=${filter}&token=${token}`,
	);
	return response.data;
};

export const fetchTokenPriceUsd = async (token: string) => {
	const response = await axios.get<TokenPriceUsd>(
		`https://pro-api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`,
		{
			headers: {
				"x-cg-pro-api-key": EXPO_PUBLIC_COIN_GECKO_API_KEY,
			},
		},
	);
	return response.data[token].usd;
};
