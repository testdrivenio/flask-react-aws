import React from "react";
import { cleanup, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import RegisterForm from "../RegisterForm";

afterEach(cleanup);

describe("renders", () => {
  const props = {
    handleRegisterFormSubmit: () => {
      return true;
    },
    isAuthenticated: () => {
      return false;
    },
  };

  it("properly", () => {
    const { getByText } = renderWithRouter(<RegisterForm {...props} />);
    expect(getByText("Register")).toHaveClass("title");
  });

  it("default props", () => {
    const { getByLabelText, getByText } = renderWithRouter(
      <RegisterForm {...props} />
    );

    const usernameInput = getByLabelText("Username");
    expect(usernameInput).toHaveAttribute("type", "text");
    expect(usernameInput).not.toHaveValue();

    const emailInput = getByLabelText("Email");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).not.toHaveValue();

    const passwordInput = getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).not.toHaveValue();

    const buttonInput = getByText("Submit");
    expect(buttonInput).toHaveValue("Submit");
  });

  it("a snapshot properly", () => {
    const { asFragment } = renderWithRouter(<RegisterForm {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("handles form validation correctly", () => {
  const mockProps = {
    handleRegisterFormSubmit: jest.fn(),
    isAuthenticated: jest.fn(),
  };

  it("when fields are empty", async () => {
    const { getByLabelText, container, findByTestId } = renderWithRouter(
      <RegisterForm {...mockProps} />
    );

    const form = container.querySelector("form");
    const usernameInput = getByLabelText("Username");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");

    expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);

    await act(async () => {
      fireEvent.blur(usernameInput);
      fireEvent.blur(emailInput);
      fireEvent.blur(passwordInput);
    });

    expect((await findByTestId("errors-username")).innerHTML).toBe(
      "Username is required."
    );
    expect((await findByTestId("errors-email")).innerHTML).toBe(
      "Email is required."
    );
    expect((await findByTestId("errors-password")).innerHTML).toBe(
      "Password is required."
    );

    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);
    });
  });

  it("when email field is not valid", async () => {
    const { getByLabelText, container, findByTestId } = renderWithRouter(
      <RegisterForm {...mockProps} />
    );

    const form = container.querySelector("form");
    const emailInput = getByLabelText("Email");

    expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalid" } });
      fireEvent.blur(emailInput);
    });

    expect((await findByTestId("errors-email")).innerHTML).toBe(
      "Enter a valid email."
    );

    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);
    });
  });

  it("when fields are not the proper length", async () => {
    const { getByLabelText, container, findByTestId } = renderWithRouter(
      <RegisterForm {...mockProps} />
    );

    const form = container.querySelector("form");
    const usernameInput = getByLabelText("Username");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");

    expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "null" } });
      fireEvent.change(emailInput, { target: { value: "t@t.c" } });
      fireEvent.change(passwordInput, { target: { value: "invalid" } });
      fireEvent.blur(usernameInput);
      fireEvent.blur(emailInput);
      fireEvent.blur(passwordInput);
    });

    expect((await findByTestId("errors-username")).innerHTML).toBe(
      "Username must be greater than 5 characters."
    );
    expect((await findByTestId("errors-email")).innerHTML).toBe(
      "Email must be greater than 5 characters."
    );
    expect((await findByTestId("errors-password")).innerHTML).toBe(
      "Password must be greater than 10 characters."
    );

    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);
    });
  });

  it("when fields are valid", async () => {
    const { getByLabelText, container, findByTestId } = renderWithRouter(
      <RegisterForm {...mockProps} />
    );

    const form = container.querySelector("form");
    const usernameInput = getByLabelText("Username");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");

    expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(0);

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
      expect(mockProps.handleRegisterFormSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
