import { Stack } from 'expo-router';

export default function CardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="details" 
        options={{ 
          presentation: 'modal',
          headerShown: true,
          headerTitle: "Card",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#262626",
          },
          headerTitleStyle: {
            color: "#ffffff",
            fontFamily: "System",
            fontWeight: "bold",
            fontSize: 20
          },
          headerTintColor: "#ffffff",
        }} 
      />
    </Stack>
  );
} 