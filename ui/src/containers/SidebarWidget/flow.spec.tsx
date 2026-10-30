/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
/* Spec: wiki marketplace-apps/ecomm-boilerplate/features.md (Sidebar widget row) */
import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import axios from "axios";
import SidebarWidget from ".";
import localeTexts from "../../common/locale/en-us";
import rootConfig from "../../root_config";

const mockInit = jest.fn();
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: () => mockInit() },
}));
jest.mock("axios", () => ({ __esModule: true, default: jest.fn() }));
const mockedAxios = axios as unknown as jest.Mock;

const appName = rootConfig.ecommerceEnv.REACT_APP_NAME;
const config = { configField1: "a", configField2: "b", page_count: "20" };
const ctSchema = [
  { uid: "prods", display_name: "Featured products" },
  { uid: "more", display_name: "More products" },
];

const initSdk = (entry: any, cfg: any = config) =>
  mockInit.mockResolvedValue({
    getConfig: jest.fn(async () => cfg),
    stack: {
      getContentType: jest.fn(async () => ({
        content_type: { schema: ctSchema },
      })),
    },
    location: {
      SidebarWidget: {
        entry: { content_type: { uid: "ct" }, getData: jest.fn(() => entry) },
      },
    },
  });

const vendorReturns = (items: any[]) =>
  mockedAxios.mockResolvedValue({
    data: {
      data: items,
      meta: { pagination: { total: items.length, current_page: 1 } },
    },
  });

beforeEach(() => {
  process.env.REACT_APP_API_URL = "https://api.test/fn";
  mockedAxios.mockReset();
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe("sidebar widget", () => {
  it("says no products are selected when the entry has no app field", async () => {
    initSdk({ title: { type: "text" } });
    render(<SidebarWidget />);
    expect(
      await screen.findByText(localeTexts.sidebarWidget.noProducts)
    ).toBeInTheDocument();
  });

  it("shows the first selected product's details from the vendor", async () => {
    initSdk({
      prods: { type: `${appName}_product`, data: [{ id: 1, name: "Boot" }] },
    });
    vendorReturns([
      {
        id: 1,
        name: "Boot",
        sku: "sku-1",
        price: 10,
        description: "<i>warm</i>",
        width: 2,
        height: 3,
      },
    ]);
    render(<SidebarWidget />);
    expect(await screen.findByText("Boot")).toBeInTheDocument();
    expect(screen.getByText("sku-1")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByText("warm")).toBeInTheDocument();
    expect(mockedAxios.mock.calls[0][0].url).toBe(
      "https://api.test/fn?query=product&id:in=1,"
    );
  });

  it("offers a product picker when several products are selected", async () => {
    initSdk({
      prods: {
        type: `${appName}_product`,
        data: [
          { id: 1, name: "Boot" },
          { id: 2, name: "Shoe" },
        ],
      },
    });
    vendorReturns([{ id: 1, name: "Boot", price: 1, description: "d" }]);
    render(<SidebarWidget />);
    await waitFor(() => expect(mockedAxios).toHaveBeenCalled());
    expect(
      await screen.findByText(localeTexts.sidebarWidget.dropdownLabels.products)
    ).toBeInTheDocument();
  });

  it("offers a field picker when the entry has several app fields", async () => {
    initSdk({
      prods: { type: `${appName}_product`, data: [{ id: 1, name: "Boot" }] },
      more: { type: `${appName}_product`, data: [{ id: 2, name: "Shoe" }] },
    });
    vendorReturns([{ id: 1, name: "Boot", price: 1, description: "d" }]);
    render(<SidebarWidget />);
    expect(await screen.findByText("Featured products")).toBeInTheDocument();
  });

  it("shows the invalid-credentials warning when a config value is blank", async () => {
    initSdk({}, { ...config, configField2: "" });
    render(<SidebarWidget />);
    const msg = localeTexts.warnings.invalidCredentials.replace(
      "$",
      rootConfig.ecommerceEnv.APP_ENG_NAME
    );
    expect(await screen.findByText(msg)).toBeInTheDocument();
  });

  it("shows the warning when the vendor call fails", async () => {
    initSdk({
      prods: { type: `${appName}_product`, data: [{ id: 1, name: "Boot" }] },
    });
    mockedAxios.mockRejectedValue({ response: { status: 500 } });
    render(<SidebarWidget />);
    const msg = localeTexts.warnings.invalidCredentials.replace(
      "$",
      rootConfig.ecommerceEnv.APP_ENG_NAME
    );
    expect(await screen.findByText(msg)).toBeInTheDocument();
  });

  it("logs the locale error when the SDK fails to initialise", async () => {
    mockInit.mockRejectedValue(new Error("no sdk"));
    render(<SidebarWidget />);
    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        localeTexts.sidebarWidget.appSdkErr,
        expect.any(Error)
      )
    );
  });
});
