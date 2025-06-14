import "@/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { WagmiProvider } from "wagmi";

import { infoClient } from "@/graphql/clients";
import { toastProps } from "@/lib/toast";
import { config } from "@/lib/wagmi";
import { ApolloProvider } from "@apollo/client";

// see: https://solana.stackexchange.com/a/6244
global.Buffer = require("buffer").Buffer;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <SafeAreaProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={infoClient}>
            <Head>
              <title>Solid</title>
            </Head>
            <Stack>
              <Stack.Screen
                name="(protected)"
                options={{
                  headerShown: false,
                  animation: "none",
                }}
              />
              <Stack.Screen
                name="register"
                options={{
                  headerShown: false,
                  animation: "none",
                }}
              />
              <Stack.Screen
                name="welcome"
                options={{
                  headerShown: false,
                  animation: "none",
                }}
              />
            </Stack>
          </ApolloProvider>
        </QueryClientProvider>
      </WagmiProvider>
      <PortalHost />
      <Toast {...toastProps} />
    </SafeAreaProvider>
  );
}
