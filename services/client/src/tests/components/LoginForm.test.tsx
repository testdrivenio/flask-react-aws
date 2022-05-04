import React from "react";
import { render, screen } from "../test-utils";
import { describe, it, expect, vi } from "vitest";
import { expect as expectVitest } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import LoginForm from "../../components/LoginForm";

const mockProps = {
  onSubmit: vi.fn(),
  isAuthenticated: vi.fn().mockReturnValue(false),
};

const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: Router });
};

describe("LoginForm", () => {
  it("renders properly", () => {
    renderWithRouter(<LoginForm {...mockProps} />);
    const heading = screen.getByRole("heading", { name: "Log In" });
    expect(heading.tagName.toLowerCase()).toBe("h1");
  });

  it("renders with default props", () => {
    renderWithRouter(<LoginForm {...mockProps} />);

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    expect(emailInput.type).toBe("email");
    expect(emailInput.value).toBe("");

    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");
    expect(passwordInput.value).toBe("");

    const submitButtons = screen.getAllByRole("button", { name: "Log In" });
    expect(submitButtons[0].textContent).toBe("Log In");
  });

  it("renders", () => {
    const { asFragment } = renderWithRouter(<LoginForm {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders login form when not authenticated", () => {
    const { container } = renderWithRouter(<LoginForm {...mockProps} />);
    const heading = container.querySelector("h1");
    expectVitest(heading?.textContent).toBe("Log In");
  });

  it("redirects when authenticated", () => {
    const authenticatedProps = {
      ...mockProps,
      isAuthenticated: vi.fn().mockReturnValue(true),
    };
    renderWithRouter(<LoginForm {...authenticatedProps} />);
    expect(window.location.pathname).toBe("/");
  });
});
