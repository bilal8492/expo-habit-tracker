import { useColorScheme } from 'react-native';

export type ThemeType = 'light' | 'dark' | 'system';

export interface Theme {
  background: string;
  surface: string;
  primary: string;
  text: {
    primary: string;
    secondary: string;
  };
  border: string;
}

export const lightTheme: Theme = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  primary: '#3B82F6',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
  },
  border: '#E5E7EB',
};

export const darkTheme: Theme = {
  background: '#1F2937',
  surface: '#374151',
  primary: '#60A5FA',
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
  },
  border: '#4B5563',
};

export const useTheme = (themePreference: ThemeType): Theme => {
  const systemColorScheme = useColorScheme();
  
  if (themePreference === 'system') {
    return systemColorScheme === 'dark' ? darkTheme : lightTheme;
  }
  
  return themePreference === 'dark' ? darkTheme : lightTheme;
};