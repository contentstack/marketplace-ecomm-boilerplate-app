import { _makeApiCall, getProductByID } from "../handler";
import {
  getByCategoryIdUrl,
  getUrl,
  extractCategories,
  getHeaders,
} from "./utilityFunctions";
// Define the types for cs_metadata and the response object
interface CsMetadata {
  multiConfigName: string;
  isConfigDeleted: boolean;
}
// eslint-disable-next-line
interface ApiResponseWithMetadata {
  // eslint-disable-next-line
  cs_metadata: CsMetadata;
}
type ApiResponseWithoutMetadata = any;
type ApiResponse = ApiResponseWithMetadata | ApiResponseWithoutMetadata;

/* eslint-disable @typescript-eslint/naming-convention */

/* The `root_config` object in the provided TypeScript code is serving as a configuration object for
making API calls related to a commerce application. It contains various properties and methods that
define how to interact with the API endpoints. */

const root_config: any = {
  API_BASE_URL: "https://my.example.com/$/v3/", // Add the URL of your commerce app API where $ is a value added through Users response
  URI_ENDPOINTS: {
    product: "products",
    category: "catalogs",
  },
  /* The `SEARCH_URL_PARAMS` property can be used to append a search parameter to the API endpoint URL when making specific API
calls related to searching for products or categories. By adding `SEARCH_URL_PARAMS` to the URL
construction logic in the functions, it allows for consistent inclusion of the
search parameter in the API requests where needed. */
  SEARCH_URL_PARAMS: "/search",
  FIELDS_URL: "fields=FULL",
  SENSITIVE_CONFIG_KEYS: ["base_site_id", "backoffice_url", "base_url"],
  ENDPOINTS_CONFIG: {
    /* The `getSeparateProductsAndCategories: true` property in the `root_config` object is serving as a
configuration setting that indicates whether the API should handle and retrieve products and
categories separately when making API calls. 

When set to `true`, you must implement the following:
1. getAllProducts()
2. getAllCategories()
3. getSelectedProductsById()
4. getSelectedCategoriesById()

If set to false, you need to implement the following:
1. getAllProductsAndCategories()
2. getSelectedProductsandCategories()
 */
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
    let response: ApiResponse[] = [];
    if (productQuery?.isOldUser === "false") {
      // Just for example purpose
      // If the user is not an old user, perform the API call as per multi-config requirements
      /*
      apiCallFunction().then(response => {
        // On successful API response, append cs_metadata to include the multi-config name and deletion status
        const responseData = {
          ...response,
          cs_metadata: {
            multiConfigName: configKey, // The name of the multi-config used
            isconfigdeleted: false, // Indicates that the configuration is not deleted
          }
        };
        return responseData;
      }).catch(error => {
        // In case of an error, return an object with cs_metadata indicating that the configuration was deleted
        return {
          id: productID,
          cs_metadata: {
            multiConfigName: configKey, // The name of the multi-config used
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
        extractedProductID?.map((id: any) =>
          getProductByID({ id, query: productPayload?.query }, productPayload)
        )
      );
      return response as ApiResponse[];
    }
  },

  getSelectedCategoriesById: async (
    categoryQuery: any,
    categoryPayLoad: any
  ) => {
    let response: ApiResponse[] = [];
    if (categoryPayLoad?.isOldUser === false) {
      // Just for example purpose
      // If the user is not an old user, perform the API call as per multi-config requirements
      /*
      apiCallFunction().then(response => {
        // On successful API response, append cs_metadata to include the multi-config name and deletion status
        const responseData = {
          ...response,
          cs_metadata: {
            multiConfigName: configKey, // The name of the multi-config used
            isconfigdeleted: false, // Indicates that the configuration is not deleted
          }
        };
        return responseData;
      }).catch(error => {
        // In case of an error, return an object with cs_metadata indicating that the configuration was deleted
        return {
          id: productID,
          cs_metadata: {
            multiConfigName: configKey, // The name of the multi-config used
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
          return categoryResponse as any;
        })
      );
    }
  },

  getSelectedProductsandCategories: (data: any, key: any) => {
    let url: string = root_config.getUrl(key, data?.query);
    const urlHasQueryParams: boolean = url?.includes("?");

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

  getAllProducts: async (productQuery: any, productPayload: any) => {
    let response: ApiResponse[] = [];

    if (productPayload?.isOldUser === false) {
      // Just for example purpose
      // If the user is not an old user, perform the API call as per multi-config requirements
      /*
      apiCallFunction().then(response => {
        // On successful API response, append cs_metadata to include the multi-config name and deletion status
        const responseData = {
          ...response,
          cs_metadata: {
            multiConfigName: configKey, // The name of the multi-config used
            isconfigdeleted: false, // Indicates that the configuration is not deleted
          }
        };
        return responseData;
      }).catch(error => {
        // In case of an error, return an object with cs_metadata indicating that the configuration was deleted
        return {
          id: productID,
          cs_metadata: {
            multiConfigName: configKey, // The name of the multi-config used
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
      return response as any;
    }
  },

  getAllCategories: async (categoryQuery: any, categoryPayLoad: any) => {
    let response: ApiResponse[] = [];

    if (categoryPayLoad?.isOldUser === false) {
      // Just for example purpose
      // If the user is not an old user, perform the API call as per multi-config requirements
      /*
      apiCallFunction().then(response => {
        // On successful API response, append cs_metadata to include the multi-config name and deletion status
        const responseData = {
          ...response,
          cs_metadata: {
            multiConfigName: configKey, // The name of the multi-config used
            isconfigdeleted: false, // Indicates that the configuration is not deleted
          }
        };
        return responseData;
      }).catch(error => {
        // In case of an error, return an object with cs_metadata indicating that the configuration was deleted
        return {
          id: productID,
          cs_metadata: {
            multiConfigName: configKey, // The name of the multi-config used
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
      return response as any;
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
      }&${root_config.SEARCH_URL_PARAMS}`,
      method: "GET",
      headers: getHeaders(key),
    });
  },
};
export default root_config;
