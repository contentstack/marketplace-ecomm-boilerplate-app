/* you can make changes in this file and the functions as per your api requirements */

import axios from "axios";
import constants from "../constants";
import root_config from "../root_config";

//   {
//     page,
//     limit,
//     query,
//     searchParam,
//     id,
//     searchCategories,
//   }: {
//     page?: number;
//     limit?: number;
//     query?: any;
//     searchParam?: string;
//     id?: any;
//     searchCategories?: any;
//   },
//   key: any
// ) => {
//   const url: string = `${root_config.getUrl(
//     key,
//     query,
//     searchParam,
//     searchCategories,
//     id,
//     page,
//     limit
//   )}`;
//   return { url, method: "GET", headers: root_config.getHeaders(key) };
// };

// common function for making third party API calls
// you can modify it as per your third party service response
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
// get a particular product for sidebar widget
export const getById: any = async (data: any, key: any) => {
  let response = await root_config.getSingleProduct(data, key);
  return response;
};

// get all products and categories for selector page
export const getAllProductsAndCategories: any = async (
  data: any,
  body: any
) => {
  let response = {};
  if (root_config.ENDPOINTS_CONFIG.getSeparateProductsAndCategories) {
    if (data?.query === "product")
      response = await root_config.getAllProducts(data, body);
    else response = await root_config.getAllCategories(data, body);
  } else response = await root_config.getAllProductsAndCategories(data, body);

  return response;
};

// get an array of selected products and categories for custom field
export const getSelectedProductsAndCategories: any = async (
  data: any,
  body: any
) => {
  let response = {};
  if (root_config.ENDPOINTS_CONFIG.getSeparateProductsAndCategories) {
    if (data?.query === "product")
      response = await root_config.getSelectedProductsById(data, body);
    else response = await root_config.getSelectedCategoriesById(data, body);
  } else
    response = await root_config.getSelectedProductsandCategories(data, body);

  return { [root_config.URI_ENDPOINTS[data?.query]]: response };
};

// filter products as per categories in the selector page
export const filterByCategory: any = async (data: any, key: any) => {
  let response = await root_config.filterProductsByCategory(data, key);
  return response;
};
