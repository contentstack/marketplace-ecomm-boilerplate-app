import constants from "./constants";
import {
  getAllProductsAndCategories,
  getProductByID,
  getSelectedProductsAndCategories,
  filterByCategory,
  getApiValidationForConfigPageKeys,
} from "./handler";
import { processRequestBody, _isEmpty } from "./utils";

/**
 * Main handler function for processing requests.
 * The logic here determines the type of request and routes it to the appropriate function.
 */
const handler: any = async ({ queryStringParameters: query, body }: any) => {
  let message: any;
  let statusCode = constants.HTTP_ERROR_CODES.OK;
  // eslint-disable-next-line no-param-reassign
  body = processRequestBody(body);
    // eslint-disable-next-line no-param-reassign
  if (typeof body === "string") body = JSON.parse(body);
  try {
    console.info(constants.LOGS.REQ_BODY, body);
    console.info(constants.LOGS.QUERY_PARAMS, query);

    // Check if the body is empty and throw an error if it is
    if (_isEmpty(body)) {
      throw {
        statusCode: constants.HTTP_ERROR_CODES.BAD_REQ,
        message: constants.HTTP_ERROR_TEXTS.QUERY_MISSING,
      };
    }

    // Determine request type and process accordingly
    if (query?.["sku:in"] || query?.["id:in"]) {
      // Request for selected products or categories
      message = await getSelectedProductsAndCategories(query, body);
    } else if (query?.["categories:in"]) {
      // Filter products by categories
      message = await filterByCategory(query, body);
    } else if (query?.id) {
      // Get a particular product by ID
      message = await getProductByID(query, body);
    } else if (query?.type === "isApiValidationEnabled") {
      message = await getApiValidationForConfigPageKeys(body, query);
    } else {
      // Get all products and categories
      message = await getAllProductsAndCategories(query, body);
    }
  } catch (e: any) {
    statusCode =
      e?.response?.status ?? constants.HTTP_ERROR_CODES.SOMETHING_WRONG;
    message =
      e?.response?.data?.message ??
      constants.HTTP_ERROR_TEXTS.SOMETHING_WENT_WRONG;
    console.error(
      `Error: stack_api_key: ${query?.stack_apiKey}, status_code: ${statusCode}, error_message: ${message}, stack: ${e?.stack}`
    );
  }
  const res = {
    statusCode: statusCode,
    headers: {
      ...constants.HTTP_RESPONSE_HEADERS,
      authToken: "",
    },
    // body: JSON.stringify(message), // For deploying the code to AWS Lambda
    body: message, // For Localhost
  };

  return res;
};

export default handler;
