
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInForm from '../SignInForm';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('SignInForm', () => {
  const mockSignIn = jest.fn();
  const mockToast = { toast: jest.fn() };
  const mockSetActiveTab = jest.fn();
  
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ signIn: mockSignIn });
    (useToast as jest.Mock).mockReturnValue(mockToast);
    jest.clearAllMocks();
  });

  it('renders sign-in form', () => {
    render(<SignInForm setActiveTab={mockSetActiveTab} />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<SignInForm setActiveTab={mockSetActiveTab} />);
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    render(<SignInForm setActiveTab={mockSetActiveTab} />);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    // Find toggle button by its aria-label
    const togglePassword = screen.getByLabelText('Show password');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(togglePassword);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('calls signIn with correct values', async () => {
    render(<SignInForm setActiveTab={mockSetActiveTab} />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123' } });
    
    const rememberMeCheckbox = screen.getByLabelText(/Remember me/i);
    fireEvent.click(rememberMeCheckbox);
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'Password123', true);
    });
  });

  it('shows loading state during sign in', async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<SignInForm setActiveTab={mockSetActiveTab} />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    expect(screen.getByText(/Signing in.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signing in.../i })).toBeDisabled();
  });

  it('displays toast on sign in success', async () => {
    mockSignIn.mockResolvedValue(undefined);
    
    render(<SignInForm setActiveTab={mockSetActiveTab} />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Success",
        description: "You have been signed in",
      });
    });
  });

  it('displays toast on sign in error', async () => {
    const errorMessage = 'Invalid credentials';
    mockSignIn.mockRejectedValue(new Error(errorMessage));
    
    render(<SignInForm setActiveTab={mockSetActiveTab} />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    });
  });

  it('switches to sign-up tab', () => {
    render(<SignInForm setActiveTab={mockSetActiveTab} />);
    
    fireEvent.click(screen.getByText(/Sign up/i));
    
    expect(mockSetActiveTab).toHaveBeenCalledWith('signup');
  });
});
