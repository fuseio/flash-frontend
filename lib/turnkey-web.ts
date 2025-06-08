import { Turnkey } from '@turnkey/sdk-browser';

export const createWebPasskey = async (config: {
  apiBaseUrl: string;
  organizationId: string;
  rpId: string;
  appName: string;
  username: string;
  userId: string;
}) => {
  const turnkey = new Turnkey({
    apiBaseUrl: config.apiBaseUrl,
    defaultOrganizationId: config.organizationId,
    rpId: config.rpId,
  });

  const passkeyClient = turnkey.passkeyClient();

  const credential = await passkeyClient.createUserPasskey({
    publicKey: {
      rp: {
        id: config.rpId,
        name: config.appName,
      },
      user: {
        id: new TextEncoder().encode(config.userId),
        name: config.username,
        displayName: config.username,
      },
    },
  });

  console.log("credential", credential);
  return credential;
};

export const getTurnkey = (config: {
  apiBaseUrl: string;
  organizationId: string;
  rpId: string;
}) => {
  return new Turnkey({
    apiBaseUrl: config.apiBaseUrl,
    defaultOrganizationId: config.organizationId,
    rpId: config.rpId,
  });
};

export const loginWebPasskey = async (config: {
  apiBaseUrl: string;
  organizationId: string;
  rpId: string;
}) => {
  const turnkey = getTurnkey(config);

  const passkeyClient = turnkey.passkeyClient();

  // Initialize IndexedDB client for session management
  const indexedDbClient = await turnkey.indexedDbClient();
  await indexedDbClient.init();
  const publicKey = await indexedDbClient.getPublicKey();

  // Login with passkey and create session
  await passkeyClient.loginWithPasskey({
    publicKey,
    sessionType: "SESSION_TYPE_READ_WRITE",
    expirationSeconds: "3600",
  });

  return { authenticated: true, platform: 'web' };
};

export const isWebPasskeySupported = (): boolean => {
  return !!(window.PublicKeyCredential && window.navigator.credentials);
}; 