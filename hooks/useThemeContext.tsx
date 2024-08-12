// contexts/ThemeContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

// 타입 나중에 정리..
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localTheme = window.localStorage.getItem('theme') as Theme | null;
      if (localTheme) {
        setTheme(localTheme);
        document.body.dataset.theme = localTheme;
      } else {
        setTheme('light');
        document.body.dataset.theme = 'light';
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', newTheme);
      document.body.dataset.theme = newTheme;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('ThemeProvider 안에서 useTheme를 사용해주세요');
  }
  return context;
};
