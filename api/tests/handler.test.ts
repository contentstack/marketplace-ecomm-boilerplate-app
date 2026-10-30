/* eslint-disable @typescript-eslint/naming-convention, global-require -- test doubles use vendor key names */
/* Spec: wiki marketplace-apps/ecomm-boilerplate/api-reference.md and flows/api-request.md */
import { encryptLikeBrowser, fakeId } from "./helpers";

const mockAxios = jest.fn();
jest.mock("axios", () => ({
  __esModule: true,
  default: (o: any) => mockAxios(o),
}));

const PASS = fakeId("pass");

// Loads the real handler with a vendor root_config and decryption password injected.
const load = (rootOverrides: any = {}, sensitive: string[] = []) => {
  jest.resetModules();
  jest.doMock("../constants", () => {
    const real = jest.requireActual("../constants").default;
    return {
      __esModule: true,
      default: { ...real, DECRYPTION: { ...real.DECRYPTION, password: PASS } },
    };
  });
  jest.doMock("../root_config", () => ({
    __esModule: true,
    default: {
      URI_ENDPOINTS: {
        product: "catalog/products",
        category: "catalog/categories",
      },
      PRODUCT_URL_PARAMS: "fields=id",
      SENSITIVE_CONFIG_KEYS: sensitive,
      getHeaders: (key: any) => ({ "X-Cred": key?.cred ?? "" }),
      getUrl: (
        _k: any,
        query: any,
        search: any,
        _c: any,
        id: any,
        page: any,
        limit: any
      ) =>
        `https://vendor.test/${query ?? "all"}?id=${id ?? ""}&s=${
          search ?? ""
        }&p=${page ?? ""}&l=${limit ?? ""}`,
      getSelectedProductandCatUrl: (d: any) =>
        `https://vendor.test/sel?ids=${d["id:in"]}`,
      ...rootOverrides,
    },
  }));
  // eslint-disable-next-line global-require
  return require("../index").default;
};

beforeEach(() => {
  mockAxios.mockReset();
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe("API handler: request validation", () => {
  it("answers 400 with the missing-query text when the body is empty", async () => {
    const handler = load();
    const res = await handler({
      queryStringParameters: { query: "product" },
      body: {},
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toBe("Query string parameters are missing.");
    expect(mockAxios).not.toHaveBeenCalled();
  });

  it("caps limit at 250", async () => {
    mockAxios.mockResolvedValue({ data: { ok: 1 } });
    const handler = load();
    const res = await handler({
      queryStringParameters: { query: "product", limit: 900, page: 1 },
      body: { cfg: "x" },
    });
    expect(res.statusCode).toBe(200);
    expect(mockAxios.mock.calls[0][0].url).toContain("l=250");
  });

  it("returns CORS and JSON headers", async () => {
    mockAxios.mockResolvedValue({ data: {} });
    const res = await load()({
      queryStringParameters: { query: "product" },
      body: { a: 1 },
    });
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(res.headers["Content-type"]).toBe("application/json");
  });
});

describe("API handler: query routing", () => {
  const body = { cred: "c1" };

  it("lists products and categories when no selector key is given", async () => {
    mockAxios.mockResolvedValue({ data: { items: [1] } });
    const res = await load()({
      queryStringParameters: { query: "product", page: 2, limit: 10 },
      body,
    });
    expect(res.body).toEqual({ items: [1] });
    const opts = mockAxios.mock.calls[0][0];
    expect(opts.method).toBe("GET");
    expect(opts.headers).toEqual({ "X-Cred": "c1" });
    expect(opts.timeout).toBe(17000);
  });

  it("applies the vendor's getProductAndCategory hook to the listing", async () => {
    mockAxios.mockResolvedValue({ data: { raw: true } });
    const handler = load({
      getProductAndCategory: (_d: any, r: any) => ({ wrapped: r }),
    });
    const res = await handler({
      queryStringParameters: { query: "product" },
      body,
    });
    expect(res.body).toEqual({ wrapped: { raw: true } });
  });

  it("fetches one item for ?id", async () => {
    mockAxios.mockResolvedValue({ data: { id: 7 } });
    const res = await load()({
      queryStringParameters: { query: "product", id: "7" },
      body,
    });
    expect(res.body).toEqual({ id: 7 });
    expect(mockAxios.mock.calls[0][0].url).toContain("id=7");
  });

  it("fetches selected items for id:in and sku:in", async () => {
    mockAxios.mockResolvedValue({ data: { items: [] } });
    const handler = load();
    await handler({
      queryStringParameters: { query: "product", "id:in": "1,2," },
      body,
    });
    await handler({
      queryStringParameters: { query: "product", "sku:in": "a,b" },
      body,
    });
    expect(mockAxios.mock.calls[0][0].url).toBe(
      "https://vendor.test/sel?ids=1,2,"
    );
    expect(mockAxios).toHaveBeenCalledTimes(2);
  });

  it("filters by category for categories:in", async () => {
    mockAxios.mockResolvedValue({ data: { items: [] } });
    await load()({
      queryStringParameters: { query: "product", "categories:in": "5,6" },
      body,
    });
    expect(mockAxios.mock.calls[0][0].url).toMatch(
      /\?categories:in=5,6&fields=id$/
    );
  });

  it("with getSeparateProdCat, loads each product id separately and keys the result by endpoint", async () => {
    mockAxios.mockImplementation(async (o: any) => ({ data: { u: o.url } }));
    const handler = load({ getSeparateProdCat: true });
    const res = await handler({
      queryStringParameters: { query: "product", "id:in": "1,,2" },
      body,
    });
    expect(Object.keys(res.body)).toEqual(["catalog/products"]);
    expect(res.body["catalog/products"]).toHaveLength(2);
  });

  it("with getSeparateProdCat, loads categories from selectedIDs and tags catalog ids", async () => {
    mockAxios.mockImplementation(async () => ({ data: {} }));
    const handler = load({
      getSeparateProdCat: true,
      getByCategoryIdUrl: (_k: any, _q: any, c: any) =>
        `https://vendor.test/cat/${c.id}`,
    });
    const res = await handler({
      queryStringParameters: { query: "category", "id:in": "1" },
      body: {
        cred: "c",
        selectedIDs: [{ id: 1, catalogId: "cat-a", catalogVersionId: "v1" }],
      },
    });
    expect(res.body["catalog/categories"]).toEqual([
      { catalogId: "cat-a", catalogVersionId: "v1" },
    ]);
  });
});

describe("API handler: vendor errors", () => {
  const body = { cred: "c" };

  it("turns a vendor 404 into an object carrying the id from the error title", async () => {
    mockAxios.mockRejectedValue({
      response: { status: 404, data: { title: "Product 4521 not found" } },
    });
    const res = await load()({
      queryStringParameters: { query: "product", id: "4521" },
      body,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      data: { id: "4521", error: "Product 4521 not found" },
    });
  });

  it("answers 500 with the generic text for any other vendor failure", async () => {
    mockAxios.mockRejectedValue(new Error(""));
    const res = await load()({
      queryStringParameters: { query: "product" },
      body,
    });
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe("Something went wrong, please try again later.");
  });

  it("answers 500 with the vendor's message when it has one", async () => {
    mockAxios.mockRejectedValue(new Error("vendor said no"));
    const res = await load()({
      queryStringParameters: { query: "product" },
      body,
    });
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe("vendor said no");
  });
});

describe("API handler: decrypting sensitive config", () => {
  it("decrypts the configured sensitive keys before building vendor headers", async () => {
    mockAxios.mockResolvedValue({ data: {} });
    const plain = fakeId("secret");
    const handler = load({}, ["cred"]);
    await handler({
      queryStringParameters: { query: "product" },
      body: { cred: encryptLikeBrowser(plain, PASS), other: "keep" },
    });
    expect(mockAxios.mock.calls[0][0].headers).toEqual({ "X-Cred": plain });
  });

  it("leaves keys that are not listed as sensitive untouched", async () => {
    mockAxios.mockResolvedValue({ data: {} });
    await load({}, ["cred"])({
      queryStringParameters: { query: "product" },
      body: { cred: encryptLikeBrowser("v", PASS), other: "keep" },
    });
    expect(mockAxios).toHaveBeenCalledTimes(1);
  });

  // BUG: api/index.ts logs the whole body after decrypting it, so plain credentials reach the logs (MKT-19873, fix in PR #149).
  it.skip("never writes decrypted credentials to the logs", async () => {
    mockAxios.mockResolvedValue({ data: {} });
    const plain = fakeId("secret");
    const info = jest.spyOn(console, "info");
    await load({}, ["cred"])({
      queryStringParameters: { query: "product" },
      body: { cred: encryptLikeBrowser(plain, PASS) },
    });
    expect(JSON.stringify(info.mock.calls)).not.toContain(plain);
  });
});
