import React from "react";
import { it, expect, describe, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "../test-utils";
import Users from "../../components/Users";
import "@testing-library/jest-dom/vitest";

describe("Users", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });
  const mockOnAddUser = vi.fn();
  const mockRemoveUser = vi.fn();

  it("Should render no registered users when there are no users passed to the component", () => {
    render(
      <Users
        users={[]}
        onAddUser={mockOnAddUser}
        removeUser={mockRemoveUser}
        isAuthenticated={false}
      />,
    ); // Pass isAuthenticated={false}
    const message = screen.getByText(/no registered users/i);
    expect(message).toBeTruthy();
  });

  it("Should render user details when users are passed to the component", () => {
    const mockUsers = [
      {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        created_date: "2024-08-19",
      },
      {
        id: 2,
        username: "jane_doe",
        email: "jane@example.com",
        created_date: "2024-08-18",
      },
    ];
    render(
      <Users
        users={mockUsers}
        onAddUser={mockOnAddUser}
        removeUser={mockRemoveUser}
        isAuthenticated={true}
      />,
    ); // Pass isAuthenticated={true}

    // Assert that the user details are correctly rendered
    const userOne = screen.getByText("john_doe");
    const userTwo = screen.getByText("jane_doe");

    expect(userOne).toBeInTheDocument();
    expect(userTwo).toBeInTheDocument();

    const emailOne = screen.getByText("john@example.com");
    const emailTwo = screen.getByText("jane@example.com");

    expect(emailOne).toBeInTheDocument();
    expect(emailTwo).toBeInTheDocument();

    // Check for Delete buttons
    const deleteButtons = screen.getAllByText("Delete");
    expect(deleteButtons).toHaveLength(2);
  });

  it("Should call onAddUser when Add User button is clicked", () => {
    render(
      <Users
        users={[]}
        onAddUser={mockOnAddUser}
        removeUser={mockRemoveUser}
        isAuthenticated={true}
      />,
    ); // Pass isAuthenticated={true}
    const addButton = screen.getByText("Add User");
    fireEvent.click(addButton);
    expect(mockOnAddUser).toHaveBeenCalled();
  });

  it("Should call removeUser when Delete button is clicked", () => {
    const mockUsers = [
      {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        created_date: "2024-08-19",
      },
    ];
    render(
      <Users
        users={mockUsers}
        onAddUser={mockOnAddUser}
        removeUser={mockRemoveUser}
        isAuthenticated={true}
      />,
    ); // Pass isAuthenticated={true}
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(mockRemoveUser).toHaveBeenCalledWith(1);
  });
});
