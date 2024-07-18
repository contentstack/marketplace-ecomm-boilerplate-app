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
const request = (config: any, requestType: any, skip: any, limit: any) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=${requestType}&skip=${skip}&limit=${limit}`,
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
  Array.isArray(selectedIDs) && selectedIDs?.length ?
    makeAnApiCall(
        `${process.env.REACT_APP_API_URL}?query=${type}&id:in=${
          selectedIDs?.reduce((str: any, i: any) => `${str}${i},`, "") || ""
        }`,
        "POST",
        config
      )
    : null;

// runes when categoryConfig.customCategoryStructure is true
const getCustomCategoryData = async (
  config: any,
  type: any,
  selectedIDs: any
) => {
  if (Array.isArray(selectedIDs) && selectedIDs.length) {
    const { apiUrl, requestData } = categoryConfig.fetchCustomCategoryData(
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
  skip: any,
  limit: any,
  categories = []
) => {
  console.info("search", config, keyword, skip, limit, categories);
  const { apiUrl, requestData } = rootConfig.generateSearchApiUrlAndData(
    config,
    keyword,
    skip,
    limit,
    categories
  );

  return makeAnApiCall(apiUrl, "POST", requestData);
};

export {
  getSelectedIDs,
  request,
  requestCategories,
  search,
  getCustomCategoryData,
};
