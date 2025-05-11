import '@/global.css';

import { Slot } from 'expo-router';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {
  return (
    <Slot />
  );
}
