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
      data: {
        items: response?.data?.data, // assign this to the key that contains your data
        meta: {
          total: response?.data?.meta?.pagination?.total, // assign this to the key that specifies the total count of the data fetched
          // eslint-disable-next-line @typescript-eslint/naming-convention
          current_page: response?.data?.meta?.pagination?.current_page, // assign this to the key that corresponds to the current page
        },
      },
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
const request = (config: any, page = 1) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=${
      config?.type === "category" ? "category" : "product"
    }&page=${page}&limit=${rootConfig.ecommerceEnv.FETCH_PER_PAGE ?? 20}`,
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
const filter = async (config: any, type: any, selectedIDs: any) =>
  Array.isArray(selectedIDs) && selectedIDs?.length ?
    makeAnApiCall(
        `${process.env.REACT_APP_API_URL}?query=${type}&categories:in=${
          selectedIDs?.reduce((str: any, i: any) => `${str}${i},`, "") || ""
        }`,
        "POST",
        config
      )
    : null;

// search products and categories
const search = (config: any, keyword: any) =>
  makeAnApiCall(
    `${process.env.REACT_APP_API_URL}?query=${
      config?.type === "category" ? "category" : "product"
    }&searchParam=keyword=${keyword}`,
    "POST",
    config
  );

export { getSelectedIDs, request, requestCategories, search, filter };
