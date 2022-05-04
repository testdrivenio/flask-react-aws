import React from "react";
import { render, screen, fireEvent, cleanup } from "../test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";
import AddUserModal from "../../components/AddUserModal";

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("AddUserModal", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockAddUser = vi.fn();
  const mockOnClose = vi.fn();

  it("renders correctly when open", () => {
    renderWithChakra(
      <AddUserModal
        isOpen={true}
        onClose={mockOnClose}
        addUser={mockAddUser}
      />,
    );

    expect(screen.getByText("Add User")).toBeDefined();
    expect(screen.getByLabelText("Username")).toBeDefined();
    expect(screen.getByLabelText("Email")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    expect(screen.getByRole("button", { name: "Add" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDefined();
  });

  it("does not render when closed", () => {
    renderWithChakra(
      <AddUserModal
        isOpen={false}
        onClose={mockOnClose}
        addUser={mockAddUser}
      />,
    );

    expect(screen.queryByText("Add User")).toBeNull();
  });

  it("calls addUser with correct data when form is submitted", () => {
    renderWithChakra(
      <AddUserModal
        isOpen={true}
        onClose={mockOnClose}
        addUser={mockAddUser}
      />,
    );

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(mockAddUser).toHaveBeenCalledWith({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
  });

  it("calls onClose when Cancel button is clicked", () => {
    renderWithChakra(
      <AddUserModal
        isOpen={true}
        onClose={mockOnClose}
        addUser={mockAddUser}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("resets form fields after submission", () => {
    renderWithChakra(
      <AddUserModal
        isOpen={true}
        onClose={mockOnClose}
        addUser={mockAddUser}
      />,
    );

    const usernameInput = screen.getByLabelText("Username") as HTMLInputElement;
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(usernameInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });
});
