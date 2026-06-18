/*
  Configuration for the mock third-party ecommerce vendor API.

  This Express app no longer acts as the marketplace app's backend proxy.
  Instead it *pretends to be* the external ecommerce platform, exposing
  REST endpoints that return product/category data in the shapes a real
  vendor would. The frontend (and later Contentstack Advanced Settings
  Rewrites) point at this server instead of the real ecommerce API.
*/
export default {
  // Port the mock vendor listens on. Kept at 8080 to match the dev tunnel,
  // README and scripts/src/dev-setup.sh. Override with the PORT env var.
  PORT: process.env.PORT || 8080,

  // Friendly name surfaced on the API index route.
  VENDOR_NAME: "Mock Ecommerce Vendor API",

  // API key required on every product/catalog request (Authorization: Bearer).
  // Sourced from the env so it can be rotated without touching code. This is the
  // value Contentstack Advanced Settings stores as a Variable and injects via
  // the {{map.API_KEY}} mapping in the rewrite's headers.
  API_KEY: process.env.ECOM_API_KEY || "",

  // Default pagination applied when the caller does not pass a limit.
  // null => return everything (the mock dataset is small).
  DEFAULT_LIMIT: null,

  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },
};
