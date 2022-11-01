/* eslint-disable @typescript-eslint/no-var-requires */
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  Object.assign(config.resolve.alias, {
    react: path.join(__dirname, 'node_modules', 'react'),
    'react-native': path.join(__dirname, 'node_modules', 'react-native-web'),
    'react-native-web': path.join(__dirname, 'node_modules', 'react-native-web'), // prettier-ignore
  });

  return config;
};
