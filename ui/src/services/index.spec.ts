/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
/* Spec: wiki marketplace-apps/ecomm-boilerplate/flows/product-selection.md "Failure branches" */
import axios from "axios";
import { request, requestCategories, getSelectedIDs, filter, search } from ".";
import rootConfig from "../root_config";
import localeTexts from "../common/locale/en-us";

jest.mock("axios");
const mockedAxios = axios as unknown as jest.Mock;

const ok = {
  data: {
    data: [{ id: 1 }],
    meta: { pagination: { total: 1, current_page: 1 } },
  },
};

beforeEach(() => {
  process.env.REACT_APP_API_URL = "https://api.test/fn";
  jest.spyOn(console, "error").mockImplementation(() => {});
  mockedAxios.mockReset();
});
afterEach(() => jest.restoreAllMocks());

describe("services", () => {
  it("POSTs the whole config to the API with query, page and limit", async () => {
    mockedAxios.mockResolvedValue(ok);
    const cfg = { page_count: "20" };
    const res = await request(cfg, "product", 3);
    expect(res).toEqual({
      error: false,
      data: { items: [{ id: 1 }], meta: { total: 1, current_page: 1 } },
    });
    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://api.test/fn?query=product&page=3&limit=20",
        method: "POST",
        data: cfg,
      })
    );
  });

  it("defaults to page 1", async () => {
    mockedAxios.mockResolvedValue(ok);
    await request({ page_count: 5 }, "category");
    expect(mockedAxios.mock.calls[0][0].url).toContain("page=1&limit=5");
  });

  it("requests all categories", async () => {
    mockedAxios.mockResolvedValue(ok);
    await requestCategories({});
    expect(mockedAxios.mock.calls[0][0].url).toBe(
      "https://api.test/fn?query=category"
    );
  });

  it("loads selected ids as a comma list, and nothing for an empty selection", async () => {
    mockedAxios.mockResolvedValue(ok);
    await getSelectedIDs({}, "product", [1, 2]);
    expect(mockedAxios.mock.calls[0][0].url).toBe(
      "https://api.test/fn?query=product&id:in=1,2,"
    );
    expect(await getSelectedIDs({}, "product", [])).toBeNull();
    expect(await getSelectedIDs({}, "product", undefined)).toBeNull();
  });

  it("filters by category ids, and nothing for an empty selection", async () => {
    mockedAxios.mockResolvedValue(ok);
    await filter({ c: 1 }, "product", [4]);
    expect(mockedAxios.mock.calls[0][0].url).toContain("categories:in=4,");
    expect(await filter({}, "product", [])).toBeNull();
  });

  it("searches with the keyword", async () => {
    mockedAxios.mockResolvedValue(ok);
    await search({ type: "product" }, "shoe", 1, 10);
    expect(mockedAxios.mock.calls[0][0].url).toContain(
      "searchParam=keyword=shoe"
    );
  });

  it("maps a 500 to the invalid-credentials text for the app name", async () => {
    mockedAxios.mockRejectedValue({ response: { status: 500 } });
    const res = await request({}, "product");
    expect(res).toEqual({
      error: true,
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    });
  });

  it("passes the vendor's message through on 429", async () => {
    mockedAxios.mockRejectedValue({
      response: { status: 429, data: "slow down" },
    });
    expect(await request({}, "product")).toEqual({
      error: true,
      data: "slow down",
    });
  });

  it("falls back to the generic text for any other failure", async () => {
    mockedAxios.mockRejectedValue(new Error("net"));
    expect(await request({}, "product")).toEqual({
      error: true,
      data: localeTexts.warnings.somethingWentWrong,
    });
  });
});
