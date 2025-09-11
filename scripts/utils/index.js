const axios = require("axios");
const constants = require("../constants");
const fs = require("fs");
const appManifest = require("../app-manifest.json");

const makeApiCall = async ({ url, method, headers, data }) => {
  try {
    const res = await axios({
      url,
      method,
      timeout: 60 * 1000,
      headers,
      ...(["PUT", "POST", "DELETE", "PATCH"].includes(method) && {
        data,
      }),
    });

    return res?.data;
  } catch (error) {
    throw error.response.data || error.message || error;
  }
};

const safePromise = (promise, errorText) =>
  promise
    .then((res) => [null, res])
    .catch((err) => {
      console.error(errorText);
      return [err];
    });

const getBaseUrl = (region) => {
  const baseUrl = constants.BASE_URLS.find((item) => item.region === region);
  return baseUrl ? baseUrl.url : constants.BASE_URLS[0].url;
};

const getDeveloperhubBaseUrl = (region) =>
  constants.DEVELOPERHUB_BASE_URLS.find((url) => url.region === region)?.url ||
  constants.DEVELOPERHUB_BASE_URLS[0].url;

const updateAppManifest = (name, uid) => {
  fs.writeFileSync(
    "app-manifest.json",
    JSON.stringify({ ...appManifest, name, uid }, null, 2)
  );
};

module.exports = {
  makeApiCall,
  safePromise,
  getBaseUrl,
  getDeveloperhubBaseUrl,
  updateAppManifest,
};
