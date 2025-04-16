
import React from "react";
import { SignUpForm } from "./SignUpForm";

interface SignUpProps {
  onSwitchTab: () => void;
}

export const SignUp = ({ onSwitchTab }: SignUpProps) => {
  return <SignUpForm onSwitchTab={onSwitchTab} />;
};

export default SignUp;
