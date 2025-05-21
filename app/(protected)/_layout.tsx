import { Redirect, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

import { path } from "@/constants/path";
import { Status } from "@/lib/types";
import useUser from "@/hooks/useUser";
import Loading from "@/components/Loading";

SplashScreen.preventAutoHideAsync();

export default function ProtectedLayout() {
  const { user, userStatus } = useUser();
  const isReady = userStatus === Status.SUCCESS || userStatus === Status.ERROR;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return <Loading />;
  }

  if (userStatus === Status.ERROR) {
    return <Redirect href={path.REGISTER} />;
  }

  if (userStatus === Status.SUCCESS && !user) {
    return <Redirect href={path.WELCOME} />;
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
