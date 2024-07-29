import { _makeApiCall, getProductByID } from "../handler";
import {
  getByCategoryIdUrl,
  getUrl,
  extractCategories,
  getHeaders,
} from "./utilityFunctions";

const root_config: any = {
  API_BASE_URL: "https://my.example.com/$/v3/", // Add the URL of your commerce app API where $ is a value added through Users response
  URI_ENDPOINTS: {
    product: "products",
    category: "catalogs",
  },
  PRODUCT_URL_PARAMS: "/search",
  FIELDS_URL: "fields=FULL",
  SENSITIVE_CONFIG_KEYS: ["base_site_id", "backoffice_url", "base_url"],
  ENDPOINTS_CONFIG: {
    getSeparateProductsAndCategories: true,
  },

  getSingleProduct: async (productQuery: any, productPayload: any) => {
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

  getSelectedProductsById: async (productQuery: any, productPayload: any) => {
    let response;

    if (productQuery?.isOldUser === "false") {
      // Just for example purpose
      // If the user is not an old user, perform the API call as per multi-config requirements
      /*
      apiCallFunction().then(response => {
        // On successful API response, append cs_metadata to include the multi-config name and deletion status
        const responseData = {
          ...response,
          cs_metadata: {
            multi_config_name: configKey, // The name of the multi-config used
            isconfigdeleted: false, // Indicates that the configuration is not deleted
          }
        };
        return responseData;
      }).catch(error => {
        // In case of an error, return an object with cs_metadata indicating that the configuration was deleted
        return {
          id: productID,
          cs_metadata: {
            multi_config_name: configKey, // The name of the multi-config used
            isconfigdeleted: true, // Indicates that the configuration is deleted
          }
        };
      });
      */
    } else {
      const extractedProductID =
        productPayload?.["id:in"]?.split(",").filter((id: any) => id !== "") ||
        [];
      response = await Promise.all(
        extractedProductID.map((id: any) =>
          getProductByID({ id, query: productPayload?.query }, productPayload)
        )
      );
      return response;
    }

    return response;
  },

  getSelectedCategoriesById: async (
    categoryQuery: any,
    categoryPayLoad: any
  ) => {
    if (categoryPayLoad?.isOldUser === false) {
      // Just for example purpose
      // If the user is not an old user, perform the API call as per multi-config requirements
      /*
      apiCallFunction().then(response => {
        // On successful API response, append cs_metadata to include the multi-config name and deletion status
        const responseData = {
          ...response,
          cs_metadata: {
            multi_config_name: configKey, // The name of the multi-config used
            isconfigdeleted: false, // Indicates that the configuration is not deleted
          }
        };
        return responseData;
      }).catch(error => {
        // In case of an error, return an object with cs_metadata indicating that the configuration was deleted
        return {
          id: productID,
          cs_metadata: {
            multi_config_name: configKey, // The name of the multi-config used
            isconfigdeleted: true, // Indicates that the configuration is deleted
          }
        };
      });
      */
    } else {
      return Promise.all(
        categoryPayLoad?.selectedIDs?.map(async (category: any) => {
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

  getSelectedProductsandCategories: (data: any, key: any) => {
    let url: string = root_config.getUrl(key, data?.query);
    const urlHasQueryParams: boolean = url.includes("?");

    url += data["id:in"] ?
      `${urlHasQueryParams ? "&" : "?"}id:in=${data["id:in"]}`
      : `${urlHasQueryParams ? "&" : "?"}sku:in=${data["sku:in"]}`;

    if (data?.query === "product") url += root_config.PRODUCT_URL_PARAMS;
    if (data?.limit) url += `&limit=${data?.limit}`;

    return _makeApiCall({
      url,
      method: "GET",
      headers: getHeaders(key),
    });
  },

  getAllProducts: async (productQuery: any, productPayload: any) => {
    let response: any;

    if (productPayload?.isOldUser === false) {
      // Just for example purpose
      // If the user is not an old user, perform the API call as per multi-config requirements
      /*
      apiCallFunction().then(response => {
        // On successful API response, append cs_metadata to include the multi-config name and deletion status
        const responseData = {
          ...response,
          cs_metadata: {
            multi_config_name: configKey, // The name of the multi-config used
            isconfigdeleted: false, // Indicates that the configuration is not deleted
          }
        };
        return responseData;
      }).catch(error => {
        // In case of an error, return an object with cs_metadata indicating that the configuration was deleted
        return {
          id: productID,
          cs_metadata: {
            multi_config_name: configKey, // The name of the multi-config used
            isconfigdeleted: true, // Indicates that the configuration is deleted
          }
        };
      });
      */
    } else {
      response = await _makeApiCall({
        url: getUrl(productQuery, productPayload),
        method: "GET",
        headers: getHeaders(productPayload),
      });
      return response;
    }
  },

  getAllCategories: async (categoryQuery: any, categoryPayLoad: any) => {
    let response: any;

    if (categoryPayLoad?.isOldUser === false) {
      // Just for example purpose
      // If the user is not an old user, perform the API call as per multi-config requirements
      /*
      apiCallFunction().then(response => {
        // On successful API response, append cs_metadata to include the multi-config name and deletion status
        const responseData = {
          ...response,
          cs_metadata: {
            multi_config_name: configKey, // The name of the multi-config used
            isconfigdeleted: false, // Indicates that the configuration is not deleted
          }
        };
        return responseData;
      }).catch(error => {
        // In case of an error, return an object with cs_metadata indicating that the configuration was deleted
        return {
          id: productID,
          cs_metadata: {
            multi_config_name: configKey, // The name of the multi-config used
            isconfigdeleted: true, // Indicates that the configuration is deleted
          }
        };
      });
      */
    } else {
      response = await _makeApiCall({
        url: getUrl(categoryQuery, categoryPayLoad),
        method: "GET",
        headers: getHeaders(categoryPayLoad),
      });
      return response;
    }
  },

  getAllProductsAndCategories: async (data: any, body: any) => {
    let response = await _makeApiCall({
      url: getUrl(data, body),
      method: "GET",
      headers: getHeaders(body),
    });

    return data?.query === "category" ?
      { catalogs: root_config.extractCategories(response) }
      : response;
  },

  filterProductsByCategory: async (data: any, key: any) => {
    return _makeApiCall({
      url: `${root_config.getUrl({ query: data?.query }, key)}?categories:in=${
        data["categories:in"]
      }&${root_config.PRODUCT_URL_PARAMS}`,
      method: "GET",
      headers: getHeaders(key),
    });
  },
};

export default root_config;
