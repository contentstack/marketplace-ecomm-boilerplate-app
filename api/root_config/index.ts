/* eslint-disable */
/* @typescript-eslint/naming-convention */
const root_config: any = {
  API_BASE_URL: "https://my.example.com/$/v3/", // add the url of your commerce app api where $ is a value added through Users response
  URI_ENDPOINTS: {
    product: "catalog/products",
    category: "catalog/categories",
  },
  PRODUCT_URL_PARAMS: "",

  SENSITIVE_CONFIG_KEYS: "",

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHeaders: (key?: any) => ({
    "Content-Type": "application/json",
  }),

  getAuthToken: (key?: any) => {
    const authToken: any = key?.configField2 ?? "";
    return authToken;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUrl: (
    key?: any,
    query?: any,
    searchParam?: any,
    searchCategories?: any,
    id?: any,
    page?: any,
    limit?: any
  ) => {
    // Add your app base_url and the necessary endpoints here
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSelectedProductandCatUrl: (data: any, key: any) => {
    // Add the url for fetching the data from selector page to the custom field here
  },
};

export default root_config;
