const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_enableSymlinks = true;

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

module.exports = withNativeWind(config, { input: './global.css' })
