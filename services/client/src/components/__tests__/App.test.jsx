import React from "react";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import App from "../../App";

afterEach(cleanup);

it("renders", () => {
  const { asFragment } = renderWithRouter(<App />);
  expect(asFragment()).toMatchSnapshot();
});
