import React from "react";
import { render, cleanup } from "@testing-library/react";

import Message from "../Message";

afterEach(cleanup);

describe('when "messageType" is "success"', () => {
  const props = {
    messageType: "success",
    messageText: "Hello, World!",
    removeMessage: () => true,
  };

  it("renders the default props", async () => {
    const { getByText, getByTestId } = render(<Message {...props} />);
    expect(getByTestId("message").innerHTML).toContain("is-success");
    expect(getByText("Hello, World!")).toHaveClass("message-text");
  });

  it("renders", () => {
    const { asFragment } = render(<Message {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('when "messageType" is "danger"', () => {
  const props = {
    messageType: "danger",
    messageText: "Hello, World!",
    removeMessage: () => true,
  };

  it("renders the default props", () => {
    const { getByText, getByTestId } = render(<Message {...props} />);
    expect(getByTestId("message").innerHTML).toContain("is-danger");
    expect(getByText("Hello, World!")).toHaveClass("message-text");
  });

  it("renders", () => {
    const { asFragment } = render(<Message {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
