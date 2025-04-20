
import { useMediaQuery } from "./useMediaQuery";

export function useIsMobile() {
  return useMediaQuery("(max-width: 640px)"); // Align with Tailwind's sm breakpoint
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1025px)");
}
