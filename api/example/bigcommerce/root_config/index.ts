/* eslint-disable @typescript-eslint/naming-convention */
const root_config: any = {
  API_BASE_URL: "https://api.bigcommerce.com/stores/$/v3/", // add the url of your commerce app api where $ is a value added through Users response
  URI_ENDPOINTS: {
    product: "catalog/products",
    category: "catalog/categories",
  },
  PRODUCT_URL_PARAMS: "&include=primary_image,variants,images",

  SENSITIVE_CONFIG_KEYS: ["store_id", "auth_token"],

  getHeaders: (key?: any) => ({
    "Content-Type": "application/json",
    "X-Auth-Token": key?.configField2,
  }),

  getAuthToken: (key?: any) => {
    const authToken: any = key?.configField2 ?? "";
    return authToken;
  },

  getUrl: (
    key: any,
    query: any,
    searchParam?: any,
    searchCategories?: any,
    id?: any,
    page?: any,
    limit?: any
  ) => {
    let url =
      root_config.API_BASE_URL.replace("$", key?.configField1) +
      root_config.URI_ENDPOINTS[query];
    url += `?page=${page}&limit=${limit}`;
    if (searchParam) {
      url += `${encodeURI(searchParam)}&`;
      if (searchCategories) url += `categories:in=${searchCategories}&`;
    } else if (id) url += `/${id}?`;
    if (query === "product" && root_config.PRODUCT_URL_PARAMS)
      url += root_config.PRODUCT_URL_PARAMS;
    return url;
  },

  getSelectedProductandCatUrl: (data: any, key: any) => {
    let url: string =
      root_config.API_BASE_URL.replace("$", key?.configField1) +
      root_config.URI_ENDPOINTS[data?.query];
    const urlHasQueryParams: boolean = url.indexOf("?") > -1;
    url += data["id:in"] ?
      `${urlHasQueryParams ? "&" : "?"}id:in=${data["id:in"]}`
      : `${urlHasQueryParams ? "&" : "?"}sku:in=${data["sku:in"]}`;

    if (data?.query === "product") url += root_config.PRODUCT_URL_PARAMS;
    if (data?.limit) url += `&limit=${data?.limit}`;

    return url;
  },
};

export default root_config;
