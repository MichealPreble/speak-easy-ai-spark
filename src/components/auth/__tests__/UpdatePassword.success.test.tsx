
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { 
  renderUpdatePassword, 
  resetMocks, 
  mockUpdatePassword, 
  mockNavigate, 
  mockToast 
} from "./updatePasswordTestUtils";
import "@testing-library/jest-dom";

describe("UpdatePassword Successful Updates", () => {
  beforeEach(() => {
    resetMocks();
  });

  // Test: Successful password update
  test("successfully updates password with valid input", async () => {
    renderUpdatePassword();
    
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
      expect(mockUpdatePassword).toHaveBeenCalledWith("ValidPassword123");
    });
    
    // Verify success toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password updated",
          description: expect.any(String),
        })
      );
    });
    
    // Verify navigation occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
