import axios, { Method } from "axios";
import localeTexts from "../common/locale/en-us";
import rootConfig from "../root_config";
import categoryConfig from "../root_config/categories";
import { KeyValueObj } from "../common/types";

// common function for an API call to your backend
const makeAnApiCall = async (url: string, method: Method, data: any) => {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });

    return {
      error: false,
      data: rootConfig.getFormattedResponse(response),
    };
  } catch (e: any) {
    const status = e?.response?.status;
    const resData = e?.response?.data;
    switch (status) {
      case 400:
        return {
          error: true,
          data: resData || localeTexts.errors.badRequest,
        };
      case 401:
        return {
          error: true,
          data: resData || localeTexts.errors.unauthorized,
        };
      case 403:
        return {
          error: true,
          data: resData || localeTexts.errors.forbidden,
        };
      case 404:
        return {
          error: true,
          data: resData || localeTexts.errors.notFound,
        };
      case 429:
        return {
          error: true,
          data: resData || localeTexts.errors.tooManyRequests,
        };
      case 500:
        return {
          error: true,
          data:
            resData
            || localeTexts.warnings.invalidCredentials.replace(
              "$",
              rootConfig.ecommerceEnv.APP_ENG_NAME
            ),
        };
      default:
        return {
          error: true,
          data:
            resData?.message
            || localeTexts.warnings.somethingWentWrong
            || localeTexts.warnings.unexpectedError,
        };
    }
  }
};

/**
 * Fetches paginated products and categories based on the provided parameters.
 *
 * @param {any} config - Configuration data of the app.
 * @param {any} requestType - Indicates whether the request is for product or category.
 * @param {any} skip - Specifies how many products/categories to skip.
 * @param {any} limit - Specifies how much data to return.
 * @param {any} isOldUser - Used to check if multiconfiguration is enabled or not.
 * @param {any} multiConfigDropDown - Contains the multiconfiguration key names.
 *
 * @returns {Promise<any>} - The API response.
 */
const getProductandCategory = (
  config: any,
  requestType: any,
  skip: any,
  limit: any,
  isOldUser: any,
  multiConfigDropDown: any
) => {
  const queryParamsObject: any = {
    query: requestType,
    skip: String(skip),
    limit: String(limit),
  };

  if (multiConfigDropDown?.value) {
    queryParamsObject.configKey = JSON.stringify({
      [multiConfigDropDown.value]: {},
    });
  }

  const queryParams = new URLSearchParams(queryParamsObject);

  return makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?${queryParams.toString()}`,
    "POST",
    { config, isOldUser, multiConfigDropDown }
  );
};

// get all available categories
const requestCategories = (config: any) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=category`,
    "POST",
    config
  );

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
  const queryParams = new URLSearchParams({
    query: type,
    "id:in": ids,
    isOldUser: String(isOldUser),
    configKey: ids,
  });
  const apiUrl = `${process.env.REACT_APP_API_URL}?${queryParams.toString()}`;
  return makeAnApiCall(apiUrl, "POST", { config: { ...config } });
};
// runes when categoryConfig.customCategoryStructure is true
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
    const { apiUrl, requestData } = categoryConfig.fetchCustomCategoryData(
      config,
      type,
      selectedIDs,
      isOldUser
    );
    return makeAnApiCall(apiUrl, "POST", requestData);
  }
  return null;
};
// search products and categories
const search = (
  config: any,
  keyword: any,
  skip: any,
  limit: any,
  oldUser: Boolean,
  selectedMultiConfigValue: any
) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=${config?.type}&searchParam=keyword=${keyword}&skip=${skip}&limit=${limit}`,
    "POST",
    { config, oldUser, selectedMultiConfigValue }
  );

//  Retrieves API validation for configuration page keys when  isApiValidation is true
const ApiValidationEnabledForConfig = (
  configurationObject: any,
  serverConfigurationObject: any,
  multiConfigTrueAndApiValidationEnabledKeys: any,
  multiConfigFalseAndApiValidationEnabledKeys: any
) => {
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?type=isApiValidationEnabled`,
    "POST",
    {
      configurationObject,
      serverConfigurationObject,
      multiConfigTrueAndApiValidationEnabledKeys,
      multiConfigFalseAndApiValidationEnabledKeys,
    }
  );
};
export {
  getSelectedIDs,
  getProductandCategory,
  requestCategories,
  search,
  getCustomCategoryData,
  ApiValidationEnabledForConfig,
};
