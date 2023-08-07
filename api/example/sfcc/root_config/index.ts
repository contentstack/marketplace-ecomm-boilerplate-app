const root_config: any = {
  API_BASE_URL: 'https://$.api.commercecloud.salesforce.com', // this api baseUrl is used in handler/index.js. Please replace the $ with the params?.shortcode value from config in handler
  URI_ENDPOINTS: {
    product: 'products',
    category: 'categories',
  },
  PRODUCT_URL_PARAMS: 'include=primary_image,variants,images',
};

export default root_config;
