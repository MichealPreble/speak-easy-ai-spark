
import React from "react";
import { SignUpForm } from "./SignUpForm";

interface SignUpProps {
  setActiveTab: (tab: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ setActiveTab }) => {
  const handleSwitchTab = () => {
    setActiveTab("signin");
  };

  return <SignUpForm onSwitchTab={handleSwitchTab} />;
};

export default SignUp;
