
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { BrowserRouter, useNavigate } from "react-router-dom";
import EmailVerification from "../EmailVerification";
import { AuthProvider } from "@/context/AuthContext";
import * as toastHook from "@/hooks/use-toast";
import "@testing-library/jest-dom"; // Add this import for DOM matchers

// Mock react-router-dom navigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock the AuthContext
vi.mock("@/context/AuthContext", async () => {
  return {
    useAuth: () => ({
      user: { email: "test@example.com" },
      isEmailVerified: false,
      sendVerificationEmail: vi.fn().mockImplementation(() => {
        return Promise.resolve();
      }),
    }),
    AuthProvider: ({ children }) => <div>{children}</div>,
  };
});

// Mock the toast hook
vi.mock("@/hooks/use-toast", async () => {
  const mockToast = vi.fn();
  return {
    useToast: () => ({
      toast: mockToast,
    }),
    toast: mockToast,
  };
});

describe("EmailVerification Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <EmailVerification />
      </BrowserRouter>
    );
  };

  // Test 1: Component renders correctly when user is logged in
  test("renders verification page correctly when user is logged in", () => {
    renderComponent();
    
    expect(screen.getByText("Verify Your Email")).toBeInTheDocument();
    expect(screen.getByText(/We've sent a verification email to test@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend verification email/i })).toBeInTheDocument();
  });

  // Test 2: Resend button works
  test("can resend verification email", async () => {
    const { useAuth } = await import("@/context/AuthContext");
    renderComponent();
    
    const resendButton = screen.getByRole("button", { name: /resend verification email/i });
    fireEvent.click(resendButton);
    
    // Check if sendVerificationEmail was called
    await waitFor(() => {
      expect(useAuth().sendVerificationEmail).toHaveBeenCalled();
    });
    
    // Check if button is disabled after click
    expect(resendButton).toBeDisabled();
  });

  // Test 3: Countdown works
  test("shows countdown timer after resending email", async () => {
    renderComponent();
    
    const resendButton = screen.getByRole("button", { name: /resend verification email/i });
    fireEvent.click(resendButton);
    
    // Check for countdown text
    await waitFor(() => {
      expect(screen.getByText(/Resend in \d+s/i)).toBeInTheDocument();
    });
  });
});
