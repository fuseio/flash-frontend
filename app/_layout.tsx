import '@/global.css';
import { MonaSans_400Regular, MonaSans_500Medium, MonaSans_600SemiBold, MonaSans_700Bold } from '@expo-google-fonts/mona-sans';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    MonaSans: MonaSans_400Regular,
    'MonaSans_400Regular': MonaSans_400Regular,
    'MonaSans_500Medium': MonaSans_500Medium,
    'MonaSans_600SemiBold': MonaSans_600SemiBold, 
    'MonaSans_700Bold': MonaSans_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen once fonts are loaded (or if error occurred)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return <Slot />;
}
