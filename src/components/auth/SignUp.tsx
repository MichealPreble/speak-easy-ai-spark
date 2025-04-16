
import React from "react";
import { SignUpForm } from "./SignUpForm";

interface SignUpProps {
  setActiveTab: (tab: string) => void;
}

const SignUp = ({ setActiveTab }: SignUpProps) => {
  return <SignUpForm onSwitchTab={() => setActiveTab("signin")} />;
};

export default SignUp;
