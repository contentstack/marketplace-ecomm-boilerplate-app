import React from "react";
import { render, screen, fireEvent } from "@testing-library/react/pure";
import ConfigScreen from ".";

let configScreenRenderedDOM: ReturnType<typeof render> | null = null;

beforeAll(() => {
  configScreenRenderedDOM = render(<ConfigScreen />);
});

describe("UI Elements of Configuration Screen", () => {
  it("renders config form wrapper", () => {
    expect(screen.getByTestId("config-wrapper")).toBeTruthy();
  });

  it("renders two text field groups from root config", () => {
    expect(screen.getAllByTestId("text_label")).toHaveLength(2);
    expect(screen.getAllByTestId("text_help")).toHaveLength(2);
    expect(screen.getAllByTestId("text_input")).toHaveLength(2);
    expect(screen.getAllByTestId("text_instruction")).toHaveLength(2);
  });

  it("renders configured field labels", () => {
    expect(
      screen.getByText("Sample Ecommerce App Client ID")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sample Ecommerce App Client Secret")
    ).toBeInTheDocument();
  });

  it("renders save-in-entry and page count sections", () => {
    expect(screen.getByText("Save In Entry")).toBeInTheDocument();
    expect(screen.getByText("Items Per Page")).toBeInTheDocument();
    expect(screen.getByTestId("page_count-input")).toBeTruthy();
  });

  it("shows custom keys selector when Custom Fields is selected", () => {
    fireEvent.click(screen.getByLabelText("Custom Fields"));
    expect(screen.getByText("Ecommerce Fields")).toBeInTheDocument();
    const selectElement = configScreenRenderedDOM?.container?.querySelector(
      "[data-test-id=cs-select]"
    );
    expect(selectElement).toBeTruthy();
  });
});
