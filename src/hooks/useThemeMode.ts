
import { useState, useEffect } from "react";

export function useThemeMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for system preference or localStorage
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('darkMode');
      if (storedPreference !== null) {
        return storedPreference === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  return { isDarkMode, setIsDarkMode };
}
