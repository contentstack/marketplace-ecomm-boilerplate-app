/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
/* Spec: wiki marketplace-apps/ecomm-boilerplate/flows/product-selection.md (popup side) */
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import axios from "axios";
import SelectorPage from ".";
import localeTexts from "../../common/locale/en-us";
import rootConfig from "../../root_config";

jest.mock("axios", () => ({ __esModule: true, default: jest.fn() }));
const mockedAxios = axios as unknown as jest.Mock;

const config = { configField1: "a", configField2: "b", page_count: "5" };
const opener = { postMessage: jest.fn() };
let closeSpy: jest.SpyInstance;

const vendorReturns = (items: any[]) =>
  mockedAxios.mockResolvedValue({
    data: {
      data: items,
      meta: { pagination: { total: items.length, current_page: 1 } },
    },
  });

const buttonWith = async (text: string) =>
  (await waitFor(() => {
    const b = screen
      .getAllByRole("button")
      .find((x) => x.textContent?.includes(text));
    expect(b).toBeTruthy();
    return b;
  })) as HTMLElement;

const initFromField = (extra: any = {}) =>
  act(() => {
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          message: "init",
          config,
          selectedItems: [3],
          type: "product",
          ...extra,
        },
      })
    );
  });

beforeEach(() => {
  process.env.REACT_APP_API_URL = "https://api.test/fn";
  mockedAxios.mockReset();
  opener.postMessage.mockClear();
  Object.defineProperty(window, "opener", {
    value: opener,
    configurable: true,
    writable: true,
  });
  closeSpy = jest.spyOn(window, "close").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  Object.defineProperty(window, "opener", {
    value: null,
    configurable: true,
    writable: true,
  });
  jest.restoreAllMocks();
});

describe("selector popup", () => {
  it("tells its opener it is ready", () => {
    render(<SelectorPage />);
    expect(opener.postMessage).toHaveBeenCalledWith(
      "openedReady",
      window.location.origin
    );
  });

  it("tells its opener when the window closes", () => {
    render(<SelectorPage />);
    window.dispatchEvent(new Event("beforeunload"));
    expect(opener.postMessage).toHaveBeenCalledWith(
      { message: "close" },
      window.location.origin
    );
  });

  it("after init, fetches the vendor list with the field's config and page size", async () => {
    vendorReturns([
      { id: 1, name: "One", sku: "s1", price: 1, description: "d" },
    ]);
    render(<SelectorPage />);
    initFromField();
    await waitFor(() => expect(mockedAxios).toHaveBeenCalled());
    const call = mockedAxios.mock.calls[0][0];
    expect(call.method).toBe("POST");
    expect(call.url).toContain("https://api.test/fn?query=product");
    expect(call.url).toContain("limit=5");
    expect(call.data).toEqual({ ...config, type: "product" });
  });

  it("shows the invalid-credentials warning when the API answers 500", async () => {
    mockedAxios.mockRejectedValue({ response: { status: 500 } });
    render(<SelectorPage />);
    initFromField();
    const msg = localeTexts.warnings.invalidCredentials.replace(
      "$",
      rootConfig.ecommerceEnv.APP_ENG_NAME
    );
    expect(await screen.findByText(msg)).toBeInTheDocument();
  });

  it("shows the vendor's message when the API answers 429", async () => {
    mockedAxios.mockRejectedValue({
      response: { status: 429, data: "Too many requests" },
    });
    render(<SelectorPage />);
    initFromField();
    expect(await screen.findByText("Too many requests")).toBeInTheDocument();
  });

  it("Add posts the chosen ids back to the field and closes the popup", async () => {
    vendorReturns([
      { id: 3, name: "Three", sku: "s3", price: 3, description: "d" },
    ]);
    render(<SelectorPage />);
    initFromField();
    await waitFor(() => expect(mockedAxios).toHaveBeenCalled());
    fireEvent.click(await buttonWith(localeTexts.buttonLabels.product));
    expect(opener.postMessage).toHaveBeenCalledWith(
      { message: "add", dataArr: expect.anything(), dataIds: ["3"] },
      window.location.origin
    );
    expect(closeSpy).toHaveBeenCalled();
  });

  it("Close closes the popup without posting an add", async () => {
    vendorReturns([]);
    render(<SelectorPage />);
    initFromField();
    fireEvent.click(await buttonWith(localeTexts.buttonLabels.close));
    expect(closeSpy).toHaveBeenCalled();
    expect(opener.postMessage).not.toHaveBeenCalledWith(
      expect.objectContaining({ message: "add" }),
      expect.anything()
    );
  });

  it("labels the add button for categories when the field type is category", async () => {
    vendorReturns([]);
    render(<SelectorPage />);
    initFromField({ type: "category" });
    await waitFor(() => expect(mockedAxios).toHaveBeenCalled());
    expect(
      await buttonWith(localeTexts.buttonLabels.category)
    ).toBeInTheDocument();
  });
});
