import React from "react";
import { render, fireEvent, cleanup, waitFor } from "@testing-library/react";
import ProductsField from "../ProductsField";

/* eslint-disable @typescript-eslint/naming-convention -- Jest ESM interop and SDK/config field names */
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: {
    init: jest.fn(() =>
      Promise.resolve({
        stack: { _data: { api_key: "test-key" } },
        getConfig: jest.fn(() =>
          Promise.resolve({
            configField1: "client-id",
            configField2: "secret",
            is_custom_json: false,
          })
        ),
        location: {
          CustomField: {
            field: {
              getData: jest.fn(() => ({ data: [] })),
              setData: jest.fn(),
            },
            frame: { enableAutoResizing: jest.fn() },
          },
        },
        postRobot: {},
      })
    ),
  },
}));
/* eslint-enable @typescript-eslint/naming-convention */

describe("Products field (CustomField)", () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn() as typeof window.open;
  });

  afterEach(() => {
    cleanup();
    window.open = originalOpen;
  });

  it("renders add-products control after SDK initializes", async () => {
    const { container } = render(<ProductsField />);
    await waitFor(() => {
      expect(
        container.querySelector("button.add-product-btn")
      ).toBeInTheDocument();
    });
  });

  it("opens selector window when add is clicked", async () => {
    const { container } = render(<ProductsField />);
    await waitFor(() => {
      expect(container.querySelector("button.add-product-btn")).toBeTruthy();
    });
    fireEvent.click(container.querySelector("button.add-product-btn")!);
    expect(window.open).toHaveBeenCalled();
  });
});
