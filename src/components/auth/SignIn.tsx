
import React from "react";
import SignInForm from "./SignInForm";

interface SignInProps {
  setActiveTab: (tab: string) => void;
}

const SignIn = ({ setActiveTab }: SignInProps) => {
  return <SignInForm setActiveTab={setActiveTab} />;
};

export default SignIn;
