import '@/global.css';

// see: https://solana.stackexchange.com/a/6244
global.Buffer = require('buffer').Buffer;

import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import React from 'react';

import { Providers } from '@/providers';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {

  return (
    <Providers>
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
      <StatusBar backgroundColor="transparent" />
      <PortalHost />
    </Providers>
  );
}
