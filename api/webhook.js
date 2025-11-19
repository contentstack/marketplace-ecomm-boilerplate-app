/*
This file contains the main handler function for processing webhook requests.
Please implement this API endpoint for all the app's webhook calls(install, update, uninstall) to handle config info
*/

// Import necessary modules
import constants from "./constants/index.js";
import utils from "./utils/index.js";

// Main handler function for processing requests
export default async function handler(request, response) {
  const { query, body } = request;
  let message;
  let statusCode = constants.HTTP_ERROR_CODES.OK;

  try {
    console.info(constants.LOGS.REQ_BODY, JSON.stringify(body));
    console.info(constants.LOGS.QUERY_PARAMS, query);

    //webhook signature verification
    if (!(await utils.webhookVerify(request))) {
      throw {
        message: constants.HTTP_ERROR_TEXTS.WEBHOOK_UNAUTHORIZED,
        statusCode: constants.HTTP_ERROR_CODES.UNAUTHORIZED,
      };
    }

    message = constants.HTTP_ERROR_TEXTS.SAMPLE_WEBHOOK_RESPONSE;
  } catch (e) {
    console.error("Error caught in handler:", e);
    statusCode =
      e?.response?.status ||
      e?.statusCode ||
      constants.HTTP_ERROR_CODES.SOMETHING_WRONG;
    message =
      e?.response?.data?.message ||
      e?.message ||
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
