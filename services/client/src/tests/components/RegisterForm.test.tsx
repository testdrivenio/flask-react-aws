import React from "react";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act,
} from "../test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import RegisterForm from "../../components/RegisterForm";
import { expect as expectVitest } from "vitest";

const mockProps = {
  onSubmit: vi.fn(),
  isAuthenticated: vi.fn().mockReturnValue(false),
};

const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: Router });
};

describe("RegisterForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders properly", () => {
    renderWithRouter(<RegisterForm {...mockProps} />);
    const heading = screen.getByRole("heading", { name: "Register" });
    expect(heading.tagName.toLowerCase()).toBe("h1");
  });

  it("renders with default props", () => {
    renderWithRouter(<RegisterForm {...mockProps} />);

    const usernameInput = screen.getByLabelText("Username") as HTMLInputElement;
    expect(usernameInput.value).toBe("");

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    expect(emailInput.type).toBe("email");
    expect(emailInput.value).toBe("");

    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");
    expect(passwordInput.value).toBe("");

    const submitButtons = screen.getAllByRole("button", { name: "Register" });
    expect(submitButtons[0].textContent).toBe("Register");
  });

  it("renders", () => {
    const { asFragment } = renderWithRouter(<RegisterForm {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders register form when not authenticated", () => {
    const { container } = renderWithRouter(<RegisterForm {...mockProps} />);
    const heading = container.querySelector("h1");
    expectVitest(heading?.textContent).toBe("Register");
  });

  it("redirects when authenticated", () => {
    const authenticatedProps = {
      ...mockProps,
      isAuthenticated: vi.fn().mockReturnValue(true),
    };
    renderWithRouter(<RegisterForm {...authenticatedProps} />);
    expect(window.location.pathname).toBe("/");
  });
});

describe("handles form validation correctly", () => {
  afterEach(() => {
    cleanup();
  });
  const mockProps = {
    onSubmit: vi.fn(),
    isAuthenticated: vi.fn().mockReturnValue(false),
  };

  it("when fields are empty", async () => {
    renderWithRouter(<RegisterForm {...mockProps} />);

    const submitButton = screen.getByRole("button", { name: "Register" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("errors-username").textContent).to.include(
        "Username must be at least 6 characters long",
      );
      expect(screen.getByTestId("errors-email").textContent).to.include(
        "Enter a valid email",
      );
      expect(screen.getByTestId("errors-password").textContent).to.include(
        "Password must be at least 11 characters long",
      );
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it("when email field is not valid", async () => {
    const { getByLabelText, container, findByTestId } = renderWithRouter(
      <RegisterForm {...mockProps} />,
    );

    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");
    const emailInput = getByLabelText("Email");

    expect(mockProps.onSubmit).toHaveBeenCalledTimes(0);

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalid" } });
      fireEvent.blur(emailInput);
    });

    expect((await findByTestId("errors-email")).innerHTML).toBe(
      "Enter a valid email",
    );

    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledTimes(0);
    });
  });

  it("when fields are not the proper length", async () => {
    const { getByLabelText, container, findByTestId } = renderWithRouter(
      <RegisterForm {...mockProps} />,
    );

    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");
    const usernameInput = getByLabelText("Username");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");

    expect(mockProps.onSubmit).toHaveBeenCalledTimes(0);

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "null" } });
      fireEvent.change(emailInput, { target: { value: "t@t.c" } });
      fireEvent.change(passwordInput, { target: { value: "invalid" } });
      fireEvent.blur(usernameInput);
      fireEvent.blur(emailInput);
      fireEvent.blur(passwordInput);
    });

    expect((await findByTestId("errors-username")).innerHTML).to.include(
      "Username must be at least 6 characters long",
    );
    expect((await findByTestId("errors-email")).innerHTML).to.include(
      "Email must be at least 6 characters long",
    );
    expect((await findByTestId("errors-password")).innerHTML).to.include(
      "Password must be at least 11 characters long",
    );

    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledTimes(0);
    });
  });

  it("when fields are valid", async () => {
    const { getByLabelText, container } = renderWithRouter(
      <RegisterForm {...mockProps} />,
    );

    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");
    const usernameInput = getByLabelText("Username");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");

    expect(mockProps.onSubmit).toHaveBeenCalledTimes(0);

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "proper" } });
      fireEvent.change(emailInput, { target: { value: "t@t.com" } });
      fireEvent.change(passwordInput, { target: { value: "properlength" } });
      fireEvent.blur(usernameInput);
      fireEvent.blur(emailInput);
      fireEvent.blur(passwordInput);

      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
