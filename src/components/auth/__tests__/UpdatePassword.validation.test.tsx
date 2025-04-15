
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { renderUpdatePassword, resetMocks } from "./updatePasswordTestUtils";
import "@testing-library/jest-dom";

describe("UpdatePassword Validation", () => {
  beforeEach(() => {
    resetMocks();
  });

  // Test: Password validation - too short
  test("shows validation error when password is too short", async () => {
    renderUpdatePassword();
    
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

  // Test: Password validation - no uppercase
  test("shows validation error when password has no uppercase letter", async () => {
    renderUpdatePassword();
    
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

  // Test: Password validation - passwords don't match
  test("shows validation error when passwords don't match", async () => {
    renderUpdatePassword();
    
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
});
