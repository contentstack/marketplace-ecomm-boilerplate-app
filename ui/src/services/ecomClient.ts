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

/** Registers the initialized appSdk instance. Called once by the provider. */
export const setEcomAppSdk = (sdk: UiLocation | null): void => {
  appSdkRef = sdk;
};

// Builds "/ecom/products?id:in=77,80&limit=10" from a path + query map,
// dropping empty/undefined params.
const buildUrl = (path: string, query?: Record<string, any>): string => {
  let url = `${config.ECOM_API.REWRITE_BASE}${path}`;
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

  const url = buildUrl(path, query);
  const response: Response = await appSdkRef.api(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: config.ECOM_API.AUTH_HEADER_TEMPLATE,
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
