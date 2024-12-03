import React from "react";
import { render, screen, cleanup } from "../test-utils";
import { describe, it, expect, afterEach, vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";
import Message from "../../components/Message";

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("Message Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders a success message", () => {
    const props = {
      messageType: "success" as const,
      messageText: "Operation successful!",
    };
    renderWithChakra(<Message {...props} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(alert.getAttribute("data-status")).toBe("success");
    expect(screen.getByText("Operation successful!")).toBeDefined();
  });

  it("renders an error message", () => {
    const props = {
      messageType: "error" as const,
      messageText: "An error occurred.",
    };
    renderWithChakra(<Message {...props} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(alert.getAttribute("data-status")).toBe("error");
    expect(screen.getByText("An error occurred.")).toBeDefined();
  });

  it("renders an info message", () => {
    const props = {
      messageType: "info" as const,
      messageText: "Here is some information.",
    };
    renderWithChakra(<Message {...props} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(alert.getAttribute("data-status")).toBe("info");
    expect(screen.getByText("Here is some information.")).toBeDefined();
  });

  it("renders a close button when onClose prop is provided", () => {
    const onCloseMock = vi.fn();
    const props = {
      messageType: "info" as const,
      messageText: "Closable message",
      onClose: onCloseMock,
    };
    renderWithChakra(<Message {...props} />);

    const closeButton = screen.getByRole("button");
    expect(closeButton).toBeDefined();
  });

  it("does not render a close button when onClose prop is not provided", () => {
    const props = {
      messageType: "info" as const,
      messageText: "Non-closable message",
    };
    renderWithChakra(<Message {...props} />);

    const closeButton = screen.queryByRole("button");
    expect(closeButton).toBeNull();
  });
});

describe("Message Component Snapshots", () => {
  it("matches snapshot for success message", () => {
    const props = {
      messageType: "success" as const,
      messageText: "Operation successful!",
    };
    const { asFragment } = renderWithChakra(<Message {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for error message", () => {
    const props = {
      messageType: "error" as const,
      messageText: "An error occurred.",
    };
    const { asFragment } = renderWithChakra(<Message {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for info message", () => {
    const props = {
      messageType: "info" as const,
      messageText: "Here is some information.",
    };
    const { asFragment } = renderWithChakra(<Message {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for message with close button", () => {
    const props = {
      messageType: "info" as const,
      messageText: "Closable message",
      onClose: () => {},
    };
    const { asFragment } = renderWithChakra(<Message {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
