import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeType, useTheme } from './theme';

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemeType;
  setThemePreference: (theme: ThemeType) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemeType>('system');
  const theme = useTheme(themePreference);

  useEffect(() => {
    // Load saved theme preference
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved) {
        setThemePreferenceState(saved as ThemeType);
      }
    });
  }, []);

  const setThemePreference = async (newTheme: ThemeType) => {
    setThemePreferenceState(newTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themePreference,
        setThemePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}