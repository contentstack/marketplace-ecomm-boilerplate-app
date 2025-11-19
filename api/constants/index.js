export default {
  JWT_EXPIRES_IN: "30m",
  REQ_TIMEOUT: 17 * 1000,
  EXTRACT_ID_REGX: /\(\d+\)/gm, // extracts the digits from the data as an ID for the error response
  HTTP_ERROR_CODES: {
    OK: 200,
    BAD_REQ: 400,
    NOT_FOUND: 404,
    SOMETHING_WRONG: 500,
    UNAUTHORIZED: 401,
  },
  HTTP_ERROR_TEXTS: {
    SAMPLE_WEBHOOK_RESPONSE: "This is a sample webhook response.",
    QUERY_MISSING: "Query string parameters are missing.",
    SOMETHING_WENT_WRONG: "Something went wrong, please try again later.",
    API_ERROR: "Error while making API call.",
    BAD_REQ: "Bad Request",
    AUTH_BAD_REQ: "Cannot process this request",
    AUTH_SUCCESS: "Request authorized.",
    JWT_ERROR: "app-token's session has been expired.",
    WEBHOOK_UNAUTHORIZED: "Unauthorized webhook request.",
  },
  FETCH_PRODUCT_LIMIT: 250,
  HTTP_RESPONSE_HEADERS: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "authToken",
  },
  LOGS: {
    QUERY_PARAMS: "Request's query-string params are: ",
    REQ_BODY: "Request's body: ",
    RESPONSE: "Final response is: ",
  },
  DECRYPTION: {
    keySize: 256,
    iterations: 100,
    password: "password#123",
  },
  CS_PUBLIC_KEY: "https://app.contentstack.com/.well-known/public-keys.json",
};
