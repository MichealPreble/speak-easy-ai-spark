
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
          // Scroll to the element with offset for header
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80, // Offset for header
            behavior: "smooth"
          });
          
          // Set focus to the element for better keyboard accessibility
          element.tabIndex = -1;
          element.focus({ preventScroll: true });
          
          // Announce to screen readers that navigation has occurred
          const announcer = document.createElement('div');
          announcer.setAttribute('aria-live', 'polite');
          announcer.setAttribute('aria-atomic', 'true');
          announcer.setAttribute('class', 'sr-only');
          announcer.textContent = `Navigated to ${location.hash.substring(1)} section`;
          document.body.appendChild(announcer);
          
          // Remove the announcer after it's been read
          setTimeout(() => {
            document.body.removeChild(announcer);
          }, 1000);
        }, 100);
      }
    }
  }, [location]);
  
  return null;
}
