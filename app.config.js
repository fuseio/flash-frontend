export default {
  expo: {
    name: "flash-frontend",
    slug: "flash-frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "flashfrontend",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    owner: "fuseio",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "xyz.solid.ios",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      associatedDomains: [
        "webcredentials:solid.xyz",
        "applinks:solid.xyz",
        `webcredentials:${
          process.env.PASSKEY_CERTIFICATES_HOST
        }?mode=developer`,
      ],
      appleTeamId: "8WHFWN93P6",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#262626",
      },
      edgeToEdgeEnabled: true,
      package: "xyz.solid.android",
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "solid.xyz",
              pathPrefix: "/",
            },
            {
              scheme: "https",
              host: process.env.PASSKEY_CERTIFICATES_HOST,
              pathPrefix: "/",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-router",
        {
          headOrigin: process.env.HEAD_ORIGIN || "https://solid.xyz",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#262626",
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "node_modules/@expo-google-fonts/mona-sans/400Regular/MonaSans_400Regular.ttf",
          ],
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1",
          },
          android: {
            compileSdkVersion: 35,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "a788e592-4267-44da-8afc-a667075c20d4",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/a788e592-4267-44da-8afc-a667075c20d4",
    },
  },
};
