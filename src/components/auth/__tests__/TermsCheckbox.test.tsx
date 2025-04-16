
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TermsCheckbox } from '../TermsCheckbox';
import { useForm } from 'react-hook-form';

// Create a wrapper component that provides the required React Hook Form context
const TestWrapper = () => {
  const { register, formState: { errors }, handleSubmit } = useForm();
  
  const onSubmit = jest.fn();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TermsCheckbox 
        register={register} 
        errors={errors} 
      />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('TermsCheckbox', () => {
  it('renders the checkbox and terms link', () => {
    render(<TestWrapper />);
    
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    
    const termsLink = screen.getByText('Terms and Conditions');
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(termsLink).toHaveAttribute('target', '_blank');
    expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
  
  it('should be checkable', () => {
    render(<TestWrapper />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
  
  it('should be disabled when disabled prop is true', () => {
    const { register, formState: { errors } } = useForm();
    
    render(
      <TermsCheckbox 
        register={register} 
        errors={errors} 
        disabled={true} 
      />
    );
    
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
  
  it('should not show error message by default', () => {
    render(<TestWrapper />);
    
    expect(screen.queryByText(/You must agree to the terms/i)).not.toBeInTheDocument();
  });
});
