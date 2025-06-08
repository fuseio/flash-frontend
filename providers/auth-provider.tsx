import {
  EXPO_PUBLIC_FLASH_API_BASE_URL,
  PASSKEY_APP_NAME,
  RP_ID,
  TURNKEY_API_URL,
  TURNKEY_PARENT_ORG_ID
} from "@/lib/config";
import { createWebPasskey, getTurnkey, loginWebPasskey } from "@/lib/turnkey-web";
import { LoginMethod } from "@/lib/types";
import { SessionType } from "@turnkey/sdk-browser";
import {
  PasskeyStamper,
  TurnkeyClient,
  User,
  createPasskey,
  isSupported,
  useTurnkey,
} from "@turnkey/sdk-react-native";
import { ReactNode, createContext, useReducer } from "react";
import { Platform } from "react-native";
import { v4 as uuidv4 } from "uuid";

type AuthActionType =
  | { type: "PASSKEY"; payload: User }
  | { type: "INIT_EMAIL_AUTH" }
  | { type: "COMPLETE_EMAIL_AUTH"; payload: User }
  | { type: "INIT_PHONE_AUTH" }
  | { type: "COMPLETE_PHONE_AUTH"; payload: User }
  | { type: "EMAIL_RECOVERY"; payload: User }
  | { type: "WALLET_AUTH"; payload: User }
  | { type: "OAUTH"; payload: User }
  | { type: "LOADING"; payload: LoginMethod | null }
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

interface AuthState {
  loading: LoginMethod | null;
  error: string;
  user: User | null;
}

const initialState: AuthState = {
  loading: null,
  error: "",
  user: null,
};

function authReducer(state: AuthState, action: AuthActionType): AuthState {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: action.payload ? action.payload : null };
    case "ERROR":
      return { ...state, error: action.payload, loading: null };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    case "INIT_EMAIL_AUTH":
      return { ...state, loading: null, error: "" };
    case "COMPLETE_EMAIL_AUTH":
      return { ...state, user: action.payload, loading: null, error: "" };
    case "INIT_PHONE_AUTH":
      return { ...state, loading: null, error: "" };
    case "COMPLETE_PHONE_AUTH":
      return { ...state, user: action.payload, loading: null, error: "" };
    case "OAUTH":
    case "PASSKEY":
    case "EMAIL_RECOVERY":
    case "WALLET_AUTH":
    case "OAUTH":
      return { ...state, user: action.payload, loading: null, error: "" };
    default:
      return state;
  }
}

export interface AuthRelayProviderType {
  state: AuthState;
  // initOtpLogin: (params: { otpType: string; contact: string }) => Promise<void>;
  // completeOtpAuth: (params: {
  //   otpId: string;
  //   otpCode: string;
  //   organizationId: string;
  // }) => Promise<void>;
  signUpWithPasskey: (username: string) => Promise<void>;
  loginWithPasskey: (username: string) => Promise<void>;
  // loginWithOAuth: (params: {
  //   oidcToken: string;
  //   providerName: string;
  //   targetPublicKey: string;
  //   expirationSeconds: string;
  // }) => Promise<void>;
  clearError: () => void;
}

export const AuthRelayContext = createContext<AuthRelayProviderType>({
  state: initialState,
  // initOtpLogin: async () => Promise.resolve(),
  // completeOtpAuth: async () => Promise.resolve(),
  signUpWithPasskey: async (username: string) => Promise.resolve(),
  loginWithPasskey: async (username: string) => Promise.resolve(),
  // loginWithOAuth: async () => Promise.resolve(),
  clearError: () => { },
});

interface AuthRelayProviderProps {
  children: ReactNode;
}

export const AuthRelayProvider: React.FC<AuthRelayProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // const router = useRouter();

  // Only use Turnkey React Native hooks on mobile
  const turnkeyHooks = Platform.OS !== 'web' ? useTurnkey() : {
    createEmbeddedKey: async () => '',
    createSession: async () => { },
    createSessionFromEmbeddedKey: async () => { },
  };

  const { createEmbeddedKey, createSession, createSessionFromEmbeddedKey } = turnkeyHooks;

  // const initOtpLogin = async ({
  //   otpType,
  //   contact,
  // }: {
  //   otpType: string;
  //   contact: string;
  // }) => {
  //   dispatch({
  //     type: "LOADING",
  //     payload:
  //       otpType === "OTP_TYPE_EMAIL" ? LoginMethod.Email : LoginMethod.Phone,
  //   });
  //   try {
  //     const response = await fetch(`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/auths/init-otp-auth`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ otpType, contact }),
  //     }).then((res) => res.json());

  //     if (response) {
  //       dispatch({ type: "INIT_EMAIL_AUTH" });
  //       router.push(
  //         `/otp-auth?otpId=${encodeURIComponent(
  //           response.otpId
  //         )}&organizationId=${encodeURIComponent(response.organizationId)}`
  //       );
  //     }
  //   } catch (error: any) {
  //     dispatch({ type: "ERROR", payload: error.message });
  //   } finally {
  //     dispatch({ type: "LOADING", payload: null });
  //   }
  // };

  // const completeOtpAuth = async ({
  //   otpId,
  //   otpCode,
  //   organizationId,
  // }: {
  //   otpId: string;
  //   otpCode: string;
  //   organizationId: string;
  // }) => {
  //   if (otpCode) {
  //     dispatch({ type: "LOADING", payload: LoginMethod.Email });
  //     try {
  //       const targetPublicKey = await createEmbeddedKey();

  //       const response = await fetch(`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/auths/otp-auth`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           otpId,
  //           otpCode,
  //           organizationId,
  //           targetPublicKey,
  //           invalidateExisting: false,
  //         }),
  //       }).then((res) => res.json());

  //       const credentialBundle = response.credentialBundle;
  //       if (credentialBundle) {
  //         await createSession({ bundle: credentialBundle });
  //       }
  //     } catch (error: any) {
  //       dispatch({ type: "ERROR", payload: error.message });
  //     } finally {
  //       dispatch({ type: "LOADING", payload: null });
  //     }
  //   }
  // };

  // Cross-platform passkey signup - handles both web and mobile
  const signUpWithPasskey = async (username: string) => {
    // Check platform-specific support
    const supported = Platform.OS === 'web'
      ? !!(window.PublicKeyCredential && window.navigator.credentials)
      : isSupported();

    if (!supported) {
      throw new Error("Passkeys are not supported on this device");
    }

    dispatch({ type: "LOADING", payload: LoginMethod.Passkey });

    try {
      const userId = uuidv4();

      if (Platform.OS === 'web') {
        const exists = await fetch(`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/auths/sub-org-id`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filterValue: username,
          }),
        }).then((res) => res.json());

        const currentDomain = window.location.hostname;
        if (exists) {

        }

        // Web implementation using platform-specific module
        // Use current domain as rpId for web to avoid SecurityError
        // const currentDomain = window.location.hostname;
        const credential = await createWebPasskey({
          apiBaseUrl: TURNKEY_API_URL,
          organizationId: TURNKEY_PARENT_ORG_ID,
          rpId: currentDomain,
          appName: PASSKEY_APP_NAME,
          username,
          userId,
        });

        // For web, the passkey creation handles the sub-organization setup
        // You might need to integrate this with your backend for user storage
        // dispatch({ type: "PASSKEY", payload: { username, userId } as any });
        // const publicKey = await createEmbeddedKey({ isCompressed: true });
        const response = await fetch(`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/auths/create-sub-org`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // email: 'lior.agnin@fuse.io',
            userName: username,
            passkey: {
              challenge: credential.encodedChallenge,
              attestation: credential.attestation,
            },
          }),
        }).then((res) => res.json());

        const subOrganizationId = response.subOrganizationId;
        if (subOrganizationId) {
          await createSessionFromEmbeddedKey({ subOrganizationId });
          dispatch({ type: "PASSKEY", payload: { username, subOrganizationId } as any });
        }
      } else {
        // Mobile implementation (existing flow)
        const authenticatorParams = await createPasskey({
          authenticatorName: "End-User Passkey",
          rp: {
            id: RP_ID,
            name: PASSKEY_APP_NAME,
          },
          user: {
            id: userId,
            name: username,
            displayName: username,
          },
        });

        const publicKey = await createEmbeddedKey({ isCompressed: true });
        const response = await fetch(`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/auths/create-sub-org`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            passkey: {
              challenge: authenticatorParams.challenge,
              attestation: authenticatorParams.attestation,
            },
            apiKeys: [
              {
                apiKeyName: "Passkey API Key",
                publicKey,
                curveType: "API_KEY_CURVE_P256",
              },
            ],
          }),
        }).then((res) => res.json());

        const subOrganizationId = response.subOrganizationId;
        if (subOrganizationId) {
          await createSessionFromEmbeddedKey({ subOrganizationId });
          dispatch({ type: "PASSKEY", payload: { username, subOrganizationId } as any });
        }
      }
    } catch (error: any) {
      console.log("error", error);
      dispatch({ type: "ERROR", payload: error.message });
    } finally {
      dispatch({ type: "LOADING", payload: null });
    }
  };

  const loginWithPasskey = async (username: string) => {
    dispatch({ type: "LOADING", payload: LoginMethod.Passkey });

    try {
      const currentDomain = window.location.hostname;
      if (Platform.OS === 'web') {
        const subOrgId = await fetch(`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/auths/sub-org-id`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filterValue: username,
          }),
        }).then((res) => res.json());
        if (subOrgId.organizationId) {
          console.log("subOrgId found, logging in");
          console.log("subOrgId", subOrgId);
          const turnkey = getTurnkey({
            apiBaseUrl: TURNKEY_API_URL,
            organizationId: TURNKEY_PARENT_ORG_ID,
            rpId: currentDomain,
          });

          const indexedDbClient = await turnkey.indexedDbClient();
          const passkeyClient = turnkey.passkeyClient();
          await indexedDbClient?.resetKeyPair();
          const pubKey = await indexedDbClient!.getPublicKey();
          await passkeyClient?.loginWithPasskey({
            sessionType: SessionType.READ_WRITE,
            publicKey: pubKey!,
            expirationSeconds: "3600",
          });
          dispatch({ type: "PASSKEY", payload: { username, subOrganizationId: subOrgId } as any });
          return;
        } else {
          console.log("subOrgId not found, creating new subOrgId");
          const userId = uuidv4();
          const { encodedChallenge, attestation } = await createWebPasskey({
            apiBaseUrl: TURNKEY_API_URL,
            organizationId: TURNKEY_PARENT_ORG_ID,
            rpId: currentDomain,
            appName: PASSKEY_APP_NAME,
            username,
            userId,
          });

          const response = await fetch(`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/auths/create-sub-org`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: username,
              passkey: {
                challenge: encodedChallenge,
                attestation: attestation,
              },
            }),
          }).then((res) => res.json());

          const subOrganizationId = response.subOrganizationId;
          if (subOrganizationId) {
            const turnkey = getTurnkey({
              apiBaseUrl: TURNKEY_API_URL,
              organizationId: TURNKEY_PARENT_ORG_ID,
              rpId: currentDomain,
            });
            const indexedDbClient = await turnkey.indexedDbClient();
            await indexedDbClient!.resetKeyPair();
            const pubKey = await indexedDbClient!.getPublicKey();
            const passkeyClient = turnkey.passkeyClient();
            await passkeyClient?.loginWithPasskey({
              sessionType: SessionType.READ_WRITE,
              publicKey: pubKey!,
              expirationSeconds: "3600",
            });
            // await createSessionFromEmbeddedKey({ subOrganizationId });
            dispatch({ type: "PASSKEY", payload: { username, subOrganizationId } as any });
          }
        }

        // Web implementation using platform-specific module
        // Use current domain as rpId for web to avoid SecurityError
        const result = await loginWebPasskey({
          apiBaseUrl: TURNKEY_API_URL,
          organizationId: TURNKEY_PARENT_ORG_ID,
          rpId: currentDomain,
        });

        console.log("result", result);

        dispatch({ type: "PASSKEY", payload: result as any });
      } else {
        // Mobile implementation (existing flow)
        const stamper = new PasskeyStamper({
          rpId: currentDomain,
        });

        const httpClient = new TurnkeyClient(
          { baseUrl: TURNKEY_API_URL },
          stamper
        );

        const targetPublicKey = await createEmbeddedKey();

        const sessionResponse = await httpClient.createReadWriteSession({
          type: "ACTIVITY_TYPE_CREATE_READ_WRITE_SESSION_V2",
          timestampMs: Date.now().toString(),
          organizationId: TURNKEY_PARENT_ORG_ID,
          parameters: {
            targetPublicKey,
          },
        });

        const credentialBundle =
          sessionResponse.activity.result.createReadWriteSessionResultV2
            ?.credentialBundle;

        if (credentialBundle) {
          await createSession({ bundle: credentialBundle });
          dispatch({ type: "PASSKEY", payload: { authenticated: true } as any });
        }
      }
    } catch (error: any) {
      console.log("error", error);
      dispatch({ type: "ERROR", payload: error.message });
    } finally {
      dispatch({ type: "LOADING", payload: null });
    }
  };

  // const loginWithOAuth = async ({
  //   oidcToken,
  //   providerName,
  //   targetPublicKey,
  //   expirationSeconds,
  // }: {
  //   oidcToken: string;
  //   providerName: string;
  //   targetPublicKey: string;
  //   expirationSeconds: string;
  // }) => {
  //   dispatch({ type: "LOADING", payload: LoginMethod.OAuth });
  //   try {
  //     const response = await fetch(`${EXPO_PUBLIC_FLASH_API_BASE_URL}/accounts/v1/auths/oauth-login`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         oidcToken,
  //         providerName,
  //         targetPublicKey,
  //         expirationSeconds,
  //       }),
  //     }).then((res) => res.json());

  //     const credentialBundle = response.credentialBundle;
  //     if (credentialBundle) {
  //       await createSession({ bundle: credentialBundle });
  //     }
  //   } catch (error: any) {
  //     dispatch({ type: "ERROR", payload: error.message });
  //   } finally {
  //     dispatch({ type: "LOADING", payload: null });
  //   }
  // };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthRelayContext.Provider
      value={{
        state,
        // initOtpLogin,
        // completeOtpAuth,
        signUpWithPasskey,
        loginWithPasskey,
        // loginWithOAuth,
        clearError,
      }}
    >
      {children}
    </AuthRelayContext.Provider>
  );
};
