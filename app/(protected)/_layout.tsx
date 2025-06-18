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
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        }
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings/index"
        options={{
          headerTitle: 'Settings',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="settings/account"
        options={{
          headerTitle: 'Account details',
        }}
      />
      <Stack.Screen
        name="send"
        options={{
          headerTitle: 'Send',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
