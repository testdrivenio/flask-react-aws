import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import UsersList from "../UsersList";

afterEach(cleanup);

const users = [
  {
    email: "hermanmu@gmail.com",
    id: 1,
    username: "michael",
  },
  {
    email: "michael@mherman.org",
    id: 2,
    username: "michaelherman",
  },
];

it("renders a username", () => {
  const { getByText } = render(
    <UsersList
      users={users}
      removeUser={() => true}
      isAuthenticated={() => true}
    />
  );
  expect(getByText("michael")).toHaveClass("username");
  expect(getByText("michaelherman")).toHaveClass("username");
});

it("renders", () => {
  const { asFragment } = render(
    <UsersList
      users={users}
      removeUser={() => true}
      isAuthenticated={() => false}
    />
  );
  expect(asFragment()).toMatchSnapshot();
});

it("renders when authenticated", () => {
  const { asFragment } = render(
    <UsersList
      users={users}
      removeUser={() => true}
      isAuthenticated={() => true}
    />
  );
  expect(asFragment()).toMatchSnapshot();
});
