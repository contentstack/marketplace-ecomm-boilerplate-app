// Import necessary modules
import constants from "./constants/index.js";
import apiHandler from "./handler/index.js";
import utils from "./utils/index.js";

// Main handler function for processing requests
export default async function handler(request, response) {
  const { query, body } = request;
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
      message = await apiHandler.getSelectedProductsAndCategories(
        query,
        newBody
      );
    } else if (query?.["categories:in"]) {
      message = await apiHandler.filterByCategory(query, newBody);
    } else if (query?.id) {
      message = await apiHandler.getProductByID(query, newBody);
    } else if (query?.type === "isApiValidationEnabled") {
      message = await apiHandler.getApiValidationForConfigPageKeys(
        newBody,
        query
      );
    } else {
      message = await apiHandler.getAllProductsAndCategories(query, newBody);
    }
  } catch (e) {
    console.error("Error caught in handler:", e);
    statusCode =
      e?.response?.status ?? constants.HTTP_ERROR_CODES.SOMETHING_WRONG;
    message =
      e?.response?.data?.message ??
      constants.HTTP_ERROR_TEXTS.SOMETHING_WENT_WRONG;
    console.error(
      `Error: stack_api_key: ${query?.stack_apiKey}, status_code: ${statusCode}, error_message: ${message}, stack: ${e?.stack}`
    );
  }

  if (process.env.NODE_ENV === "development")
    return {
      statusCode,
      body: message,
    };
  else response.status(statusCode).json(message);
}
