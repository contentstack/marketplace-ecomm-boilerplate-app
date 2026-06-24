/*
  Ecommerce service layer.

  Data is fetched from the third-party (mock) ecommerce vendor API through
  Contentstack's App SDK — `appSdk.api()` — see ./ecomClient. Requests go to a
  rewrite path (e.g. "/ecom/products"); the app's Advanced Settings Rewrite
  forwards them to the real vendor URL and injects the API key server-side via
  the `Authorization: Bearer {{map.API_KEY}}` mapping. No data is mocked in the
  UI and no credentials are exposed to the browser.

  The vendor endpoints this layer relies on (served by ../../../ecommerce-mock-server):
    GET /products            ?id:in= ?sku:in= ?categories:in= ?q= ?limit= ?offset=
    GET /products/:id
    GET /catalogs            ?id:in= ?q= ?limit= ?offset=

  Note: getApiValidationForConfigPageKeys is intentionally NOT handled here.
*/
import config from "./config";
import { ecomGet } from "./ecomClient";

/* ----------------------------- query helpers ----------------------------- */

// Maps the incoming query object (skip/limit/searchParam) to the vendor's
// list params (offset/limit/q).
const toListParams = (query: any): Record<string, any> => {
  const params: Record<string, any> = {};
  if (query?.skip !== undefined && query?.skip !== "")
    params.offset = query.skip;
  if (query?.limit !== undefined && query?.limit !== "")
    params.limit = query.limit;
  // searchParam arrives as e.g. "keyword=towel"; forward just the term as `q`.
  if (query?.searchParam) {
    const term = String(query.searchParam).replace(/^keyword=/, "");
    if (term) params.q = term;
  }
  return params;
};

// Normalizes the vendor's `meta` block into the pagination shape
// rootConfig.getFormattedResponse expects.
const toPagination = (meta?: any) => ({
  totalResults: meta?.total,
  currentPage: meta?.limit ? Math.floor((meta?.offset || 0) / meta.limit) : 0,
});

// Normalizes a selected-ids value into the bare comma-separated list that most
// vendors' `id:in`-style filters expect. Accepts a CSV string ("77,80"), a
// JSON-array string ("[77,80]"), a real array, or a multi-config object whose
// leaf values are ids — and returns "77,80". Strict vendors reject other shapes
// (e.g. BigCommerce 422 "id param format is invalid"); the mock already gets
// CSV, so this is a no-op there.
const toIdCsv = (raw: any): string => {
  if (raw === undefined || raw === null || raw === "") return "";
  const collect = (val: any): any[] => {
    if (Array.isArray(val)) return val.flatMap(collect);
    if (typeof val === "string") {
      const s = val.trim();
      if (s.startsWith("[") || s.startsWith("{")) {
        try {
          return collect(JSON.parse(s));
        } catch {
          /* not JSON; treat as CSV below */
        }
      }
      return s.split(",").map((v) => v.trim());
    }
    if (val && typeof val === "object") return Object.values(val).flatMap(collect);
    return [val];
  };
  return collect(raw)
    .filter((v) => v !== "" && v !== undefined && v !== null)
    .join(",");
};

// Seams: remap each vendor's resource objects onto the field names the
// boilerplate expects — chiefly the UNIQUE_KEY id (root_config: `id`). Identity
// for the mock (it already keys on `id`). A vendor that returns a different id
// field (e.g. categories under `category_id`) maps it here, e.g.:
//   arr.map((c) => (c.id == null && c.category_id != null
//     ? { ...c, id: c.category_id } : c));
const normalizeProducts = (arr: any[]): any[] => arr;
const normalizeCategories = (arr: any[]): any[] => arr;

/*
  The `root_config` object mirrors the third-party access layer: each method
  issues a real request to the vendor API via appSdk.api().
*/
const root_config = {
  // Find a single product by its ID -> GET /products/:id
  getSingleProduct: async (productQuery: any) => {
    const productID = productQuery?.id ?? productQuery?.productID;
    const res = await ecomGet(`/products/${productID}`);
    return res?.product ?? {};
  },

  // Filter products by the selected IDs -> GET /products?id:in=
  getSelectedProductsById: async (productQuery: any) => {
    const res = await ecomGet("/products", {
      "id:in": toIdCsv(productQuery?.["id:in"]),
    });
    return normalizeProducts(res?.products ?? []);
  },

  // Filter categories by the selected IDs -> GET /catalogs?id:in=
  getSelectedCategoriesById: async (categoryQuery: any) => {
    const res = await ecomGet("/catalogs", {
      "id:in": toIdCsv(categoryQuery?.["id:in"]),
    });
    return normalizeCategories(res?.catalogs ?? []);
  },

  // Combined products + categories by IDs (used when
  // getSeparateProductsAndCategories is false). Routed to the matching
  // single-resource endpoint based on the query type.
  getSelectedProductsandCategories: async (data: any) => {
    const isCategory = data?.query === "category";
    const path = isCategory ? "/catalogs" : "/products";
    const params: Record<string, any> = {};
    if (data?.["id:in"]) params["id:in"] = toIdCsv(data["id:in"]);
    if (data?.["sku:in"]) params["sku:in"] = data["sku:in"];
    if (data?.limit) params.limit = data.limit;
    const res = await ecomGet(path, params);
    return isCategory
      ? normalizeCategories(res?.catalogs ?? [])
      : normalizeProducts(res?.products ?? []);
  },

  // All products -> GET /products
  getAllProducts: async (productQuery?: any) => {
    const res = await ecomGet("/products", toListParams(productQuery));
    return {
      products: normalizeProducts(res?.products ?? []),
      pagination: toPagination(res?.meta),
    };
  },

  // All categories -> GET /catalogs
  getAllCategories: async (categoryQuery?: any) => {
    const res = await ecomGet("/catalogs", toListParams(categoryQuery));
    return {
      catalogs: normalizeCategories(res?.catalogs ?? []),
      pagination: toPagination(res?.meta),
    };
  },

  // Combined products + categories (used when
  // getSeparateProductsAndCategories is false).
  getAllProductsAndCategories: async (data: any) => {
    const isCategory = data?.query === "category";
    const path = isCategory ? "/catalogs" : "/products";
    const res = await ecomGet(path, toListParams(data));
    return isCategory
      ? {
          catalogs: normalizeCategories(res?.catalogs ?? []),
          pagination: toPagination(res?.meta),
        }
      : {
          products: normalizeProducts(res?.products ?? []),
          pagination: toPagination(res?.meta),
        };
  },

  // Filter products by category -> GET /products?categories:in=
  filterProductsByCategory: async (data: any) => {
    const res = await ecomGet("/products", {
      "categories:in": toIdCsv(data?.["categories:in"]),
    });
    return {
      products: normalizeProducts(res?.products ?? []),
      pagination: toPagination(res?.meta),
    };
  },
};

/* ------------------------------------------------------------------ */
/* Handler-level functions (the public service API).                  */
/* ------------------------------------------------------------------ */

/**
 * Retrieves a particular product using its ID.
 */
const getProductByID = async (productQuery: any, _productPayload?: any) =>
  root_config.getSingleProduct(productQuery);

/**
 * Fetches all products and categories based on the provided parameters.
 */
const getAllProductsAndCategories = async (
  productCategoryQuery: any,
  _productCategoryPayload?: any
) => {
  if (config.ENDPOINTS_CONFIG.getSeparateProductsAndCategories) {
    return productCategoryQuery?.query === "product"
      ? root_config.getAllProducts(productCategoryQuery)
      : root_config.getAllCategories(productCategoryQuery);
  }
  return root_config.getAllProductsAndCategories(productCategoryQuery);
};

/**
 * Retrieves selected products and categories based on the provided parameters.
 *
 * @returns The selected products/categories keyed by their URI endpoint
 *          (e.g. `{ products: [...] }` or `{ catalogs: [...] }`).
 */
const getSelectedProductsAndCategories = async (
  productCategoryQuery: any,
  _productCategoryPayload?: any
) => {
  let response: any;
  if (config.ENDPOINTS_CONFIG.getSeparateProductsAndCategories) {
    response =      productCategoryQuery?.query === "product"
        ? await root_config.getSelectedProductsById(productCategoryQuery)
        : await root_config.getSelectedCategoriesById(productCategoryQuery);
  } else {
    response = await root_config.getSelectedProductsandCategories(
      productCategoryQuery
    );
  }

  // Key the result by the STABLE name getFormattedResponse reads
  // (response.data.products || response.data.catalogs) — NOT URI_ENDPOINTS[query],
  // which becomes the endpoint path (e.g. "catalog/products") for vendors whose
  // paths aren't literally "products"/"catalogs", silently breaking rendering.
  const resultKey = productCategoryQuery?.query === "category" ? "catalogs" : "products";
  return { [resultKey]: response };
};

/**
 * Filters products based on the provided categories.
 */
const filterByCategory = async (data: any, _key?: any) =>
  root_config.filterProductsByCategory(data);

export default getSelectedProductsAndCategories;
export {
  getProductByID,
  getAllProductsAndCategories,
  getSelectedProductsAndCategories,
  filterByCategory,
};
