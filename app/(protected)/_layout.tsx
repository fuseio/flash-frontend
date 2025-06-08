import { Redirect, Stack } from "expo-router";

import { path } from "@/constants/path";
import useUser from "@/hooks/useUser";
import { TURNKEY_API_URL, TURNKEY_PARENT_ORG_ID } from "@/lib/config";
import { getTurnkey } from "@/lib/turnkey-web";
import { useUserStore } from "@/store/useUserStore";

export default function ProtectedLayout() {
  const { user } = useUser();
  const { users } = useUserStore();

  const turnkey = getTurnkey({
    apiBaseUrl: TURNKEY_API_URL,
    organizationId: TURNKEY_PARENT_ORG_ID,
    rpId: window.location.hostname,
  });

  if (!users.length) {
    return <Redirect href={path.REGISTER} />;
  }

  if (users.length && !user) {
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
