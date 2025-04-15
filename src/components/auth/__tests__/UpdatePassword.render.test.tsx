
import { screen } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { renderUpdatePassword, resetMocks } from "./updatePasswordTestUtils";
import "@testing-library/jest-dom";

describe("UpdatePassword Rendering", () => {
  beforeEach(() => {
    resetMocks();
  });

  // Test: Component renders correctly
  test("renders update password form correctly", () => {
    renderUpdatePassword();
    
    expect(screen.getByText("Update Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update Password/i })).toBeInTheDocument();
  });
});
