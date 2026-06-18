/*
  Migrated from api/root_config/config.js.

  Configuration used by the ecommerce service functions. The values below are
  examples — update them for your commerce platform. Do not change the keys.
*/

const config = {
  // Add the URL of your commerce app API where $ is a value added through the Users response.
  API_BASE_URL: "https://my.example.com/$/v3/",
  URI_ENDPOINTS: {
    product: "products",
    category: "catalogs",
  } as Record<string, string>,
  SEARCH_URL_PARAMS: "/search",
  FIELDS_URL: "fields=FULL",
  SENSITIVE_CONFIG_KEYS: ["access_token", "project_key"],
  ENDPOINTS_CONFIG: {
    getSeparateProductsAndCategories: true,
  },
  // Contentstack Advanced Settings wiring for appSdk.api().
  //  - REWRITE_BASE: the path prefix the app calls. A Rewrite in the app's
  //    Advanced Settings maps "/ecom/*" to the (tunneled) mock vendor API.
  //  - AUTH_HEADER_TEMPLATE: sent verbatim as the Authorization header.
  //    "{{map.API_KEY}}" is resolved server-side by Advanced Settings (via the
  //    API_KEY mapping -> stored variable), so the real key never reaches the
  //    browser.
  ECOM_API: {
    REWRITE_BASE: "/ecom",
    AUTH_HEADER_TEMPLATE: "Bearer {{map.API_KEY}}",
  },
};

export default config;
