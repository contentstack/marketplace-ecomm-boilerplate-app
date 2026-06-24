/*
  Thin client for the ecommerce vendor API, called through Contentstack's
  App SDK (`appSdk.api`).

  Why a singleton: `ecommerce.ts` is a plain module with no access to React
  context, but `appSdk` only exists after `ContentstackAppSDK.init()` resolves
  inside MarketplaceAppProvider. The provider calls `setEcomAppSdk(appSdk)` once
  on init; this module then uses that reference for every request.

  Every call goes to `${REWRITE_BASE}${path}` (e.g. "/ecom/products"). A Rewrite
  configured in the app's Advanced Settings forwards that to the real (mock)
  vendor URL, and the `Authorization: Bearer {{map.API_KEY}}` header is resolved
  server-side via the API_KEY mapping — so the key is never exposed to the
  browser.
*/
import type UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import config from "./config";

let appSdkRef: UiLocation | null = null;
// Cached tenant id (see resolveStoreId). null = not yet resolved.
let cachedTenant: string | null = null;

/** Registers the initialized appSdk instance. Called once by the provider. */
export const setEcomAppSdk = (sdk: UiLocation | null): void => {
  appSdkRef = sdk;
  cachedTenant = null; // re-resolve against the new install's config
};

/**
 * Resolves the NON-SENSITIVE tenant id (store id / account id / region …) used
 * to fill STORE_PATH_TEMPLATE. It lives in client configuration, so it is read
 * in-browser via appSdk.getConfig() and placed in the URL path — never a
 * mapping (mappings can only read server config). Returns "" when the vendor
 * has no per-tenant path (TENANT_CONFIG_KEY unset), which is the mock default.
 */
export const resolveStoreId = async (): Promise<string> => {
  const key = config.ECOM_API.TENANT_CONFIG_KEY;
  if (!key) return "";
  if (cachedTenant !== null) return cachedTenant;
  const cfg: any = (await appSdkRef?.getConfig?.()) ?? {};
  cachedTenant = String(cfg?.[key] ?? "");
  return cachedTenant;
};

// Fills STORE_PATH_TEMPLATE's "{...}" placeholder(s) with the tenant id.
// Returns "" when no template is configured.
const buildStorePath = (tenant: string): string => {
  const tpl = config.ECOM_API.STORE_PATH_TEMPLATE;
  if (!tpl) return "";
  return tpl.replace(/\{[^}]+\}/g, tenant);
};

// Builds "/ecom/stores/42/v3/products?id:in=77,80&limit=10" from a path +
// query map, prepending the (optional) per-tenant store path and dropping
// empty/undefined params.
const buildUrl = (
  path: string,
  query?: Record<string, any>,
  tenant = ""
): string => {
  let url = `${config.ECOM_API.REWRITE_BASE}${buildStorePath(tenant)}${path}`;
  if (query) {
    const search = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        search.append(key, String(value));
      }
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }
  return url;
};

/**
 * GET against the vendor API via appSdk.api(). Returns the parsed JSON body.
 * Throws if appSdk is unavailable or the response is not ok.
 */
export const ecomGet = async (
  path: string,
  query?: Record<string, any>
): Promise<any> => {
  if (!appSdkRef?.api) {
    throw new Error(
      "Ecommerce appSdk is not initialized. The app must run inside Contentstack "
        + "with Advanced Settings (rewrite + API_KEY mapping) configured."
    );
  }

  const tenant = await resolveStoreId();
  const url = buildUrl(path, query, tenant);
  const response: Response = await appSdkRef.api(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      [config.ECOM_API.AUTH_HEADER_NAME]: config.ECOM_API.AUTH_HEADER_TEMPLATE,
    },
  });

  if (!response?.ok) {
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      /* response body not readable; ignore */
    }
    throw new Error(
      `Ecommerce API request failed (${response?.status}): ${detail}`
    );
  }

  return response.json();
};
