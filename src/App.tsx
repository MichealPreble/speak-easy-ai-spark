import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ScrollToAnchor } from "@/components/ui/scroll-to-anchor";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import ForgotPassword from "@/components/auth/ForgotPassword";
import UpdatePassword from "@/components/auth/UpdatePassword";
import EmailVerification from "@/components/auth/EmailVerification";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import PracticePage from "./pages/PracticePage";

const ChatPage = lazy(() => import("./pages/ChatPage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary font-medium">AI</span>
          </div>
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const Analytics = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    if (navigationType === 'PUSH' && typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search
      });
    }
  }, [location, navigationType]);
  
  return null;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary font-medium">AI</span>
          </div>
          <p className="text-muted-foreground">Loading app...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={user ? <Navigate to="/chat" replace /> : <Auth />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/update-password" element={<UpdatePassword />} />
      <Route path="/auth/verify" element={<EmailVerification />} />
      <Route path="/auth/confirm" element={<EmailVerification />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
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
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/progress" 
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-primary font-medium">AI</span>
                  </div>
                  <p className="text-muted-foreground">Loading progress data...</p>
                </div>
              </div>
            }>
              <ProgressPage />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToAnchor />
          <Analytics />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

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
