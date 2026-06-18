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
      "id:in": productQuery?.["id:in"],
    });
    return res?.products ?? [];
  },

  // Filter categories by the selected IDs -> GET /catalogs?id:in=
  getSelectedCategoriesById: async (categoryQuery: any) => {
    const res = await ecomGet("/catalogs", {
      "id:in": categoryQuery?.["id:in"],
    });
    return res?.catalogs ?? [];
  },

  // Combined products + categories by IDs (used when
  // getSeparateProductsAndCategories is false). Routed to the matching
  // single-resource endpoint based on the query type.
  getSelectedProductsandCategories: async (data: any) => {
    const isCategory = data?.query === "category";
    const path = isCategory ? "/catalogs" : "/products";
    const params: Record<string, any> = {};
    if (data?.["id:in"]) params["id:in"] = data["id:in"];
    if (data?.["sku:in"]) params["sku:in"] = data["sku:in"];
    if (data?.limit) params.limit = data.limit;
    const res = await ecomGet(path, params);
    return isCategory ? res?.catalogs ?? [] : res?.products ?? [];
  },

  // All products -> GET /products
  getAllProducts: async (productQuery?: any) => {
    const res = await ecomGet("/products", toListParams(productQuery));
    return {
      products: res?.products ?? [],
      pagination: toPagination(res?.meta),
    };
  },

  // All categories -> GET /catalogs
  getAllCategories: async (categoryQuery?: any) => {
    const res = await ecomGet("/catalogs", toListParams(categoryQuery));
    return {
      catalogs: res?.catalogs ?? [],
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
      ? { catalogs: res?.catalogs ?? [], pagination: toPagination(res?.meta) }
      : { products: res?.products ?? [], pagination: toPagination(res?.meta) };
  },

  // Filter products by category -> GET /products?categories:in=
  filterProductsByCategory: async (data: any) => {
    const res = await ecomGet("/products", {
      "categories:in": data?.["categories:in"],
    });
    return {
      products: res?.products ?? [],
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

  return { [config.URI_ENDPOINTS[productCategoryQuery?.query]]: response };
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
