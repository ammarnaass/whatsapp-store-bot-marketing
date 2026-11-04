import React from 'react';
import { useTheme } from '../hooks/useTheme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mount the hook to guarantee DOM class synchronization on load
  useTheme();
  return <>{children}</>;
};
