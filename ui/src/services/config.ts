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
  // Contentstack Advanced Settings wiring for appSdk.api(). This is the main
  // per-vendor adaptation surface for transport/auth — see INTEGRATION_GUIDE.md.
  //  - REWRITE_BASE: the path prefix the app calls. A Rewrite in the app's
  //    Advanced Settings maps "/ecom/*" to the real vendor API.
  //  - STORE_PATH_TEMPLATE: per-tenant path segment prepended to every request
  //    path (e.g. "/stores/{store_id}/v3"). Any "{...}" placeholder is filled at
  //    request time with the tenant id read from client config (see
  //    TENANT_CONFIG_KEY). Leave "" if the vendor has no per-tenant path — the
  //    mock vendor doesn't, so this is empty by default.
  //  - TENANT_CONFIG_KEY: name of the NON-SENSITIVE client-config field
  //    (saveInConfig:true) holding the tenant id that fills STORE_PATH_TEMPLATE.
  //    Read in-browser via appSdk.getConfig(). "" when no tenant path is needed.
  //  - AUTH_HEADER_NAME: the HTTP header the vendor authenticates with
  //    ("Authorization" for Bearer schemes, "X-Auth-Token" / "X-API-Key" / etc.
  //    for others).
  //  - AUTH_HEADER_TEMPLATE: the header value, sent verbatim. The "{{map.*}}"
  //    placeholder is resolved server-side by an Advanced Settings mapping (->
  //    server config), so the real secret never reaches the browser.
  ECOM_API: {
    REWRITE_BASE: "/ecom",
    STORE_PATH_TEMPLATE: "",
    TENANT_CONFIG_KEY: "",
    AUTH_HEADER_NAME: "Authorization",
    AUTH_HEADER_TEMPLATE: "Bearer {{map.API_KEY}}",
  },
};

export default config;
