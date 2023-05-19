module.exports = {
    API_BASE_URL : "https://$/occ/v2/", // this api baseUrl is used in handler/index.js. Please replace the $ with the baseURL value from config in handler
    URI_ENDPOINTS: {
        product: "products",
        category: "catalogs",
    },
    PRODUCT_URL_PARAMS: "/search",
    FIELDS_URL: "fields=FULL"
}