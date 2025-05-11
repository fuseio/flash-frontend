import { Redirect, Stack } from 'expo-router';
import React from 'react';

import useUser from '@/hooks/useUser';
import { path } from '@/constants/path';
import { Status } from '@/lib/types';

export default function TabLayout() {
  const { userStatus } = useUser();

  if (userStatus === Status.PENDING) {
    // TODO: Add loading screen
    return null;
  }

  if (userStatus === Status.SUCCESS) {
    return <Redirect href={path.DEPOSIT} />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
