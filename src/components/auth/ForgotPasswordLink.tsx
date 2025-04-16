
import React from "react";
import { Link } from "react-router-dom";

const ForgotPasswordLink = () => {
  return (
    <Link
      to="/auth/forgot-password"
      className="text-sm font-medium text-primary hover:underline"
    >
      Forgot password?
    </Link>
  );
};

export default ForgotPasswordLink;
