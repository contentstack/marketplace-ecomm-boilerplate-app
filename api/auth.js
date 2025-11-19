/*
This file contains the main handler function for authorizing API requests.
*/

// Import necessary modules
import constants from "./constants/index.js";
import utils from "./utils/index.js";

// Main handler function for processing requests
export default async function handler(request, response) {
  const { query, method } = request;
  let message;
  let statusCode = constants.HTTP_ERROR_CODES.OK;

  try {
    const appToken = request.headers?.["app-token"] || "";
    if (method !== "POST" || !appToken) {
      throw {
        message: constants.HTTP_ERROR_TEXTS.AUTH_BAD_REQ,
        statusCode: constants.HTTP_ERROR_CODES.BAD_REQ,
      };
    }
    try {
      const {
        app_uid,
        installation_uid,
        organization_uid,
        region,
        user_uid,
        stack_api_key,
      } = await utils.verifyRequest(appToken);
      const authToken = utils.generateJwt({
        app_uid,
        installation_uid,
        organization_uid,
        region,
        user_uid,
        stack_api_key,
      });

      message = {
        msg: constants.HTTP_ERROR_TEXTS.AUTH_SUCCESS,
        authtoken: authToken,
      };
    } catch (err) {
      console.error(err);
      message = constants.HTTP_ERROR_TEXTS.JWT_ERROR;
      statusCode = constants.HTTP_ERROR_CODES.BAD_REQ;
    }
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
      `Error: status_code: ${statusCode}, error_message: ${message}, stack: ${e?.stack}`
    );
  }

  if (process.env.NODE_ENV === "development")
    return {
      statusCode,
      body: message,
    };
  else response.status(statusCode).json(message);
}
