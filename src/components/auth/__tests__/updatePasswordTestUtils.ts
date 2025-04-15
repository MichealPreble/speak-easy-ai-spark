import React from 'react';
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import UpdatePassword from "../UpdatePassword";
import "@testing-library/jest-dom";

// Mock react-router-dom navigate
export const mockNavigate = vi.fn();

// Mock the updatePassword function
export const mockUpdatePassword = vi.fn().mockImplementation((password) => {
  // For testing error scenario
  if (password === "errorTrigger123") {
    return Promise.reject(new Error("Failed to update password"));
  }
  // Otherwise succeed
  return Promise.resolve();
});

// Mock toast function
export const mockToast = vi.fn();

// Mock react-router-dom
vi.mock("react-router-dom", () => {
  return {
    ...vi.importActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  };
});

// Mock the AuthContext
vi.mock("@/context/AuthContext", () => {
  return {
    useAuth: () => ({
      updatePassword: mockUpdatePassword,
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => {
  return {
    useToast: () => ({
      toast: mockToast,
    }),
    toast: mockToast,
  };
});

// Reset all mocks between tests
export const resetMocks = () => {
  vi.clearAllMocks();
  mockNavigate.mockClear();
  mockUpdatePassword.mockClear();
  mockToast.mockClear();
};

// Utility function to render the component
export const renderUpdatePassword = () => {
  return render(
    <BrowserRouter>
      <UpdatePassword />
    </BrowserRouter>
  );
};
