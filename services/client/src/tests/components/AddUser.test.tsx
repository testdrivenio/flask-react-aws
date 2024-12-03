import React from "react";
import { render, screen } from "../test-utils";
import { it, expect, describe, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import AddUser from "../../components/AddUser";

describe("AddUser", () => {
  const mockAddUserToList = vi.fn();

  it("renders with default props", () => {
    render(<AddUser addUserToList={mockAddUserToList} />);

    const usernameInput = screen.getByLabelText(/username/i);
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveValue("");

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue("");

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveValue("");

    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
  });

  it("renders", () => {
    const { asFragment } = render(
      <AddUser addUserToList={mockAddUserToList} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
