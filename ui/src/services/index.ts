import axios from "axios";
import localeTexts from "../common/locale/en-us";
import rootConfig from "../root_config";

// common function for an API call to your backend
const makeAnApiCall = async (
  url: any,
  method: any,
  data: any,
  config?: any
) => {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Access-Control-Allow-Origin": "*",
        apikey: config?.configField5,
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
  Array.isArray(selectedIDs) && selectedIDs?.length ?
    makeAnApiCall(
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

export { getSelectedIDs, request, requestCategories, search, filter };
