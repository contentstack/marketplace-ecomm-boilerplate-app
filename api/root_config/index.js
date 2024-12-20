const axios = require("axios");
const constants = require("../constants");
const {
  getByCategoryIdUrl,
  getUrl,
  extractCategories,
  getHeaders,
} = require("./utilityFunctions");

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
    const url = getUrl(
      {
        query: productQuery?.query,
        id: productQuery?.id ?? productQuery?.productID,
      },
      productPayload
    );
    const productResponse = await _makeApiCall({
      url,
      method: "GET",
      headers: getHeaders(productPayload),
    });
    return productResponse;
  },

  getSelectedProductsById: async (productQuery, productPayload) => {
    let response = [];
    if (productQuery?.isOldUser === "false") {
      // Example implementation for new users
    } else {
      const extractedProductID =
        productQuery?.["id:in"]?.split(",")?.filter((id) => id !== "") || [];
      response = await Promise.all(
        extractedProductID?.map((id) =>
          root_config.getSingleProduct(
            { id, query: productPayload?.query },
            productPayload
          )
        )
      );
      return response;
    }
  },

  getSelectedCategoriesById: async (categoryQuery, categoryPayLoad) => {
    let response = [];
    if (categoryPayLoad?.isOldUser === false) {
      // Example implementation for new users
    } else {
      return Promise.all(
        categoryPayLoad?.selectedIDs?.map(async (category) => {
          const url = getByCategoryIdUrl(
            categoryPayLoad,
            categoryQuery?.query,
            category
          );
          const categoryResponse = await _makeApiCall({
            url,
            method: "GET",
            headers: getHeaders(categoryPayLoad),
          });
          return categoryResponse;
        })
      );
    }
  },

  getSelectedProductsandCategories: (data, key) => {
    let url = root_config.getUrl(key, data?.query);
    const urlHasQueryParams = url?.includes("?");

    url += data["id:in"] ?
      `${urlHasQueryParams ? "&" : "?"}id:in=${data["id:in"]}`
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
      response = await _makeApiCall({
        url: getUrl(productQuery, productPayload),
        method: "GET",
        headers: getHeaders(productPayload),
      });
      return response;
    }
  },

  getAllCategories: async (categoryQuery, categoryPayLoad) => {
    let response = [];
    if (categoryPayLoad?.isOldUser === false) {
      // Example implementation for new users
    } else {
      response = await _makeApiCall({
        url: getUrl(categoryQuery, categoryPayLoad),
        method: "GET",
        headers: getHeaders(categoryPayLoad),
      });
      return response;
    }
  },

  getAllProductsAndCategories: async (data, body) => {
    let response = await _makeApiCall({
      url: getUrl(data, body),
      method: "GET",
      headers: getHeaders(body),
    });

    return data?.query === "category" ?
      { catalogs: root_config.extractCategories(response) }
      : response;
  },

  filterProductsByCategory: async (data, key) => {
    return _makeApiCall({
      url: `${root_config.getUrl({ query: data?.query }, key)}?categories:in=${
        data["categories:in"]
      }&${root_config.SEARCH_URL_PARAMS}`,
      method: "GET",
      headers: getHeaders(key),
    });
  },
};

module.exports = root_config;
