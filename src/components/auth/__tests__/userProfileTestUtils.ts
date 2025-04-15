
import React from 'react';
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import UserProfile from "../UserProfile";
import "@testing-library/jest-dom";

// Common mock setup
export const mockUpdateProfile = vi.fn().mockResolvedValue(undefined);
export const mockSendVerificationEmail = vi.fn().mockResolvedValue(undefined);
export const mockToast = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  __esModule: true,
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  __esModule: true,
  useToast: () => ({
    toast: mockToast,
  }),
  toast: mockToast,
}));

// Base user object for testing
export const testUser = {
  email: "test@example.com",
  user_metadata: {
    full_name: "Test User",
    avatar_url: "https://example.com/avatar.jpg"
  }
};

// Default auth mock with verified email
export const createAuthMock = (overrides = {}) => {
  return {
    user: testUser,
    isEmailVerified: true,
    updateProfile: mockUpdateProfile,
    sendVerificationEmail: mockSendVerificationEmail,
    ...overrides
  };
};

// Setup AuthContext mock with custom values
export const setupAuthMock = (authValues = {}) => {
  vi.mock('@/context/AuthContext', () => ({
    __esModule: true,
    useAuth: () => createAuthMock(authValues),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }));
};

// Reset all mocks between tests
export const resetMocks = () => {
  vi.clearAllMocks();
  mockUpdateProfile.mockClear();
  mockSendVerificationEmail.mockClear();
  mockToast.mockClear();
};

// Utility function to render the component
export const renderUserProfile = (authValues = {}) => {
  setupAuthMock(authValues);
  
  return render(
    <BrowserRouter>
      <UserProfile />
    </BrowserRouter>
  );
};
