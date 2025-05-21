import '@/global.css';

import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WagmiProvider } from 'wagmi';

import { config } from '@/lib/wagmi';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <SafeAreaProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </WagmiProvider>
      <PortalHost />
    </SafeAreaProvider>
  );
}
