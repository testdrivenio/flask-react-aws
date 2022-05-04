import React from "react";
import { render, screen, cleanup, fireEvent } from "../test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

import NavBar from "../../components/NavBar";

describe("NavBar", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockLogoutUser = vi.fn();

  const expandMenu = () => {
    const menuButton = screen.getByLabelText("Toggle Navigation");
    fireEvent.click(menuButton);
  };

  it("NavBar renders without crashing", () => {
    render(
      <NavBar
        title="Hello, World!"
        logoutUser={mockLogoutUser}
        isAuthenticated={() => false}
      />,
    );

    const titleElement = screen.getByText("Hello, World!");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.closest("h1")).toHaveClass("navbar-item");
    expect(titleElement.closest("h1")).toHaveClass("nav-title");
  });

  it("NavBar contains correct navigation links when user is logged out", () => {
    render(
      <NavBar
        title="Hello, World!"
        logoutUser={mockLogoutUser}
        isAuthenticated={() => false}
      />,
    );

    expandMenu();

    // Links that should be visible when logged out
    expect(screen.getAllByText("About")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Register")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Log In")[0]).toBeInTheDocument();

    // Links that should be hidden when logged out
    expect(screen.queryByText("User Status")).not.toBeInTheDocument();
    expect(screen.queryByText("Log Out")).not.toBeInTheDocument();
  });

  it("NavBar contains correct navigation links when user is logged in", () => {
    render(
      <NavBar
        title="Hello, World!"
        logoutUser={mockLogoutUser}
        isAuthenticated={() => true}
      />,
    );

    expandMenu();

    // Links that should be visible when logged in
    expect(screen.getAllByText("About")[0]).toBeInTheDocument();
    expect(screen.getAllByText("User Status")[0]).toBeInTheDocument();

    // Check for Log Out link
    const logOutLinks = screen.getAllByText("Log Out");
    expect(logOutLinks.length).toBeGreaterThan(0);
    expect(logOutLinks[0]).toBeInTheDocument();

    // Links that should be hidden when logged in
    expect(screen.queryByText("Register")).not.toBeInTheDocument();
    expect(screen.queryByText("Log In")).not.toBeInTheDocument();
  });

  it("NavBar renders properly", () => {
    const { asFragment } = render(
      <NavBar
        title="Hello, World!"
        logoutUser={mockLogoutUser}
        isAuthenticated={() => false}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
