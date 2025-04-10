
import { useState, useEffect } from "react";

export function useThemeMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // First check localStorage
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('darkMode');
      if (storedPreference !== null) {
        return storedPreference === 'true';
      }
      
      // If no localStorage value, check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  // Apply dark mode to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Save preference to localStorage
      localStorage.setItem('darkMode', String(isDarkMode));
    }
  }, [isDarkMode]);

  // Watch for system preference changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        // Only update if user hasn't explicitly set a preference
        if (localStorage.getItem('darkMode') === null) {
          setIsDarkMode(e.matches);
        }
      };
      
      // Add event listener for future changes
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }
      
      // Cleanup
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          // Fallback for older browsers
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return { isDarkMode, setIsDarkMode, toggleDarkMode };
}
