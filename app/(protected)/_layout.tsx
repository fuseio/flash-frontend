import { Redirect, Stack } from "expo-router";

import { path } from "@/constants/path";
import useUser from "@/hooks/useUser";
import { useUserStore } from "@/store/useUserStore";

export default function ProtectedLayout() {
  const { user } = useUser();
  const { users } = useUserStore();

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
