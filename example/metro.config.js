const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const escape = require('escape-string-regexp');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');
const modules = Object.keys({ ...pak.peerDependencies });

const defaultConfig = getDefaultConfig(__dirname);

const blocked = new RegExp(modules.map((m) => `^${escape(path.join(root, 'node_modules', m))}\\/.*$`).join('|'));

const config = {
  watchFolders: [root],

  resolver: {
    ...defaultConfig.resolver,
    blockList: blocked,
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },

  transformer: {
    ...defaultConfig.transformer,
  },
};

module.exports = mergeConfig(defaultConfig, config);
