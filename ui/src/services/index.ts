import localeTexts from "../common/locale/en-us";
import rootConfig from "../root_config";
import categoryConfig from "../root_config/categories";
import { KeyValueObj } from "../common/types";
import {
  getSelectedProductsAndCategories,
  getAllProductsAndCategories,
} from "./ecommerce";
import { authenticate } from "./auth";

/**
 * Runs a migrated ecommerce function and formats its result into the same
 * `{ error, data }` shape the consumers previously received from the backend
 * call. Previously these went out over HTTP to the backend; now the ecommerce
 * logic runs directly in the UI.
 */
const callEcommerce = async (
  fn: (query: any, body: any) => Promise<any>,
  query: any,
  body: any
) => {
  try {
    const responseBody = await fn(query, body);
    return {
      error: false,
      data: rootConfig.getFormattedResponse({ data: responseBody }),
    };
  } catch (e: any) {
    return {
      error: true,
      data:
        e?.message
        || localeTexts.warnings.somethingWentWrong
        || localeTexts.warnings.unexpectedError,
    };
  }
};

// get all available categories
const requestCategories = (config: any) =>
  callEcommerce(getAllProductsAndCategories, { query: "category" }, config);

// fetch a page of products or categories (migrated from the backend "get all"
// flow; query carries the type/skip/limit/search params)
const requestProductsAndCategories = (query: any, body: any) =>
  callEcommerce(getAllProductsAndCategories, query, body);

/**
 * Fetches selected products or categories based on the provided parameters.
 *
 * @param {object} config - Configuration data of the app.
 * @param {string} type - Indicates whether the request is for product or category.
 * @param {Array<any>} selectedIDs - Array of selected IDs to filter by.
 * @param {boolean} isOldUser - Indicates if the user is an old user with multiconfig enabled.
 *
 * @returns {Promise<any>} - The API response.
 */
const getSelectedIDs = async (
  config: KeyValueObj | null,
  type: string,
  selectedIDs: any[],
  isOldUser: boolean | Boolean
) => {
  const ids = isOldUser ? selectedIDs?.join(",") : JSON.stringify(selectedIDs);
  // The query/payload shape mirrors what the backend handler used to receive,
  // so the migrated function behaves identically.
  const query = {
    query: type,
    "id:in": ids,
    isOldUser: String(isOldUser),
    configKey: ids,
  };
  const payload = { config: { ...config } };

  return callEcommerce(getSelectedProductsAndCategories, query, payload);
};
// runes when categoryConfig.customCategoryStructure is true/false
const getCustomCategoryData = async (
  config: any,
  type: any,
  selectedIDs: any,
  isOldUser: any
) => {
  if (
    isOldUser
      ? Array.isArray(selectedIDs) && selectedIDs?.length
      : Object.keys(selectedIDs)?.length
  ) {
    const categoryID = isOldUser
      ? selectedIDs?.join(",")
      : JSON.stringify(selectedIDs);
    const { requestData } = categoryConfig.fetchCustomCategoryData(
      config,
      type,
      categoryID,
      isOldUser
    );
    // This previously hit the backend `query=<type>&id:in=<ids>` endpoint,
    // which routed to getSelectedProductsAndCategories. Same logic now runs
    // in the UI.
    return callEcommerce(
      getSelectedProductsAndCategories,
      { query: type, "id:in": categoryID, isOldUser: String(isOldUser) },
      requestData
    );
  }
  return null;
};

// Previously this POSTed the app-token to the backend auth endpoint
// (REACT_APP_API_AUTH_URL). The verify-and-sign logic now runs in the UI; see
// ./auth.ts. The return shape is unchanged, so verifyAppSigning stays the same.
const getAuthtoken = async (appToken: string = "") => authenticate(appToken);

export {
  getSelectedIDs,
  requestCategories,
  requestProductsAndCategories,
  getCustomCategoryData,
  getAuthtoken,
};
