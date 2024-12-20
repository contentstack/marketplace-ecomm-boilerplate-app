// Import necessary modules
const CryptoJS = require("crypto-js");
const root_config = require("./root_config");
const constants = require("./constants");
const {
  getAllProductsAndCategories,
  getProductByID,
  getSelectedProductsAndCategories,
  filterByCategory,
  getApiValidationForConfigPageKeys,
} = require("./handler");

// Utility function to check if a value is empty
exports._isEmpty = (val) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim()?.length);

// Function to decrypt a value
exports.decrypt = (value) => {
  try {
    const decryptionKey = `${process.env.DECRYPTION_KEY}`;
    const bytes = CryptoJS.AES.decrypt(value, decryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed:", e);
    return value; // Return as is if decryption fails
  }
};

// Function to process and decrypt sensitive keys in a request body
exports.processRequestBody = (requestBody) => {
  const decryptSensitiveKeys = (obj) => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map((item) => decryptSensitiveKeys(item));
      } else {
        const result = {};
        Object.keys(obj).forEach((key) => {
          if (root_config?.SENSITIVE_CONFIG_KEYS?.includes(key)) {
            result[key] = exports.decrypt(obj?.[key]);
          } else if (typeof obj?.[key] === "object") {
            result[key] = decryptSensitiveKeys(obj?.[key]);
          } else {
            result[key] = obj?.[key];
          }
        });
        return result;
      }
    }
    return obj;
  };

  // Decrypt multi_config_keys if present
  if (requestBody?.multi_config_keys) {
    requestBody.multi_config_keys = decryptSensitiveKeys(
      requestBody.multi_config_keys
    );
  }

  // Decrypt custom_keys if present
  if (requestBody?.custom_keys) {
    requestBody.custom_keys = decryptSensitiveKeys(requestBody.custom_keys);
  }

  return requestBody;
};

// Main handler function for processing requests
exports.handler = async ({ queryStringParameters: query, body }) => {
  let message;
  let statusCode = constants.HTTP_ERROR_CODES.OK;

  //eslint-disable-next-line no-param-reassign
  body = processRequestBody(body);

  //eslint-disable-next-line no-param-reassign
  if (typeof body === "string") body = JSON.parse(body);

  try {
    console.info(constants.LOGS.REQ_BODY, body);
    console.info(constants.LOGS.QUERY_PARAMS, query);

    // Check if the body is empty and throw an error if it is
    if (exports._isEmpty(body)) {
      throw {
        statusCode: constants.HTTP_ERROR_CODES.BAD_REQ,
        message: constants.HTTP_ERROR_TEXTS.QUERY_MISSING,
      };
    }

    // Determine request type and process accordingly
    if (query?.["sku:in"] || query?.["id:in"]) {
      message = await getSelectedProductsAndCategories(query, body);
    } else if (query?.["categories:in"]) {
      message = await filterByCategory(query, body);
    } else if (query?.id) {
      message = await getProductByID(query, body);
    } else if (query?.type === "isApiValidationEnabled") {
      message = await getApiValidationForConfigPageKeys(body, query);
    } else {
      message = await getAllProductsAndCategories(query, body);
    }
  } catch (e) {
    statusCode =
      e?.response?.status ?? constants.HTTP_ERROR_CODES.SOMETHING_WRONG;
    message =
      e?.response?.data?.message ??
      constants.HTTP_ERROR_TEXTS.SOMETHING_WENT_WRONG;
    console.error(
      `Error: stack_api_key: ${query?.stack_apiKey}, status_code: ${statusCode}, error_message: ${message}, stack: ${e?.stack}`
    );
  }

  return {
    statusCode,
    headers: {
      ...constants.HTTP_RESPONSE_HEADERS,
      authToken: "",
    },
    body: message, // For Localhost or JSON.stringify(message) for AWS Lambda
  };
};
