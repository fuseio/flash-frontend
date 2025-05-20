const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  unstable_enablePackageExports: true,
  unstable_enableSymlinks: true,
})

// Add sourceExts to handle .js extensions
config.resolver.sourceExts = [
  'js',
  'jsx',
  'ts',
  'tsx',
  'json',
  'mjs',
  'cjs',
  'web.js',
  'web.jsx',
  'web.ts',
  'web.tsx',
];

// Add resolver to handle .js extensions
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.endsWith('.js')) {
    const withoutExt = moduleName.slice(0, -3);
    const result = context.resolveRequest(context, withoutExt, platform);
    if (result) {
      return result;
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' })
