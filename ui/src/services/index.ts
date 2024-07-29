import axios, { Method } from "axios";
import localeTexts from "../common/locale/en-us";
import rootConfig from "../root_config";
import categoryConfig from "../root_config/categories";

// common function for an API call to your backend
const makeAnApiCall = async (url: string, method: Method, data: any) => {
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
      data: rootConfig.getFormattedResponse(response),
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
const search = (config: any, keyword: any, skip: any, limit: any) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=${config?.type}&searchParam=keyword=${keyword}&skip=${skip}&limit=${limit}`,
    "POST",
    config
  );

export {
  getSelectedIDs,
  getProductandCategory,
  requestCategories,
  search,
  getCustomCategoryData,
};
