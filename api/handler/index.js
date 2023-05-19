/* you can make changes in this file and the functions as per your api requirements */

const axios = require("axios");
const constants = require("../constants");
const root_config = require("../root_config");

const _getHeaders = (authToken) => ({
    "Content-Type": "application/json",
    "X-Auth-Token": authToken,
});

const _getApiOptions = ({ page, limit, query, searchParam, id }, key) => {
    let url = `${root_config.API_BASE_URL}${root_config.URI_ENDPOINTS[query]
        }`;

    if (searchParam) url += `?${searchParam}&`;
    else {
        if (id) url += `/${id}?`;
        else url += `?page=${page}&limit=${limit}&`;
    }
    if (query === "product" && root_config.PRODUCT_URL_PARAMS) url += root_config.PRODUCT_URL_PARAMS;
    return { url, method: "GET", headers: _getHeaders(key?.auth_token) };
};

// commonx function for making third party API calls
// you can modify it as per your third party service response
const _makeApiCall = async (opts) => {
    try {
        const res = await axios({ ...opts, timeout: constants.REQ_TIMEOUT });
        return res?.data;
    } catch (e) {
        if (e?.response?.status === constants.HTTP_ERROR_CODES.NOT_FOUND) {
            return {
                data: {
                    id: e?.response?.data?.title?.match(constants.EXTRACT_ID_REGX)[0],
                    error: e?.response?.data?.title,
                },
            };
        }
        console.error(constants.HTTP_ERROR_TEXTS.API_ERROR);
        console.error(e);
        throw e;
    }
};

// get all products and categories
const getProductAndCategory = (data, key) =>
    _makeApiCall(_getApiOptions(data, key));

// get a particular product
const getById = ({ id, query }, key) =>
    _makeApiCall(_getApiOptions({ id, query }, key));

// get an array of selected products and categories
const getSelectedProdsAndCats = (data, key) => {
    let url = `${root_config.API_BASE_URL}${root_config.URI_ENDPOINTS[data?.query]
        }`;

    url += data["id:in"] ?
        `?id:in=${data["id:in"]}`
        : `?sku:in=${data["sku:in"]}`;
    if (data?.query === "product") url += `&${root_config.PRODUCT_URL_PARAMS}`;

    return _makeApiCall({
        url,
        method: "GET",
        headers: _getHeaders(key?.auth_token),
    });
};

// filter products as per categories
const filterByCategory = (data, key) =>
    _makeApiCall({
        url: `${root_config.API_BASE_URL}${root_config.URI_ENDPOINTS[data?.query]
            }?categories:in=${data["categories:in"]}&${root_config.PRODUCT_URL_PARAMS}`,
        method: "GET",
        headers: _getHeaders(key?.auth_token),
    });

module.exports = {
    getProductAndCategory,
    getById,
    getSelectedProdsAndCats,
    filterByCategory,
};
