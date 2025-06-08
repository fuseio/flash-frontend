// Native/mobile stub - these functions should not be called on mobile platforms

export const createWebPasskey = async (): Promise<any> => {
  throw new Error('Web passkey functions are not available on mobile platforms');
};

export const loginWebPasskey = async (): Promise<any> => {
  throw new Error('Web passkey functions are not available on mobile platforms');
};

export const isWebPasskeySupported = (): boolean => {
  return false;
}; 