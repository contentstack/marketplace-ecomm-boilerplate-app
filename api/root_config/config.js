export default {
  API_BASE_URL: "https://my.example.com/$/v3/", // Add the URL of your commerce app API where $ is a value added through Users response
  URI_ENDPOINTS: {
    product: "products",
    category: "catalogs",
  },
  SEARCH_URL_PARAMS: "/search",
  FIELDS_URL: "fields=FULL",
  SENSITIVE_CONFIG_KEYS: ["access_token", "project_key"],
  ENDPOINTS_CONFIG: {
    getSeparateProductsAndCategories: true,
  },
};
