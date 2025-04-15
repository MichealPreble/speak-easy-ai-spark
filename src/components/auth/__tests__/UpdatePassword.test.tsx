import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { BrowserRouter, useNavigate } from "react-router-dom";
import UpdatePassword from "../UpdatePassword";
import { AuthProvider } from "@/context/AuthContext";
import * as toastHook from "@/hooks/use-toast";
import "@testing-library/jest-dom"; // Add this import for DOM matchers

// Mock react-router-dom navigate
vi.mock("react-router-dom", async () => {
  const mockNavigate = vi.fn();
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the AuthContext
vi.mock("@/context/AuthContext", async () => {
  return {
    useAuth: () => ({
      updatePassword: vi.fn().mockImplementation((password) => {
        // For testing error scenario
        if (password === "errorTrigger123") {
          return Promise.reject(new Error("Failed to update password"));
        }
        // Otherwise succeed
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

describe("UpdatePassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <UpdatePassword />
      </BrowserRouter>
    );
  };

  // Test 1: Component renders correctly
  test("renders update password form correctly", () => {
    renderComponent();
    
    expect(screen.getByText("Update Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update Password/i })).toBeInTheDocument();
  });

  // Test 2: Password validation works - too short
  test("shows validation error when password is too short", async () => {
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/New Password/i);
    const confirmInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole("button", { name: /Update Password/i });
    
    // Type short password and submit
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.change(confirmInput, { target: { value: "short" } });
    fireEvent.click(submitButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  // Test 3: Password validation works - no uppercase
  test("shows validation error when password has no uppercase letter", async () => {
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/New Password/i);
    const confirmInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole("button", { name: /Update Password/i });
    
    // Type password without uppercase and submit
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Password must contain at least one uppercase letter/i)).toBeInTheDocument();
    });
  });

  // Test 4: Password validation works - passwords don't match
  test("shows validation error when passwords don't match", async () => {
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/New Password/i);
    const confirmInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole("button", { name: /Update Password/i });
    
    // Type non-matching passwords and submit
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmInput, { target: { value: "Password456" } });
    fireEvent.click(submitButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument();
    });
  });

  // Test 5: Successful password update
  test("successfully updates password with valid input", async () => {
    const { useNavigate } = await import("react-router-dom");
    const { useAuth } = await import("@/context/AuthContext");
    const { toast } = toastHook.useToast();
    
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/New Password/i);
    const confirmInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole("button", { name: /Update Password/i });
    
    // Type valid matching passwords and submit
    fireEvent.change(passwordInput, { target: { value: "ValidPassword123" } });
    fireEvent.change(confirmInput, { target: { value: "ValidPassword123" } });
    fireEvent.click(submitButton);
    
    // Check for loading state
    expect(submitButton).toHaveTextContent(/Updating/i);
    
    // Verify updatePassword was called with correct value
    await waitFor(() => {
      expect(useAuth().updatePassword).toHaveBeenCalledWith("ValidPassword123");
    });
    
    // Verify success toast was shown
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password updated",
          description: expect.any(String),
        })
      );
    });
    
    // Verify navigation occurred
    await waitFor(() => {
      expect(useNavigate()).toHaveBeenCalledWith("/");
    });
  });

  // Test 6: Error handling
  test("shows error toast when update fails", async () => {
    const { toast } = toastHook.useToast();
    
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/New Password/i);
    const confirmInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole("button", { name: /Update Password/i });
    
    // Type the password that triggers an error
    fireEvent.change(passwordInput, { target: { value: "errorTrigger123" } });
    fireEvent.change(confirmInput, { target: { value: "errorTrigger123" } });
    fireEvent.click(submitButton);
    
    // Check for loading state
    expect(submitButton).toHaveTextContent(/Updating/i);
    
    // Verify error toast was shown
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "Failed to update password",
          variant: "destructive",
        })
      );
    });
    
    // Verify button returns to normal state
    await waitFor(() => {
      expect(submitButton).toHaveTextContent(/Update Password/i);
    });
  });
});
