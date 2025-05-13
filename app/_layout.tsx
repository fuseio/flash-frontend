import '@/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { WagmiProvider } from 'wagmi';

import { config } from '@/lib/wagmi';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
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
        </Stack>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
