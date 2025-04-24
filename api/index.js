// Import necessary modules
const constants = require("./constants");
const handler = require("./handler");
const utils = require("./utils");

// Main handler function for processing requests
exports.handler = async ({ queryStringParameters: query, body }) => {
  let message;
  let statusCode = constants.HTTP_ERROR_CODES.OK;

  const newBody = utils.processRequestBody(
    typeof body === "string" ? JSON.parse(body) : body
  );

  try {
    console.info(constants.LOGS.REQ_BODY, body);
    console.info(constants.LOGS.QUERY_PARAMS, query);

    // Check if the body is empty and throw an error if it is
    if (utils._isEmpty(newBody)) {
      throw {
        statusCode: constants.HTTP_ERROR_CODES.BAD_REQ,
        message: constants.HTTP_ERROR_TEXTS.QUERY_MISSING,
      };
    }

    // Determine request type and process accordingly
    if (query?.["sku:in"] || query?.["id:in"]) {
      message = await handler.getSelectedProductsAndCategories(query, newBody);
    } else if (query?.["categories:in"]) {
      message = await handler.filterByCategory(query, newBody);
    } else if (query?.id) {
      message = await handler.getProductByID(query, newBody);
    } else if (query?.type === "isApiValidationEnabled") {
      message = await handler.getApiValidationForConfigPageKeys(newBody, query);
    } else {
      message = await handler.getAllProductsAndCategories(query, newBody);
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
