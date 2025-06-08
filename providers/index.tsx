import { TURNKEY_API_URL, TURNKEY_PARENT_ORG_ID } from "@/lib/config";
import { config } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TurnkeyProvider } from "@turnkey/sdk-react-native";
import { useRouter } from "expo-router";
import Head from "expo-router/head";
import React from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WagmiProvider } from "wagmi";
import { AuthRelayProvider } from "./auth-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const router = useRouter();

  const sessionConfig = {
    apiBaseUrl: TURNKEY_API_URL,
    organizationId: TURNKEY_PARENT_ORG_ID,
    onSessionSelected: () => {
      router.replace("/dashboard");
    },
    onSessionCleared: () => {
      router.push("/");
    },
  };

  // Conditional wrapper for platform-specific providers
  const TurnkeyWrapper = ({ children }: { children: React.ReactNode }) => {
    // Only use TurnkeyProvider on mobile platforms
    if (Platform.OS === 'web') {
      return <>{children}</>;
    }

    return (
      <TurnkeyProvider config={sessionConfig}>
        {children}
      </TurnkeyProvider>
    );
  };

  return (
    <SafeAreaProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Head>
            <title>Solid</title>
          </Head>
          <GestureHandlerRootView>
            <TurnkeyWrapper>
              <AuthRelayProvider>{children}</AuthRelayProvider>
            </TurnkeyWrapper>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </WagmiProvider>
    </SafeAreaProvider>
  );
};
