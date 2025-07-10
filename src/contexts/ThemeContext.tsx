import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { company, updateCompany } = useAuth();
  
  const theme = company?.theme || 'light';
  
  const setTheme = async (newTheme: 'light' | 'dark') => {
    await updateCompany({ theme: newTheme });
  };

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Force a repaint to ensure theme is applied immediately
    root.style.colorScheme = theme;
    
    // Apply theme to body as well for better coverage
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  const value: ThemeContextType = {
    theme: theme as 'light' | 'dark',
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};