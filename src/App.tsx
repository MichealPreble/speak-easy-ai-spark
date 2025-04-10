
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ScrollToAnchor } from "@/components/ui/scroll-to-anchor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Lazy load the chat page to improve initial load performance
const ChatPage = lazy(() => import("./pages/ChatPage"));

// Google Analytics tracking component
const Analytics = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    // Only track page views on push navigation (not on replace or pop)
    if (navigationType === 'PUSH' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search
      });
    }
  }, [location, navigationType]);
  
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToAnchor />
        <Analytics />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/chat" 
            element={
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-pulse text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-primary font-medium">AI</span>
                    </div>
                    <p className="text-muted-foreground">Loading chat...</p>
                  </div>
                </div>
              }>
                <ChatPage />
              </Suspense>
            } 
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Add GoogleAnalytics type definition for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: {
        [key: string]: any;
      }
    ) => void;
  }
}

export default App;
