const esmModules = [
  '((jest-)?react-native|@react-native(-community)?)',
  'expo(nent)?',
  '@expo(nent)/.*?',
  '@expo-google-fonts/.*',
  'react-navigation',
  '@react-navigation/.*',
  '@unimodules/.*',
  'unimodules',
  'sentry-expo',
  'native-base',
  'react-native-svg',
].join('|');

export default {
  preset: 'react-native',
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
    // NOTE: For flow in React Native Library.
    '^.+\\.jsx?$': ['babel-jest'],
    '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$': require.resolve(
      'react-native/jest/assetFileTransformer.js'
    ),
  },
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  transformIgnorePatterns: [`node_modules/(?!(?:.pnpm/)?(${esmModules}))`],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
