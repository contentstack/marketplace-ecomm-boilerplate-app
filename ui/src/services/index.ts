import axios from "axios";
import localeTexts from "../common/locale/en-us";
import rootConfig from "../root_config";
import categoryConfig from "../root_config/categories";

// common function for an API call to your backend
const makeAnApiCall = async (url: any, method: any, data: any) => {
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
const getProductandCategory = (
  config: any,
  requestType: any,
  skip: any,
  limit: any,
  isOldUser: any,
  multiConfigDropDown: any
) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=${requestType}&skip=${skip}&limit=${limit}`,
    "POST",
    { config, isOldUser, multiConfigDropDown }
  );

// get all available categories
const requestCategories = (config: any) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=category`,
    "POST",
    config
  );

// get selected products/categories
const getSelectedIDs = async (
  config: any,
  type: any,
  selectedIDs: any,
  isOldUser: any
) => {
  const ids =    isOldUser === true ? selectedIDs.join(",") : JSON.stringify(selectedIDs);
  const apiUrl = `${process.env.REACT_APP_API_URL}?query=${type}&id:in=${ids}&isOldUser=${isOldUser}`;
  return makeAnApiCall(apiUrl, "POST", config);
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
      ? Array.isArray(selectedIDs) && selectedIDs.length
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
  categories = []
) => {
  const { apiUrl, requestData } = rootConfig.generateSearchApiUrlAndData(
    config,
    keyword,
    skip,
    limit,
    categories
  );

  return makeAnApiCall(apiUrl, "POST", requestData);
};

// Function to make the API call to fetch product data by ID
const getProductById = async (apiUrl: any, key: any, apiKey: any, id: any) => {
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
    return { error: true, message: error.message, id };
  }
};

export {
  getSelectedIDs,
  getProductandCategory,
  requestCategories,
  search,
  getProductById,
  getCustomCategoryData,
};
