
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../SignUp';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('SignUp', () => {
  const mockSignUp = jest.fn();
  const mockToast = { toast: jest.fn() };
  
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ signUp: mockSignUp });
    (useToast as jest.Mock).mockReturnValue(mockToast);
    jest.clearAllMocks();
  });

  it('renders sign-up form', () => {
    render(<SignUp setActiveTab={jest.fn()} />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<SignUp setActiveTab={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/You must accept the terms and conditions/i)).toBeInTheDocument();
    });
  });

  it('shows password strength indicator', async () => {
    render(<SignUp setActiveTab={jest.fn()} />);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    await waitFor(() => expect(screen.getByText(/Password strength: Weak/i)).toBeInTheDocument());
    
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    await waitFor(() => expect(screen.getByText(/Password strength: Strong/i)).toBeInTheDocument());
  });

  it('toggles password visibility', () => {
    render(<SignUp setActiveTab={jest.fn()} />);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    
    // Find toggle buttons by their aria-label
    const togglePassword = screen.getByLabelText('Show password');
    const toggleConfirmPassword = screen.getByLabelText('Show confirm password');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(togglePassword);
    fireEvent.click(toggleConfirmPassword);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('calls signUp with correct values', async () => {
    render(<SignUp setActiveTab={jest.fn()} />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password123' } });
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'Password123', 'John Doe');
    });
  });

  it('shows loading state during sign up', async () => {
    mockSignUp.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<SignUp setActiveTab={jest.fn()} />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password123' } });
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    
    expect(screen.getByText(/Creating account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Creating account/i })).toBeDisabled();
  });

  it('switches to sign-in tab', () => {
    const setActiveTab = jest.fn();
    render(<SignUp setActiveTab={setActiveTab} />);
    
    fireEvent.click(screen.getByText(/Sign in/i));
    
    expect(setActiveTab).toHaveBeenCalledWith('signin');
  });
});
