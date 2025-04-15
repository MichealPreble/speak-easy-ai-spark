
import { screen } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { renderUserProfile, resetMocks } from "./userProfileTestUtils";
import "@testing-library/jest-dom";

describe("UserProfile Rendering", () => {
  beforeEach(() => {
    resetMocks();
  });

  // Test 1: Component renders correctly when user is logged in
  test("renders user profile correctly when user is logged in", () => {
    renderUserProfile();
    
    // Check for user information display
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Avatar URL/i)).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole("button", { name: /Save Changes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Change Password/i })).toBeInTheDocument();
  });

  // Test 2: Component shows unverified state correctly
  test("renders unverified email state correctly", () => {
    renderUserProfile({ isEmailVerified: false });
    
    // Check for unverified badge
    expect(screen.getByText("Unverified")).toBeInTheDocument();
    expect(screen.getByText(/Your email address is not verified/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send verification email/i })).toBeInTheDocument();
  });

  // Test 3: Shows redirect to login when not logged in
  test("shows login redirect when user is not logged in", () => {
    renderUserProfile({ user: null });
    
    // Check for login message
    expect(screen.getByText(/You need to be logged in/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
    
    // Verify profile form is not shown
    expect(screen.queryByLabelText(/Full Name/i)).not.toBeInTheDocument();
  });
});
