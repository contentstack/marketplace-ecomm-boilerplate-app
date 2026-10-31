/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
/* Spec: wiki marketplace-apps/ecomm-boilerplate (how-to-copy, ui-locations, security-gaps G6) */
import axios from "axios";
import { jwtVerify, importSPKI } from "jose";
import rootConfig from ".";
import { fakeId } from "../../tests/helpers";

jest.mock("axios");
const mockedGet = axios.get as jest.Mock;

describe("verifyAppSigning", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it("rejects a missing token without calling Contentstack", async () => {
    expect(await rootConfig.verifyAppSigning(null)).toBe(false);
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it("accepts a token the Contentstack public key verifies", async () => {
    mockedGet.mockResolvedValue({ data: { "signing-key": "pem" } });
    (importSPKI as jest.Mock).mockResolvedValue("key");
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { app_uid: "a" } });
    expect(await rootConfig.verifyAppSigning(fakeId("jwt"))).toBe(true);
    expect(mockedGet).toHaveBeenCalledWith(
      "https://app.contentstack.com/.well-known/public-keys.json"
    );
    expect(importSPKI).toHaveBeenCalledWith("pem", "RS256");
  });

  it("rejects a token that fails verification", async () => {
    mockedGet.mockResolvedValue({ data: { "signing-key": "pem" } });
    (importSPKI as jest.Mock).mockResolvedValue("key");
    (jwtVerify as jest.Mock).mockRejectedValue(new Error("bad"));
    expect(await rootConfig.verifyAppSigning(fakeId("jwt"))).toBe(false);
  });

  it("rejects when the public key cannot be fetched", async () => {
    mockedGet.mockRejectedValue(new Error("down"));
    expect(await rootConfig.verifyAppSigning(fakeId("jwt"))).toBe(false);
  });
});

describe("template defaults", () => {
  it("config screen offers a client id and a sensitive secret field, both saved in config", () => {
    const fields = rootConfig.configureConfigScreen();
    expect(Object.keys(fields)).toEqual(["configField1", "configField2"]);
    expect(fields.configField1).toMatchObject({
      type: "textInputFields",
      saveInConfig: true,
      isSensitive: false,
    });
    expect(fields.configField2).toMatchObject({
      type: "textInputFields",
      saveInConfig: true,
      isSensitive: true,
    });
  });

  it("opens the selector only when the client id is set", () => {
    expect(rootConfig.openSelectorPage({ configField1: "x" })).toBe(true);
    expect(rootConfig.openSelectorPage({})).toBe(false);
  });

  it("maps the vendor response to items and paging meta", () => {
    expect(
      rootConfig.returnUrl({
        data: {
          data: [1, 2],
          meta: { pagination: { total: 9, current_page: 3 } },
        },
      })
    ).toEqual({ items: [1, 2], meta: { total: 9, current_page: 3 } });
    expect(rootConfig.returnUrl({})).toEqual({
      items: undefined,
      meta: { total: undefined, current_page: undefined },
    });
  });

  it("builds the selected-categories request", () => {
    process.env.REACT_APP_API_URL = "https://api.test/fn";
    const cfg = { page_count: "20" };
    expect(
      rootConfig.getSelectedCategoriesUrl(cfg, "category", [1, 2])
    ).toEqual({
      apiUrl: "https://api.test/fn?query=category&categories:in=1,2,",
      requestData: { config: cfg },
    });
  });

  it("builds the search request for products, categories and a category filter", () => {
    process.env.REACT_APP_API_URL = "https://api.test/fn";
    const cfg = { type: "product" };
    expect(
      rootConfig.generateSearchApiUrlAndData(cfg, "shoe", 2, 20, [])
    ).toEqual({
      apiUrl:
        "https://api.test/fn?query=product&searchParam=keyword=shoe&page=2&limit=20",
      requestData: cfg,
    });
    const withCats = rootConfig.generateSearchApiUrlAndData(
      { type: "category" },
      "k",
      1,
      5,
      [{ value: "a" }, { value: "b" }]
    );
    expect(withCats.apiUrl).toBe(
      "https://api.test/fn?query=category&searchParam=keyword=k&page=1&limit=5&searchCategories=a,b"
    );
  });

  it("formats a product and a category for the field", () => {
    expect(
      rootConfig.returnFormattedProduct({
        id: 1,
        name: "n",
        price: 12.5,
        sku: "s",
        primary_image: { url_thumbnail: "u" },
      })
    ).toMatchObject({
      id: 1,
      name: "n",
      image: "u",
      sku: "s",
      price: "$12.50",
    });
    expect(rootConfig.returnFormattedProduct({})).toMatchObject({
      id: "",
      name: "",
      image: "",
      sku: "",
    });
    expect(
      rootConfig.returnFormattedCategory({
        id: 2,
        name: "c",
        custom_url: { url: "/c" },
      })
    ).toEqual({
      id: 2,
      name: "c",
      customUrl: "/c",
      description: "Not Available",
    });
    expect(rootConfig.returnFormattedCategory({})).toMatchObject({
      id: "",
      customUrl: "",
    });
  });

  it("builds opener links for products and categories", () => {
    expect(rootConfig.getOpenerLink({ id: 7 }, {}, "product")).toMatch(
      /edit\/7$/
    );
    expect(rootConfig.getOpenerLink({ id: 7 }, {}, "category")).toMatch(
      /categories\/7\/edit$/
    );
  });

  // BUG: TODO-BUG(ecomm-5) SelectorPage/index.tsx passes `data?.id` (a bare id) but getOpenerLink reads `data?.id` again, so the
  // hover "open in app" link ends in /undefined. No Jira key yet; raise under Epic MKT-19906.
  it.skip("builds a working link from the id the selector passes", () => {
    expect(rootConfig.getOpenerLink(7, {}, "product")).toMatch(/edit\/7$/);
  });

  it("arranges items in the order of the selected ids", () => {
    const items = [{ id: 2 }, { id: 1 }, { id: 3 }];
    expect(rootConfig.arrangeList([1, 2], items)).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
    expect(rootConfig.arrangeList()).toEqual([]);
  });

  it("lists custom keys the editor can save", () => {
    const keys = rootConfig.getCustomKeys();
    expect(keys.map((k: any) => k.value)).toContain("product_id");
    keys.forEach((k: any) => expect(k.searchLabel).toBe(k.value));
  });

  it("shows three sidebar rows", () => {
    expect(
      rootConfig
        .getSidebarData({ width: 2, height: 3 })
        .map((r: any) => r.title)
    ).toEqual(["Dimensions", "Height", "Width"]);
  });

  it("defines selector columns for products and categories with working accessors", () => {
    const p = rootConfig.getProductSelectorColumns();
    expect(p.map((c: any) => c.Header)).toEqual([
      "ID",
      "Image",
      "SKU",
      "Product Name",
      "Price",
      "Description",
    ]);
    const prod = {
      primary_image: { url_tiny: "u" },
      price: 5,
      description: "<b>d</b>",
    };
    p.filter((c: any) => typeof c.accessor === "function").forEach((c: any) =>
      expect(c.accessor(prod)).toBeTruthy()
    );
    const c = rootConfig.categorySelectorColumns();
    expect(c.map((x: any) => x.Header)).toEqual([
      "ID",
      "Image",
      "Category Name",
      "Custom URL",
      "Description",
    ]);
    c.filter((x: any) => typeof x.accessor === "function").forEach((x: any) =>
      expect(x.accessor(prod)).toBeTruthy()
    );
  });

  it("names the app for the field type", () => {
    expect(rootConfig.ecommerceEnv.UNIQUE_KEY).toEqual({
      product: "id",
      category: "id",
    });
  });
});
