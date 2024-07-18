/* eslint-disable */
import axios from "axios";
import localeTexts from "../common/locale/en-us";
import rootConfig from "../root_config";

// common function for an API call to your backend
const makeAnApiCall = async (url: any, method: any, data: any) => {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Access-Control-Allow-Origin": "*",
      },
    });

    return {
      error: false,
      data: rootConfig.returnUrl(response),
    };
  } catch (e: any) {
    console.error(e);
    const { status, data: resData } = e?.response || {};
    if (status === 500) {
      return {
        error: true,
        data: localeTexts.warnings.invalidCredentials.replace(
          "$",
          rootConfig.ecommerceEnv.APP_ENG_NAME
        ),
      };
    }
    if (status === 429) {
      return { error: true, data: resData };
    }
    return { error: true, data: localeTexts.warnings.somethingWentWrong };
  }
};

// get paginated products and categories
const request = (config: any, requestType: any, page = 1) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=${requestType}&page=${page}&limit=${config?.page_count}`,
    "POST",
    config
  );

// get all available categories
const requestCategories = (config: any) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=category`,
    "POST",
    config
  );

// get selected products/categories
const getSelectedIDs = async (config: any, type: any, selectedIDs: any) =>
  Array.isArray(selectedIDs) && selectedIDs?.length
    ? makeAnApiCall(
        `${process.env.REACT_APP_API_URL}?query=${type}&id:in=${
          selectedIDs?.reduce((str: any, i: any) => `${str}${i},`, "") || ""
        }`,
        "POST",
        config
      )
    : null;

// filter products with categories
const filter = async (config: any, type: any, selectedIDs: any) => {
  if (Array.isArray(selectedIDs) && selectedIDs.length) {
    const { apiUrl, requestData } = rootConfig.getSelectedCategoriesUrl(
      config,
      type,
      selectedIDs
    );
    return makeAnApiCall(apiUrl, "POST", requestData);
  }
  return null;
};
// search products and categories
const search = (
  config: any,
  keyword: any,
  page: any,
  limit: any,
  categories = []
) => {
  const { apiUrl, requestData } = rootConfig.generateSearchApiUrlAndData(
    config,
    keyword,
    page,
    limit,
    categories
  );

  return makeAnApiCall(apiUrl, "POST", requestData);
};

// Function to make the API call to fetch product data by ID
const getProductById = async (apiUrl: any, key: any, apiKey: any, id: any) => {
  // console.info("apiUrl", apiUrl, "apiKey", apiKey, "id", id);
  try {
    const response = await axios({
      url: `https://api.${apiUrl}/${key}/products/${id}`,
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${apiKey}`,
      },
    } as any);
    return response;
  } catch (error: any) {
    // console.info("error", error);
    return { error: true, message: error.message, id };
  }
};

export {
  getSelectedIDs,
  request,
  requestCategories,
  search,
  filter,
  getProductById,
};
