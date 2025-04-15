
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { useNavigate } from "react-router-dom";
import UpdatePassword from "../UpdatePassword";
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
      updatePassword: vi.fn().mockImplementation((password) => {
        if (password === "weak") {
          return Promise.reject(new Error("Password is too weak"));
        }
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
      <UpdatePassword />
    );
  };

  // Test 1: Component renders correctly
  test("renders update password form correctly", () => {
    renderComponent();
    
    expect(screen.getByText("Update Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update password/i })).toBeInTheDocument();
  });

  // Test 2: Password validation works
  test("shows validation error for weak password", async () => {
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /update password/i });
    
    // Try entering a short password
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.change(confirmInput, { target: { value: "123" } });
    fireEvent.click(submitButton);
    
    // Check for validation error (password too short)
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
    
    // Try password without uppercase
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.change(confirmInput, { target: { value: "12345678" } });
    fireEvent.click(submitButton);
    
    // Check for validation error (missing uppercase)
    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
    });
  });

  // Test 3: Password mismatch validation
  test("shows error when passwords don't match", async () => {
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /update password/i });
    
    // Enter different passwords
    fireEvent.change(passwordInput, { target: { value: "StrongPass123" } });
    fireEvent.change(confirmInput, { target: { value: "DifferentPass123" } });
    fireEvent.click(submitButton);
    
    // Check for password mismatch error
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });

  // Test 4: Successful password update
  test("successfully updates password with valid input", async () => {
    const { useAuth } = await import("@/context/AuthContext");
    const { useToast } = await import("@/hooks/use-toast");
    const navigate = useNavigate();
    
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /update password/i });
    
    // Enter valid matching passwords
    fireEvent.change(passwordInput, { target: { value: "StrongPass123" } });
    fireEvent.change(confirmInput, { target: { value: "StrongPass123" } });
    fireEvent.click(submitButton);
    
    // Check loading state
    expect(submitButton).toHaveTextContent(/updating/i);
    
    // Verify updatePassword was called
    await waitFor(() => {
      expect(useAuth().updatePassword).toHaveBeenCalledWith("StrongPass123");
    });
    
    // Verify toast and navigation
    expect(useToast().toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Password updated",
        description: expect.any(String),
      })
    );
  });

  // Test 5: Error handling
  test("shows error toast when update fails", async () => {
    const { useToast } = await import("@/hooks/use-toast");
    
    renderComponent();
    
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /update password/i });
    
    // Enter password that will trigger an error in our mock
    fireEvent.change(passwordInput, { target: { value: "weak" } });
    fireEvent.change(confirmInput, { target: { value: "weak" } });
    fireEvent.click(submitButton);
    
    // Check loading state
    expect(submitButton).toHaveTextContent(/updating/i);
    
    // Verify error toast was shown
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "Password is too weak",
          variant: "destructive",
        })
      );
    });
    
    // Verify button returns to normal state
    expect(submitButton).toHaveTextContent(/update password/i);
  });
});
