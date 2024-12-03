import React from "react";
import { render, screen } from "../test-utils";
import { it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

import NavBar from "../../components/NavBar";

const mockProps = {
  title: "Hello, World!",
  logoutUser: () => {},
  isAuthenticated: () => false,
};

it("NavBar renders without crashing", () => {
  render(<NavBar {...mockProps} />);

  const titleElement = screen.getByText("Hello, World!");
  expect(titleElement).toBeInTheDocument();
  expect(titleElement.closest("h1")).toHaveClass("navbar-item");
  expect(titleElement.closest("h1")).toHaveClass("nav-title");
});

it("NavBar renders properly", () => {
  const { asFragment } = render(<NavBar {...mockProps} />);
  expect(asFragment()).toMatchSnapshot();
});
