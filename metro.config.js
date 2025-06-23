const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_enableSymlinks = true;

const modules = {
  'bignumber.js': path.resolve(__dirname, 'node_modules/bignumber.js/bignumber.js'),
  'bignumber': path.resolve(__dirname, 'node_modules/bignumber.js/bignumber.js'),
  'big.js': path.resolve(__dirname, 'node_modules/big.js/big.js'),
  'big': path.resolve(__dirname, 'node_modules/big.js/big.js'),
};

// Add resolver aliases
config.resolver.alias = modules;

// Add platforms to include node_modules resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure node_modules resolution includes root
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Add extraNodeModules for explicit resolution
config.resolver.extraNodeModules = modules;

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
