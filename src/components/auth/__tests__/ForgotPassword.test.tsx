import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ForgotPassword from "../ForgotPassword";
import { AuthProvider } from "@/context/AuthContext";
import * as toastHook from "@/hooks/use-toast";

// Mock the AuthContext
vi.mock("@/context/AuthContext", async () => {
  const actual = await vi.importActual("@/context/AuthContext");
  return {
    ...actual,
    useAuth: () => ({
      resetPassword: vi.fn().mockImplementation((email) => {
        // Simulate API behavior - reject for test@nonexistent.com
        if (email === "test@nonexistent.com") {
          return Promise.reject(new Error("User not found"));
        }
        // Otherwise succeed
        return Promise.resolve();
      }),
    }),
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

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <ForgotPassword />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  // Test 1: Component renders correctly
  test("renders forgot password form correctly", () => {
    renderComponent();
    
    // Check for essential elements
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to sign in/i })).toBeInTheDocument();
  });

  // Test 2: Email validation works
  test("shows validation error for invalid email format", async () => {
    renderComponent();
    
    // Type invalid email
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    
    // Submit form
    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  // Test 3: Successful submission
  test("shows success message after successful submission", async () => {
    const { toast } = toastHook.useToast();
    renderComponent();
    
    // Type valid email
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    
    // Submit form
    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitButton);
    
    // Check for loading state
    expect(submitButton).toHaveTextContent(/sending/i);
    
    // Check for success view
    await waitFor(() => {
      expect(screen.getByText(/check your email for a link/i)).toBeInTheDocument();
    });
  });

  // Test 4: Error handling for non-existent email
  test("shows error toast when API returns an error", async () => {
    const { toast } = toastHook.useToast();
    renderComponent();
    
    // Type email that will trigger an error
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@nonexistent.com" } });
    
    // Submit form
    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitButton);
    
    // Check for loading state
    expect(submitButton).toHaveTextContent(/sending/i);
    
    // Check toast was called with error message
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        })
      );
    });
    
    // Verify button is no longer in loading state
    await waitFor(() => {
      expect(submitButton).not.toHaveTextContent(/sending/i);
    });
  });

  // Test 5: Test try again functionality
  test("allows user to try again after viewing success message", async () => {
    renderComponent();
    
    // Type valid email
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    
    // Submit form
    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitButton);
    
    // Wait for success view
    await waitFor(() => {
      expect(screen.getByText(/check your email for a link/i)).toBeInTheDocument();
    });
    
    // Click try again
    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(tryAgainButton);
    
    // Verify form is shown again
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
    });
  });
});
