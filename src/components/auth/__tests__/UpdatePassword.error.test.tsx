
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { renderUpdatePassword, resetMocks, mockToast } from "./updatePasswordTestUtils";
import "@testing-library/jest-dom";

describe("UpdatePassword Error Handling", () => {
  beforeEach(() => {
    resetMocks();
  });

  // Test: Error handling
  test("shows error toast when update fails", async () => {
    renderUpdatePassword();
    
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
      expect(mockToast).toHaveBeenCalledWith(
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
