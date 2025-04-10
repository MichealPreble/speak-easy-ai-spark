
"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToAnchor() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      
      if (element) {
        // Wait a bit for the DOM to fully render
        setTimeout(() => {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80, // Offset for header
            behavior: "smooth"
          });
        }, 100);
      }
    }
  }, [location]);
  
  return null;
}
