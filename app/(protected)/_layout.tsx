import { Redirect, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

import { path } from "@/constants/path";
import { Status } from "@/lib/types";
import useUser from "@/hooks/useUser";

SplashScreen.preventAutoHideAsync();

export default function ProtectedLayout() {
  const { userStatus } = useUser();
  const isReady = userStatus === Status.SUCCESS || userStatus === Status.ERROR;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  if (userStatus === Status.ERROR) {
    return <Redirect href={path.REGISTER} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
