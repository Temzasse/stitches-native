import 'react-native-gesture-handler';

import { ColorModeProvider } from './src/components';
import Example from './src/Example';

export default function App() {
  return (
    <ColorModeProvider>
      <Example />
    </ColorModeProvider>
  );
}
