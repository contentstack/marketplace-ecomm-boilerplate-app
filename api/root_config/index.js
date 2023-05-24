module.exports = {
    API_BASE_URL : "https://api.examplecommerce.com/stores/$/v3/", // add the url of your commerce app api
    URI_ENDPOINTS: {
        product: "catalog/products",
        category: "catalog/categories",
    },
    PRODUCT_URL_PARAMS: "include=primary_image,variants,images",
}