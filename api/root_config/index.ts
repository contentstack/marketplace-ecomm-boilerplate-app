import { _makeApiCall, getById } from "../handler";
import {
  getByCategoryIdUrl,
  getUrl,
  extractCategories,
  getHeaders,
} from "./utilityFunctions";

/* eslint-disable @typescript-eslint/naming-convention */
const root_config: any = {
  API_BASE_URL: "https://my.example.com/$/v3/", // add the url of your commerce app api where $ is a value added through Users response
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

  getSingleProduct: async (data: any, body: any) => {
    const url = getUrl({ query: data?.query, id: data?.id }, body);
    const productResponse = await _makeApiCall({
      url,
      method: "GET",
      headers: getHeaders(body),
    });
    return productResponse;
  },

  getSelectedProductsById: async (data: any, body: any) => {
    let response;
    const idsArr = data?.["id:in"].split(",").filter((id: any) => id !== "");
    response = await Promise.all(
      idsArr?.map((id: any) => getById({ id, query: data?.query }, body))
    );
    return response;
  },

  getSelectedCategoriesById: async (query: any, body: any) => {
    return Promise.all(
      body?.selectedIDs?.map(async (category: any) => {
        const url = getByCategoryIdUrl(body, query.query, category);
        const categoryResponse = await _makeApiCall({
          url,
          method: "GET",
          headers: getHeaders(body),
        });
        categoryResponse.catalogId = category?.catalogId;
        categoryResponse.catalogVersionId = category?.catalogVersionId;
        return categoryResponse;
      })
    ).then((response) => response);
  },

  getSelectedProductsandCategories: (data: any, key: any) => {
    let url: string = root_config.getUrl(key, data?.query);
    const urlHasQueryParams: boolean = url.indexOf("?") > -1;
    url += data["id:in"] ?
      `${urlHasQueryParams ? "&" : "?"}id:in=${data["id:in"]}`
      : `${urlHasQueryParams ? "&" : "?"}sku:in=${data["sku:in"]}`;
    if (data?.query === "product") url += root_config.PRODUCT_URL_PARAMS;
    if (data?.limit) url += `&limit=${data?.limit}`;
    // return url;
    return _makeApiCall({
      url,
      method: "GET",
      headers: getHeaders(key),
    });
  },

  getAllProducts: async (data: any, body: any) => {
    // implement for getting all products
    let response = await _makeApiCall({
      url: getUrl(data, body),
      method: "GET",
      headers: getHeaders(body),
    });
    return response;
  },

  getAllCategories: async (data: any, body: any) => {
    // implement for getting all categories
    let response = await _makeApiCall({
      url: getUrl(data, body),
      method: "GET",
      headers: getHeaders(body),
    });
    return { catalogs: extractCategories(response) };
  },

  getAllProductsAndCategories: async (data: any, body: any) => {
    let response = await _makeApiCall({
      url: getUrl(data, body),
      method: "GET",
      headers: getHeaders(body),
    });
    data?.query === "category" ?
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

const getSingleProduct = async (data: any, body: any) => {
  const url = getUrl({ query: data.query, id: data.id }, body);
  return await _makeApiCall({
    url,
    method: "GET",
    headers: getHeaders(body),
  });
};

const getSelectedProductsById = async (data: any, body: any) => {
  const idsArr = data?.["id:in"]?.split(",").filter((id: any) => id !== "");
  return await Promise.all(
    idsArr?.map((id: any) => getById({ id, query: data?.query }, body))
  );
};

const getSelectedCategoriesById = async (query: any, body: any) => {
  return Promise.all(
    body?.selectedIDs?.map(async (category: any) => {
      const url = getByCategoryIdUrl(body, query.query, category);
      const categoryResponse = await _makeApiCall({
        url,
        method: "GET",
        headers: getHeaders(body),
      });
      categoryResponse.catalogId = category?.catalogId;
      categoryResponse.catalogVersionId = category?.catalogVersionId;
      return categoryResponse;
    })
  );
};

const getSelectedProductsandCategories = async (data: any, key: any) => {
  let url: string = root_config.getUrl(key, data?.query);
  const urlHasQueryParams: boolean = url.indexOf("?") > -1;
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
};

const getAllProducts = async (data: any, body: any) => {
  return await _makeApiCall({
    url: getUrl(data, body),
    method: "GET",
    headers: getHeaders(body),
  });
};

const getAllCategories = async (data: any, body: any) => {
  const response = await _makeApiCall({
    url: getUrl(data, body),
    method: "GET",
    headers: getHeaders(body),
  });
  return { catalogs: extractCategories(response) };
};

const getAllProductsAndCategories = async (data: any, body: any) => {
  const response = await _makeApiCall({
    url: getUrl(data, body),
    method: "GET",
    headers: getHeaders(body),
  });
  return data?.query === "category" ?
    { catalogs: root_config.extractCategories(response) }
    : response;
};

const filterProductsByCategory = async (data: any, key: any) => {
  return _makeApiCall({
    url: `${root_config.getUrl({ query: data?.query }, key)}?categories:in=${
      data["categories:in"]
    }&${root_config.PRODUCT_URL_PARAMS}`,
    method: "GET",
    headers: getHeaders(key),
  });
};

export default root_config;
