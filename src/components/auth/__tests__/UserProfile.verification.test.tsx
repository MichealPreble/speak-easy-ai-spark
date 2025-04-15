
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { 
  renderUserProfile, 
  resetMocks, 
  mockSendVerificationEmail, 
  mockToast 
} from "./userProfileTestUtils";
import "@testing-library/jest-dom";

describe("UserProfile Email Verification", () => {
  beforeEach(() => {
    resetMocks();
  });

  // Test: Send verification email works
  test("can send verification email", async () => {
    renderUserProfile({ isEmailVerified: false });
    
    // Get verification button
    const verifyButton = screen.getByRole("button", { name: /Send verification email/i });
    
    // Click verify button
    fireEvent.click(verifyButton);
    
    // Verify loading state
    expect(verifyButton).toHaveTextContent(/Sending/i);
    
    // Verify sendVerificationEmail was called
    await waitFor(() => {
      expect(mockSendVerificationEmail).toHaveBeenCalled();
    });
    
    // Verify success toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });
});
