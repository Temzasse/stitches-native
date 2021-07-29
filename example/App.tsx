import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { darkTheme, ThemeProvider } from './src/styled';
import Example from './src/Example';
// import Simple from './src/Simple';

export default function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <>
      <ThemeProvider theme={darkMode ? darkTheme : undefined}>
        <Example
          mode={darkMode ? 'dark' : 'light'}
          toggleMode={() => setDarkMode((p) => !p)}
        />
        {/* <Simple /> */}
      </ThemeProvider>

      <StatusBar style="auto" />
    </>
  );
}
