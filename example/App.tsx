import 'react-native-gesture-handler';
import { ColorModeProvider } from './src/components';
import Example from './src/Example';

export function App() {
  return (
    <ColorModeProvider>
      <Example />
    </ColorModeProvider>
  );
}
