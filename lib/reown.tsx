import { Platform } from 'react-native';

type UseAppKitType = Platform["OS"] extends 'web'
  ? typeof import('@reown/appkit/react')['useAppKit']
  : typeof import('@reown/appkit-wagmi-react-native')['useAppKit'];

let useAppKit: UseAppKitType;

if (Platform.OS === 'web') {
  const { useAppKit: webUseAppKit } = require('@reown/appkit/react');
  useAppKit = webUseAppKit;
} else {
  const { useAppKit: nativeUseAppKit } = require('@reown/appkit-wagmi-react-native');
  useAppKit = nativeUseAppKit;
}

export { useAppKit };
