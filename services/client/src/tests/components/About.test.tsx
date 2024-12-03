import React from "react";
import { render, cleanup } from "../test-utils";
import { it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

import About from "../../components/About";

afterEach(cleanup);

it("renders properly", () => {
  const { getByText } = render(<About />);
  expect(getByText("Add something relevant here.")).toHaveClass("content");
});

it("renders", () => {
  const { asFragment } = render(<About />);
  expect(asFragment()).toMatchSnapshot();
});
