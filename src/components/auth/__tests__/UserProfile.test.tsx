
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import UserProfile from "../UserProfile";
import { AuthProvider } from "@/context/AuthContext";
import * as toastHook from "@/hooks/use-toast";
import "@testing-library/jest-dom"; // Add this import for DOM matchers

// Mock react-router-dom
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
      user: {
        email: "test@example.com",
        user_metadata: {
          full_name: "Test User",
          avatar_url: "https://example.com/avatar.jpg"
        }
      },
      isEmailVerified: true,
      updateProfile: vi.fn().mockResolvedValue(undefined),
      sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
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

describe("UserProfile Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
  };

  // Test 1: Component renders correctly when user is logged in
  test("renders user profile correctly when user is logged in", () => {
    renderComponent();
    
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
    // Override the mock for this specific test
    vi.mocked(useAuth).mockReturnValueOnce({
      ...vi.mocked(useAuth)(),
      isEmailVerified: false,
    });
    
    renderComponent();
    
    // Check for unverified badge
    expect(screen.getByText("Unverified")).toBeInTheDocument();
    expect(screen.getByText(/Your email address is not verified/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send verification email/i })).toBeInTheDocument();
  });

  // Test 3: Form updates profile successfully
  test("updates profile successfully", async () => {
    const { updateProfile } = vi.mocked(useAuth)();
    const { toast } = toastHook.useToast();
    
    renderComponent();
    
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
      expect(updateProfile).toHaveBeenCalledWith({
        full_name: "Updated Name",
        avatar_url: "https://example.com/new-avatar.jpg",
      });
    });
    
    // Verify success toast was shown
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Profile updated",
          description: expect.any(String),
        })
      );
    });
  });

  // Test 4: Send verification email works
  test("can send verification email", async () => {
    // Override the mock for this specific test
    vi.mocked(useAuth).mockReturnValueOnce({
      ...vi.mocked(useAuth)(),
      isEmailVerified: false,
    });
    
    const { sendVerificationEmail } = vi.mocked(useAuth)();
    const { toast } = toastHook.useToast();
    
    renderComponent();
    
    // Get verification button
    const verifyButton = screen.getByRole("button", { name: /Send verification email/i });
    
    // Click verify button
    fireEvent.click(verifyButton);
    
    // Verify loading state
    expect(verifyButton).toHaveTextContent(/Sending/i);
    
    // Verify sendVerificationEmail was called
    await waitFor(() => {
      expect(sendVerificationEmail).toHaveBeenCalled();
    });
    
    // Verify success toast was shown
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });

  // Test 5: Handles profile update error
  test("handles profile update error", async () => {
    // Override the mock for this specific test to simulate an error
    const mockUpdateProfile = vi.fn().mockRejectedValue(new Error("Update failed"));
    vi.mocked(useAuth).mockReturnValueOnce({
      ...vi.mocked(useAuth)(),
      updateProfile: mockUpdateProfile,
    });
    
    const { toast } = toastHook.useToast();
    
    renderComponent();
    
    // Get form inputs and submit button
    const nameInput = screen.getByLabelText(/Full Name/i);
    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    
    // Update name and submit
    fireEvent.change(nameInput, { target: { value: "New Name" } });
    fireEvent.click(saveButton);
    
    // Verify error toast was shown
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
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

  // Test 6: Shows redirect to login when not logged in
  test("shows login redirect when user is not logged in", () => {
    // Override the mock for this specific test
    vi.mocked(useAuth).mockReturnValueOnce({
      ...vi.mocked(useAuth)(),
      user: null,
    });
    
    renderComponent();
    
    // Check for login message
    expect(screen.getByText(/You need to be logged in/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
    
    // Verify profile form is not shown
    expect(screen.queryByLabelText(/Full Name/i)).not.toBeInTheDocument();
  });
});

// Helper function to fix TypeScript issues with mocking
function useAuth() {
  return {
    user: {
      email: "test@example.com",
      user_metadata: {
        full_name: "Test User",
        avatar_url: "https://example.com/avatar.jpg"
      }
    },
    isEmailVerified: true,
    updateProfile: vi.fn().mockResolvedValue(undefined),
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  };
}
