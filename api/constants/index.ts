const constants: any = {
  REQ_TIMEOUT: 17 * 1000,
  EXTRACT_ID_REGX: /(\d+)/gm, // extracts the digits from the data as an ID for the error response
  HTTP_ERROR_CODES: {
    OK: 200,
    BAD_REQ: 400,
    NOT_FOUND: 404,
    SOMETHING_WRONG: 500,
  },
  HTTP_ERROR_TEXTS: {
    QUERY_MISSING: 'Query string parameters are missing.',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again later.',
    API_ERROR: 'Error while making API call.',
    BAD_REQ: 'Bad Request',
  },
  FETCH_PRODUCT_LIMIT: 250,
  HTTP_RESPONSE_HEADERS: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Access-Control-Allow-Origin': '*',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-type': 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Access-Control-Allow-Headers': 'Content-Type',

  },
  LOGS: {
    QUERY_PARAMS: "Request's query-string params are: ",
    REQ_BODY: "Request's body: ",
    RESPONSE: 'Final response is: ',
  },
  DECRYPTION: {
    keySize: 256,
    iterations: 100,
    password: 'password#123',
  },
};

export default constants;
