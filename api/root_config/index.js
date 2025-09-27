// const axios = require("axios");
// const constants = require("../constants");
// const {
//   getByCategoryIdUrl,
//   getUrl,
//   extractCategories,
//   getHeaders,
// } = require("./utilityFunctions");

// const _makeApiCall = async (opts) => {
//   try {
//     const res = await axios({ ...opts, timeout: constants.REQ_TIMEOUT });
//     return res?.data;
//   } catch (e) {
//     throw e;
//   }
// };

// const root_config = {
//   API_BASE_URL: "https://my.example.com/$/v3/", // Add the URL of your commerce app API where $ is a value added through Users response
//   URI_ENDPOINTS: {
//     product: "products",
//     category: "catalogs",
//   },
//   SEARCH_URL_PARAMS: "/search",
//   FIELDS_URL: "fields=FULL",
//   SENSITIVE_CONFIG_KEYS: ["access_token", "project_key"],
//   ENDPOINTS_CONFIG: {
//     getSeparateProductsAndCategories: true,
//   },

//   getSingleProduct: async (productQuery, productPayload) => {
//     const url = getUrl(
//       {
//         query: productQuery?.query,
//         id: productQuery?.id ?? productQuery?.productID,
//       },
//       productPayload
//     );
//     const productResponse = await _makeApiCall({
//       url,
//       method: "GET",
//       headers: getHeaders(productPayload),
//     });
//     return productResponse;
//   },

//   getSelectedProductsById: async (productQuery, productPayload) => {
//     let response = [];
//     if (productQuery?.isOldUser === "false") {
//       // Example implementation for new users
//     } else {
//       const extractedProductID =
//         productQuery?.["id:in"]?.split(",")?.filter((id) => id !== "") || [];
//       response = await Promise.all(
//         extractedProductID?.map((id) =>
//           root_config.getSingleProduct(
//             { id, query: productPayload?.query },
//             productPayload
//           )
//         )
//       );
//       return response;
//     }
//   },

//   getSelectedCategoriesById: async (categoryQuery, categoryPayLoad) => {
//     let response = [];
//     if (categoryPayLoad?.isOldUser === false) {
//       // Example implementation for new users
//     } else {
//       return Promise.all(
//         categoryPayLoad?.selectedIDs?.map(async (category) => {
//           const url = getByCategoryIdUrl(
//             categoryPayLoad,
//             categoryQuery?.query,
//             category
//           );
//           const categoryResponse = await _makeApiCall({
//             url,
//             method: "GET",
//             headers: getHeaders(categoryPayLoad),
//           });
//           return categoryResponse;
//         })
//       );
//     }
//   },

//   getSelectedProductsandCategories: (data, key) => {
//     let url = root_config.getUrl(key, data?.query);
//     const urlHasQueryParams = url?.includes("?");

//     url += data["id:in"] ?
//       `${urlHasQueryParams ? "&" : "?"}id:in=${data["id:in"]}`
//       : `${urlHasQueryParams ? "&" : "?"}sku:in=${data["sku:in"]}`;
//     if (data?.query === "product") url += root_config.SEARCH_URL_PARAMS;
//     if (data?.limit) url += `&limit=${data?.limit}`;

//     return _makeApiCall({
//       url,
//       method: "GET",
//       headers: getHeaders(key),
//     });
//   },

//   getAllProducts: async (productQuery, productPayload) => {
//     let response = [];
//     if (productPayload?.isOldUser === false) {
//       // Example implementation for new users
//     } else {
//       response = await _makeApiCall({
//         url: getUrl(productQuery, productPayload),
//         method: "GET",
//         headers: getHeaders(productPayload),
//       });
//       return response;
//     }
//   },

//   getAllCategories: async (categoryQuery, categoryPayLoad) => {
//     let response = [];
//     if (categoryPayLoad?.isOldUser === false) {
//       // Example implementation for new users
//     } else {
//       response = await _makeApiCall({
//         url: getUrl(categoryQuery, categoryPayLoad),
//         method: "GET",
//         headers: getHeaders(categoryPayLoad),
//       });
//       return response;
//     }
//   },

//   getAllProductsAndCategories: async (data, body) => {
//     let response = await _makeApiCall({
//       url: getUrl(data, body),
//       method: "GET",
//       headers: getHeaders(body),
//     });

//     return data?.query === "category" ?
//       { catalogs: root_config.extractCategories(response) }
//       : response;
//   },

//   filterProductsByCategory: async (data, key) => {
//     return _makeApiCall({
//       url: `${root_config.getUrl({ query: data?.query }, key)}?categories:in=${
//         data["categories:in"]
//       }&${root_config.SEARCH_URL_PARAMS}`,
//       method: "GET",
//       headers: getHeaders(key),
//     });
//   },
// };

// module.exports = root_config;

const axios = require("axios");
const constants = require("../constants");
const {
  getByCategoryIdUrl,
  getUrl,
  extractCategories,
  getHeaders,
} = require("./utilityFunctions");

/**
 * Executes the API call using axios with a global timeout.
 * @param {object} opts - Axios configuration options.
 * @returns {Promise<object>} The data returned by the API.
 */
const _makeApiCall = async (opts) => {
  try {
    const res = await axios({ ...opts, timeout: constants.REQ_TIMEOUT });
    return res?.data;
  } catch (e) {
    // Re-throw the error for the calling function to handle
    throw e;
  }
};

/**
 * Private helper function to handle common GET requests (All Products, All Categories).
 * @param {object} query - The query parameters for getUrl.
 * @param {object} payload - The payload containing headers and user info.
 * @returns {Promise<object|Array>} The API response data.
 */
const _fetchResource = async (query, payload) => {
    // Placeholder for new user logic
    if (payload?.isOldUser === false) {
      return []; 
    } 

    const url = getUrl(query, payload); 

    return _makeApiCall({
      url,
      method: "GET",
      headers: getHeaders(payload),
    });
};

const root_config = {
  API_BASE_URL: "https://my.example.com/$/v3/", 
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
  
  // Expose the helper function for internal reuse
  _fetchResource, 

  // --- Single & All Resource Fetching ---
  
  getSingleProduct: async ({ query, id, productID }, productPayload) => {
    // Consolidate id and productID for getUrl
    const productQuery = { query, id: id ?? productID }; 
    return root_config._fetchResource(productQuery, productPayload);
  },

  getAllProducts: async (productQuery, productPayload) => {
    return root_config._fetchResource(productQuery, productPayload);
  },

  getAllCategories: async (categoryQuery, categoryPayLoad) => {
    return root_config._fetchResource(categoryQuery, categoryPayLoad);
  },

  // --- Selected By ID Fetching ---

  getSelectedProductsById: async (productQuery, productPayload) => {
    if (productQuery?.isOldUser === "false") {
      // Example implementation for new users
      return []; 
    }

    const extractedProductID = productQuery?.["id:in"]
      ?.split(",")
      ?.filter((id) => id !== "") || [];

    // Use Promise.all for concurrent fetching of individual products
    return Promise.all(
      extractedProductID.map((id) =>
        root_config.getSingleProduct(
          { id, query: productPayload?.query }, 
          productPayload
        )
      )
    );
  },

  getSelectedCategoriesById: async ({ selectedIDs }, categoryPayLoad) => {
    if (categoryPayLoad?.isOldUser === false) {
      // Example implementation for new users
      return [];
    }

    // Use Promise.all for concurrent fetching
    return Promise.all(
      selectedIDs?.map(async (category) => {
        const url = getByCategoryIdUrl(
          categoryPayLoad,
          categoryPayLoad?.query,
          category
        );
        return _makeApiCall({
          url,
          method: "GET",
          headers: getHeaders(categoryPayLoad),
        });
      }) || [] // Default to an empty array to handle undefined selectedIDs gracefully
    );
  },

  // --- Combined/Filtered Fetching ---

  getSelectedProductsandCategories: ({ query, "id:in": idIn, "sku:in": skuIn, limit }, key) => {
    let url = getUrl({ query }, key);

    // Determine the filter key and value
    const filterKey = idIn ? "id:in" : "sku:in";
    const filterValue = idIn || skuIn;
    
    // Construct the URL path and query parameters
    if (filterValue) {
      const separator = url.includes("?") ? "&" : "?";
      url += `${separator}${filterKey}=${filterValue}`;
    }

    if (query === "product") url += root_config.SEARCH_URL_PARAMS;
    if (limit) url += `&limit=${limit}`;

    return _makeApiCall({
      url,
      method: "GET",
      headers: getHeaders(key),
    });
  },

  getAllProductsAndCategories: async (data, body) => {
    const response = await root_config._fetchResource(data, body);
    
    // Use ternary operator for concise final response formatting
    return data?.query === "category" ?
      { catalogs: extractCategories(response) }
      : response;
  },

  filterProductsByCategory: async (data, key) => {
    const baseUrl = getUrl({ query: data?.query }, key);
    const categoryFilter = data["categories:in"];

    // Construct the URL using template literals for clarity
    const url = `${baseUrl}?categories:in=${categoryFilter}&${root_config.SEARCH_URL_PARAMS}`;

    return _makeApiCall({
      url,
      method: "GET",
      headers: getHeaders(key),
    });
  },
};

module.exports = root_config;
