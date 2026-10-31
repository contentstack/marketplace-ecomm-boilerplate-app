/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
/* Spec: wiki marketplace-apps/ecomm-boilerplate/flows/product-selection.md + data-model.md (saved shape) */
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
import ProductsField from "../ProductsField";
import CategoryField from "../CategoryField";
import rootConfig from "../../root_config";
import localeTexts from "../../common/locale/en-us";
import { fakeId } from "../../../tests/helpers";

const mockInit = jest.fn();
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: () => mockInit() },
}));
jest.mock("axios", () => ({ __esModule: true, default: jest.fn() }));
const mockedAxios = axios as unknown as jest.Mock;

const appName = rootConfig.ecommerceEnv.REACT_APP_NAME;
let setData: jest.Mock;
let getData: jest.Mock;
const config = {
  configField1: "id-1",
  configField2: "v-1",
  page_count: "20",
  is_custom_json: false,
};

const initSdk = (cfg: any = config, saved: any = { data: [] }) => {
  setData = jest.fn();
  getData = jest.fn(() => saved);
  const sdk = {
    stack: { _data: { api_key: fakeId("stack") } },
    getConfig: jest.fn(async () => cfg),
    location: {
      CustomField: {
        field: { getData, setData },
        frame: { enableAutoResizing: jest.fn() },
      },
    },
    postRobot: {},
  };
  mockInit.mockResolvedValue(sdk);
};

const vendorReturns = (items: any[]) =>
  mockedAxios.mockResolvedValue({
    data: {
      data: items,
      meta: { pagination: { total: items.length, current_page: 1 } },
    },
  });

const addButton = () =>
  document.querySelector("button.add-product-btn") as HTMLButtonElement;
const lastSaved = () => setData.mock.calls[setData.mock.calls.length - 1][0];

beforeEach(() => {
  process.env.REACT_APP_API_URL = "https://api.test/fn";
  process.env.REACT_APP_UI_URL = "https://ui.test";
  mockedAxios.mockReset();
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe("custom field: empty and error states", () => {
  it("shows the empty state and an enabled Add button when nothing is selected", async () => {
    initSdk();
    render(<ProductsField />);
    await waitFor(() => expect(addButton()).not.toBeDisabled());
    expect(
      screen.getByText(localeTexts.customField.noItems.replace("$", "Products"))
    ).toBeInTheDocument();
    expect(lastSaved()).toEqual({ data: [], type: `${appName}_product` });
  });

  it("shows the invalid-credentials warning and disables Add when a config value is blank", async () => {
    initSdk({ ...config, configField2: "" });
    render(<ProductsField />);
    const msg = localeTexts.warnings.invalidCredentials.replace(
      "$",
      rootConfig.ecommerceEnv.APP_ENG_NAME
    );
    expect(await screen.findByText(msg)).toBeInTheDocument();
    expect(addButton()).toBeDisabled();
  });

  it("renders nothing and logs when the SDK fails to initialise", async () => {
    mockInit.mockRejectedValue(new Error("no sdk"));
    render(<ProductsField />);
    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        "appSdk initialization error",
        expect.any(Error)
      )
    );
    expect(addButton()).toBeNull();
  });

  it("shows the vendor failure as a warning when loading the saved items fails", async () => {
    initSdk(config, { data: [{ id: 1 }] });
    mockedAxios.mockRejectedValue({ response: { status: 500 } });
    render(<ProductsField />);
    const msg = localeTexts.warnings.invalidCredentials.replace(
      "$",
      rootConfig.ecommerceEnv.APP_ENG_NAME
    );
    expect(await screen.findByText(msg)).toBeInTheDocument();
  });
});

describe("custom field: saved data shape", () => {
  const items = [
    { id: 2, name: "Two", price: 2, sku: "s2", description: "d2" },
    { id: 1, name: "One", price: 1, sku: "s1", description: "d1" },
  ];

  it("loads the saved ids from the vendor, shows the count and keeps the editor's order", async () => {
    initSdk(config, { data: [{ id: 1 }, { id: 2 }] });
    vendorReturns(items);
    render(<ProductsField />);
    expect(await screen.findByText("2 Products")).toBeInTheDocument();
    expect(mockedAxios.mock.calls[0][0].url).toBe(
      "https://api.test/fn?query=product&id:in=1,2,"
    );
    await waitFor(() =>
      expect(lastSaved().data.map((i: any) => i.id)).toEqual([1, 2])
    );
    expect(lastSaved().type).toBe(`${appName}_product`);
  });

  it("with custom JSON on, saves only the chosen keys of each item", async () => {
    initSdk(
      {
        ...config,
        is_custom_json: true,
        custom_keys: [
          { label: "id", value: "id" },
          { label: "name", value: "name" },
        ],
      },
      { data: [{ id: 1 }, { id: 2 }] }
    );
    vendorReturns(items);
    render(<ProductsField />);
    await screen.findByText("2 Products");
    await waitFor(() =>
      expect(lastSaved().data).toEqual([
        { id: 1, name: "One" },
        { id: 2, name: "Two" },
      ])
    );
  });

  it("labels a single item in the singular", async () => {
    initSdk(config, { data: [{ id: 1 }] });
    vendorReturns([items[1]]);
    render(<ProductsField />);
    expect(await screen.findByText("1 Product")).toBeInTheDocument();
  });

  it("the category field saves whole items under the _category type", async () => {
    initSdk(config, { data: [{ id: 1 }] });
    vendorReturns([
      { id: 1, name: "Shoes", custom_url: { url: "/s" }, description: "d" },
    ]);
    render(<CategoryField />);
    await screen.findByText("1 Category");
    await waitFor(() =>
      expect(lastSaved()).toEqual({
        data: [expect.objectContaining({ id: 1, name: "Shoes" })],
        type: `${appName}_category`,
      })
    );
  });
});

describe("custom field: items the vendor returns without optional fields", () => {
  // BUG: TODO-BUG(ecomm-4) returnFormattedProduct falls back to `description: {}`, which Product.tsx passes to removeHTMLTags,
  // so a product with no description throws while rendering. No Jira key yet; raise under Epic MKT-19906.
  it.skip("renders a product that has no description", async () => {
    initSdk(config, { data: [{ id: 1 }] });
    vendorReturns([{ id: 1, name: "One", price: 1 }]);
    render(<ProductsField />);
    expect(await screen.findByText("1 Product")).toBeInTheDocument();
  });
});

describe("custom field: selector popup handshake", () => {
  const send = (data: any) =>
    act(() => {
      window.dispatchEvent(new MessageEvent("message", { data }));
    });

  it("opens the popup once at the selector URL and answers openedReady with config, ids and type", async () => {
    initSdk(config, { data: [{ id: 1 }] });
    vendorReturns([{ id: 1, name: "One", price: 1, description: "d" }]);
    const popup = {
      postMessage: jest.fn(),
      focus: jest.fn(),
      close: jest.fn(),
    };
    const open = jest.spyOn(window, "open").mockReturnValue(popup as any);
    render(<ProductsField />);
    await screen.findByText("1 Product");
    fireEvent.click(addButton());
    expect(open).toHaveBeenCalledWith(
      "https://ui.test/selector-page",
      `${rootConfig.ecommerceEnv.APP_ENG_NAME}Client`,
      expect.stringContaining("width=1440")
    );
    send("openedReady");
    expect(popup.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "init",
        config,
        selectedItems: [1],
        type: "product",
      }),
      window.location.origin
    );
  });

  it("an 'add' message from the popup loads and saves the chosen ids", async () => {
    initSdk();
    vendorReturns([{ id: 5, name: "Five", price: 5, description: "d" }]);
    const popup = {
      postMessage: jest.fn(),
      focus: jest.fn(),
      close: jest.fn(),
    };
    jest.spyOn(window, "open").mockReturnValue(popup as any);
    render(<ProductsField />);
    await waitFor(() => expect(addButton()).not.toBeDisabled());
    fireEvent.click(addButton());
    send({ message: "add", dataIds: [5], dataArr: [] });
    await screen.findByText("1 Product");
    await waitFor(() =>
      expect(lastSaved().data).toEqual([expect.objectContaining({ id: 5 })])
    );
  });

  it("a 'close' message forgets the popup so the next click opens a new one", async () => {
    initSdk();
    const popup = {
      postMessage: jest.fn(),
      focus: jest.fn(),
      close: jest.fn(),
    };
    const open = jest.spyOn(window, "open").mockReturnValue(popup as any);
    render(<ProductsField />);
    await waitFor(() => expect(addButton()).not.toBeDisabled());
    fireEvent.click(addButton());
    send({ message: "close" });
    fireEvent.click(addButton());
    expect(open).toHaveBeenCalledTimes(2);
  });

  // BUG: TODO-BUG(ecomm-3) the beforeunload listener is added once with the first render's `childWindow`, but handleClick sets the
  // variable of a later render, so the popup is never closed on unload. No Jira key yet; raise under Epic MKT-19906.
  it.skip("closes the popup when the page unloads", async () => {
    initSdk();
    const popup = {
      postMessage: jest.fn(),
      focus: jest.fn(),
      close: jest.fn(),
    };
    jest.spyOn(window, "open").mockReturnValue(popup as any);
    render(<ProductsField />);
    await waitFor(() => expect(addButton()).not.toBeDisabled());
    fireEvent.click(addButton());
    window.dispatchEvent(new Event("beforeunload"));
    expect(popup.close).toHaveBeenCalled();
  });

  // BUG: TODO-BUG(ecomm-2) CustomField/index.tsx handleMessage trusts any window message without checking event.origin
  // (security-gaps G7; no Jira key yet, raise under Epic MKT-19906).
  it.skip("ignores messages from another origin", async () => {
    initSdk();
    const popup = {
      postMessage: jest.fn(),
      focus: jest.fn(),
      close: jest.fn(),
    };
    jest.spyOn(window, "open").mockReturnValue(popup as any);
    render(<ProductsField />);
    await waitFor(() => expect(addButton()).not.toBeDisabled());
    fireEvent.click(addButton());
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: "openedReady",
          origin: "https://evil.test",
        })
      );
    });
    expect(popup.postMessage).not.toHaveBeenCalled();
  });
});
