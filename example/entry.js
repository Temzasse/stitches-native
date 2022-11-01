import 'expo/build/Expo.fx';
import { AppRegistry, Platform } from 'react-native';
import withExpoRoot from 'expo/build/launch/withExpoRoot';
import { createRoot } from 'react-dom/client';
import { App } from './App';

AppRegistry.registerComponent('main', () => withExpoRoot(App));

// TODO: should we have separate `index.web.js`?
// Also is should we use `registerRootComponent`?
// https://docs.expo.dev/workflow/web/

if (Platform.OS === 'web') {
  const rootTag = createRoot(
    document.getElementById('root') ?? document.getElementById('main')
  );

  const RootComponent = withExpoRoot(App);

  rootTag.render(<RootComponent />);
}
