/* global jest */

import React from "react";
import { Router } from "react-router-dom";
import { render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import "@testing-library/jest-dom";

global.renderWithRouter = function renderWithRouter(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  return {
    ...render(
      <Router location={history.location} navigator={history}>
        {ui}
      </Router>
    ),
    history,
  };
};
