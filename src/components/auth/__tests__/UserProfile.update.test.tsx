
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { 
  renderUserProfile, 
  resetMocks, 
  mockUpdateProfile, 
  mockToast 
} from "./userProfileTestUtils";
import "@testing-library/jest-dom";

describe("UserProfile Update Functionality", () => {
  beforeEach(() => {
    resetMocks();
  });

  // Test 1: Form updates profile successfully
  test("updates profile successfully", async () => {
    renderUserProfile();
    
    // Get form inputs
    const nameInput = screen.getByLabelText(/Full Name/i);
    const avatarInput = screen.getByLabelText(/Avatar URL/i);
    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    
    // Update form fields
    fireEvent.change(nameInput, { target: { value: "Updated Name" } });
    fireEvent.change(avatarInput, { target: { value: "https://example.com/new-avatar.jpg" } });
    
    // Submit form
    fireEvent.click(saveButton);
    
    // Verify loading state
    expect(saveButton).toHaveTextContent(/Saving/i);
    
    // Verify updateProfile was called with correct values
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        full_name: "Updated Name",
        avatar_url: "https://example.com/new-avatar.jpg",
      });
    });
    
    // Verify success toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Profile updated",
          description: expect.any(String),
        })
      );
    });
  });

  // Test 2: Handles profile update error
  test("handles profile update error", async () => {
    const mockErrorUpdateProfile = vi.fn().mockRejectedValue(new Error("Update failed"));
    renderUserProfile({ updateProfile: mockErrorUpdateProfile });
    
    // Get form inputs and submit button
    const nameInput = screen.getByLabelText(/Full Name/i);
    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    
    // Update name and submit
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    fireEvent.click(saveButton);
    
    // Verify error toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error updating profile",
          description: "Update failed",
          variant: "destructive",
        })
      );
    });
    
    // Verify button returns to normal state
    expect(saveButton).not.toHaveTextContent(/Saving/i);
  });
});
