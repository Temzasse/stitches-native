import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';

import { theme as lightTheme, darkTheme, ThemeProvider } from '../styles';

type ColorMode = 'light' | 'dark';

type ContextValue = {
  colorMode: ColorMode;
  setColorMode: (t: ColorMode) => void;
  toggleColorMode: () => void;
};

const ColorModeContext = createContext<undefined | ContextValue>(undefined);

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const theme = colorMode === 'light' ? lightTheme : darkTheme;

  const toggleColorMode = useCallback(() => {
    setColorMode((p) => (p === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ColorModeContext.Provider
      value={{ colorMode, setColorMode, toggleColorMode }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) throw new Error('Missing ColorModeProvider!');
  return context;
};
