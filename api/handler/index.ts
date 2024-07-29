import axios from "axios";
import constants from "../constants";
import root_config from "../root_config";

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
export const _makeApiCall: any = async (opts: any) => {
  try {
    const res: any = await axios({ ...opts, timeout: constants.REQ_TIMEOUT });
    return res?.data;
  } catch (e: any) {
    if (e?.response?.status === constants.HTTP_ERROR_CODES.NOT_FOUND) {
      return {
        data: {
          id: e?.response?.data?.title?.match(constants.EXTRACT_ID_REGX)[0],
          error: e?.response?.data?.title,
        },
      };
    }
    console.error(constants.HTTP_ERROR_TEXTS.API_ERROR);
    console.error(e);
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
export const getProductByID: any = async (
  productQuery: any,
  productPayload: any
) => {
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
export const getAllProductsAndCategories: any = async (
  productCategoryQuery: any,
  productCategoryPayload: any
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
export const getSelectedProductsAndCategories: any = async (
  productCategoryQuery: any,
  productCategoryPayload: any
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
export const filterByCategory: any = async (data: any, key: any) => {
  let response = await root_config.filterProductsByCategory(data, key);
  return response;
};
