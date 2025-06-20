const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add polyfills required for @solana/web3.js
config.resolver.assetExts.push('cjs');

config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'react-native-get-random-values',
  buffer: 'buffer',
};

// Add global polyfills
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;