/* eslint-disable */
const path = require('path');
const { mapValues } = require('lodash');
const { getDefaultConfig } = require('expo/metro-config');

const packagesRelative = {
  'stitches-native': '../src/internals',
};

const packages = mapValues(packagesRelative, (relativePath) =>
  path.resolve(relativePath),
);

function createMetroConfiguration(projectPath) {
  projectPath = path.resolve(projectPath);

  const defaultConfig = getDefaultConfig(projectPath);

  const watchFolders = [
    ...Object.values(packages),
    ...defaultConfig.watchFolders,
  ];

  const extraNodeModules = {
    ...packages,
    ...defaultConfig.resolver.extraNodeModules,
  };

  const extraNodeModulesProxy = new Proxy(extraNodeModules, {
    get: (target, name) => {
      if (target[name]) {
        return target[name];
      } else {
        return path.join(projectPath, `node_modules/${name}`);
      }
    },
  });

  return {
    ...defaultConfig,
    projectRoot: projectPath,
    watchFolders,
    resolver: {
      ...defaultConfig.resolver,
      extraNodeModules: extraNodeModulesProxy,
    },
  };
}

module.exports = createMetroConfiguration(__dirname);
