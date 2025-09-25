import axios from "axios";
import constants from "../constants/index.js";
import {
  getByCategoryIdUrl,
  getUrl,
  extractCategories,
  getHeaders,
} from "./utilityFunctions.js";

import products from "../data/products.js";
import categories from "../data/categories.js";

const _makeApiCall = async (opts) => {
  try {
    const res = await axios({ ...opts, timeout: constants.REQ_TIMEOUT });
    return res?.data;
  } catch (e) {
    throw e;
  }
};

const root_config = {
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

  getSingleProduct: async (productQuery, productPayload) => {
    // const url = getUrl(
    //   {
    //     query: productQuery?.query,
    //     id: productQuery?.id ?? productQuery?.productID,
    //   },
    //   productPayload
    // );
    // const productResponse = await _makeApiCall({
    //   url,
    //   method: "GET",
    //   headers: getHeaders(productPayload),
    // });
    // return productResponse;

    // Mocked response for demonstration purposes
    const productID = productQuery?.id || productQuery?.productID;
    const product = products.data.find((product) => product.id === +productID);
    return product || {};
  },

  getSelectedProductsById: async (productQuery, productPayload) => {
    let response = [];
    if (productQuery?.isOldUser === "false") {
      // Example implementation for new users
    } else {
      const extractedProductID = (
        productQuery?.["id:in"]?.split(",")?.filter((id) => id !== "") || []
      )?.map((id) => +id);
      // response = await Promise.all(
      //   extractedProductID?.map((id) =>
      //     root_config.getSingleProduct(
      //       { id, query: productPayload?.query },
      //       productPayload
      //     )
      //   )
      // );

      //Mocked response for demonstration purposes
      response = products.data.filter((product) =>
        extractedProductID.includes(product.id)
      );
      return response;
    }
  },

  getSelectedCategoriesById: async (categoryQuery, categoryPayLoad) => {
    let response = [];
    if (categoryPayLoad?.isOldUser === false) {
      // Example implementation for new users
    } else {
      // return Promise.all(
      //   categoryPayLoad?.selectedIDs?.map(async (category) => {
      //     const url = getByCategoryIdUrl(
      //       categoryPayLoad,
      //       categoryQuery?.query,
      //       category
      //     );
      //     const categoryResponse = await _makeApiCall({
      //       url,
      //       method: "GET",
      //       headers: getHeaders(categoryPayLoad),
      //     });
      //     return categoryResponse;
      //   })
      // );

      // Mocked response for demonstration purposes
      const categoriesId = (
        categoryQuery?.["id:in"]?.split(",")?.filter((id) => id !== "") || []
      )?.map((id) => +id);
      response = categories.data.filter((category) =>
        categoriesId.includes(category.id)
      );
      return response;
    }
  },

  getSelectedProductsandCategories: (data, key) => {
    let url = getUrl(key, data?.query);
    const urlHasQueryParams = url?.includes("?");

    url += data["id:in"]
      ? `${urlHasQueryParams ? "&" : "?"}id:in=${data["id:in"]}`
      : `${urlHasQueryParams ? "&" : "?"}sku:in=${data["sku:in"]}`;
    if (data?.query === "product") url += root_config.SEARCH_URL_PARAMS;
    if (data?.limit) url += `&limit=${data?.limit}`;

    return _makeApiCall({
      url,
      method: "GET",
      headers: getHeaders(key),
    });
  },

  getAllProducts: async (productQuery, productPayload) => {
    let response = [];
    if (productPayload?.isOldUser === false) {
      // Example implementation for new users
    } else {
      // response = await _makeApiCall({
      //   url: getUrl(productQuery, productPayload),
      //   method: "GET",
      //   headers: getHeaders(productPayload),
      // });
      // return response;

      // Mocked response for demonstration purposes
      return products.data;
    }
  },

  getAllCategories: async (categoryQuery, categoryPayLoad) => {
    let response = [];
    if (categoryPayLoad?.isOldUser === false) {
      // Example implementation for new users
    } else {
      // response = await _makeApiCall({
      //   url: getUrl(categoryQuery, categoryPayLoad),
      //   method: "GET",
      //   headers: getHeaders(categoryPayLoad),
      // });
      // return response;

      // Mocked response for demonstration purposes
      return categories.data;
    }
  },

  getAllProductsAndCategories: async (data, body) => {
    let response = await _makeApiCall({
      url: getUrl(data, body),
      method: "GET",
      headers: getHeaders(body),
    });

    return data?.query === "category"
      ? { catalogs: extractCategories(response) }
      : response;
  },

  filterProductsByCategory: async (data, key) => {
    return _makeApiCall({
      url: `${getUrl({ query: data?.query }, key)}?categories:in=${
        data["categories:in"]
      }&${root_config.SEARCH_URL_PARAMS}`,
      method: "GET",
      headers: getHeaders(key),
    });
  },
};

export default root_config;
