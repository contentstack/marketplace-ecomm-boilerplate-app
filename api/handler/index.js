const axios = require("axios");
const constants = require("../constants");
const root_config = require("../root_config");

/**
 * Makes a third-party API call with the provided options.
 *
 * @param {Object} opts - Options for the API call, including URL, method, and headers.
 * @returns {Promise<Object>} - The response data from the API call.
 * @throws {Error} - Throws an error if the API call fails.
 *
 * This function uses `axios` to perform the HTTP request. Customize this function
 * according to your specific API's requirements and response structure.
 *
 * It handles errors by returning a default response for `404 Not Found` errors
 * and throws an error for other types of failures.
 */
const _makeApiCall = async (opts) => {
  try {
    const res = await axios({ ...opts, timeout: constants.REQ_TIMEOUT });
    return res?.data;
  } catch (e) {
    throw e;
  }
};

/**
 * Retrieves a particular product using its ID.
 *
 * @param {Object} productQuery - Query parameters for the product request.
 * @param {Object} productPayload - Payload containing additional data for the request.
 * @returns {Promise<Object>} - The product data.
 */
const getProductByID = async (productQuery, productPayload) => {
  let response = await root_config.getSingleProduct(
    productQuery,
    productPayload
  );
  return response;
};

/**
 * Fetches all products and categories based on the provided parameters.
 *
 * @param {Object} productCategoryQuery - Query parameters for the request.
 * @param {string} productCategoryQuery.query - The type of query (e.g., 'product', 'category').
 * @param {string} productCategoryQuery.skip - Number of items to skip for pagination.
 * @param {string} productCategoryQuery.limit - Number of items to return for pagination.
 * @param {Object} productCategoryPayload - Payload containing additional data for the request.
 * @returns {Promise<Object>} - The products and categories data.
 */
const getAllProductsAndCategories = async (
  productCategoryQuery,
  productCategoryPayload
) => {
  let response = {};
  if (root_config.ENDPOINTS_CONFIG.getSeparateProductsAndCategories) {
    if (productCategoryQuery?.query === "product") {
      response = await root_config.getAllProducts(
        productCategoryQuery,
        productCategoryPayload
      );
    } else {
      response = await root_config.getAllCategories(
        productCategoryQuery,
        productCategoryPayload
      );
    }
  } else {
    response = await root_config.getAllProductsAndCategories(
      productCategoryQuery,
      productCategoryPayload
    );
  }
  return response;
};

/**
 * Retrieves selected products and categories based on the provided parameters.
 *
 * @param {Object} productCategoryQuery - Query parameters for the request.
 * @param {string} productCategoryQuery.query - The type of query (e.g., 'product', 'category').
 * @param {Object} productCategoryPayload - Payload containing additional data for the request.
 * @returns {Promise<Object>} - The selected products and categories data.
 */
const getSelectedProductsAndCategories = async (
  productCategoryQuery,
  productCategoryPayload
) => {
  let response = {};
  if (root_config.ENDPOINTS_CONFIG.getSeparateProductsAndCategories) {
    if (productCategoryQuery?.query === "product") {
      response = await root_config.getSelectedProductsById(
        productCategoryQuery,
        productCategoryPayload
      );
    } else {
      response = await root_config.getSelectedCategoriesById(
        productCategoryQuery,
        productCategoryPayload
      );
    }
  } else {
    response = await root_config.getSelectedProductsandCategories(
      productCategoryQuery,
      productCategoryPayload
    );
  }
  return { [root_config.URI_ENDPOINTS[productCategoryQuery?.query]]: response };
};

/**
 * Filters products based on the provided categories.
 */
const filterByCategory = async (data, key) => {
  let response = await root_config.filterProductsByCategory(data, key);
  return response;
};

/**
 * Retrieves API validation for configuration page keys.
 *
 * @param {Object} apkSdkInstallationData - The data used for API validation.
 * @param {Object} query - The query for whether isApiValidationEnabled is enabaled or not.
 *
 * @param {Object} apkSdkInstallationData.configurationObject - The configuration object containing various settings.
 * @param {Object} apkSdkInstallationData.serverConfigurationObject - The server configuration object for API settings.
 * @param {Array<string>} apkSdkInstallationData.multiconfigTrueApiEnabledKeys - Array of keys for multi-config API validation that are enabled.
 * @param {Array<string>} apkSdkInstallationData.nonMulticonfigApiEnabledKeys - Array of keys for non-multi-config API validation that are enabled.
 *
 * @returns {Promise<any>} - A promise that resolves to the API validation response.
 */
const getApiValidationForConfigPageKeys = async (
  apkSdkInstallationData,
  query
) => {
  let response = await root_config.retrieveConfigPageValidation(
    apkSdkInstallationData,
    query
  );
  return response;
};

module.exports = {
  _makeApiCall,
  getProductByID,
  getAllProductsAndCategories,
  getSelectedProductsAndCategories,
  filterByCategory,
  getApiValidationForConfigPageKeys,
};
