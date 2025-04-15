
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import EmailVerification from "../EmailVerification";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

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

  test("renders verification page correctly when user is logged in", () => {
    renderComponent();
    
    expect(screen.getByText("Verify Your Email")).toBeInTheDocument();
    expect(screen.getByText(/We've sent a verification email to test@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend verification email/i })).toBeInTheDocument();
  });

  test("can resend verification email", async () => {
    const { useAuth } = await import("@/context/AuthContext");
    renderComponent();
    
    const resendButton = screen.getByRole("button", { name: /resend verification email/i });
    fireEvent.click(resendButton);
    
    await waitFor(() => {
      expect(useAuth().sendVerificationEmail).toHaveBeenCalled();
    });
    
    expect(resendButton).toBeDisabled();
  });

  test("shows countdown timer after resending email", async () => {
    renderComponent();
    
    const resendButton = screen.getByRole("button", { name: /resend verification email/i });
    fireEvent.click(resendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Resend in \d+s/i)).toBeInTheDocument();
    });
  });
});
