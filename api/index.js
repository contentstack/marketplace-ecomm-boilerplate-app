const CryptoJS = require("crypto-js");
const constants = require("./constants");
const {
  getProductAndCategory,
  getById,
  getSelectedProdsAndCats,
  filterByCategory,
} = require("./handler");

const _isEmpty = (val) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim().length);

// decryption
const keySize = constants.DECRYPTION.keySize;
const iterations = constants.DECRYPTION.iterations;
const password = `password#123`;
const decrypt = (transitmessage, pass) => {
  const salt = CryptoJS?.enc?.Hex?.parse(transitmessage?.substr(0, 32));
  const iv = CryptoJS?.enc?.Hex?.parse(transitmessage?.substr(32, 32));
  const encrypted = transitmessage?.substring(64);

  const key = CryptoJS?.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const decrypted = CryptoJS?.AES?.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS?.pad?.Pkcs7,
    mode: CryptoJS?.mode?.CBC,
  });
  return decrypted?.toString(CryptoJS.enc.Utf8);
};

exports.handler = async ({ queryStringParameters: query, body }) => {
  let message;
  let statusCode = constants.HTTP_ERROR_CODES.OK;
  for (const [key, value] of Object.entries(body)) {
    if (key === "store_id" || key === "auth_token") {
      body[key] = decrypt(value, password);
    }
  }
  try {
    console.info(constants.LOGS.REQ_BODY, body);
    console.info(constants.LOGS.QUERY_PARAMS, query);
    let resErr = new Error();
    if (_isEmpty(body)) {
      resErr.statusCode = constants.HTTP_CODES.BAD_REQ;
      resErr.message = constants.HTTP_ERROR_TEXTS.QUERY_MISSING;

      throw resErr;
    }

    query.limit =
      query?.limit > constants.BC_FETCH_PRODUCT_LIMIT ?
        constants.BC_FETCH_PRODUCT_LIMIT
        : query?.limit;
    if (query["sku:in"] || query["id:in"])
      message = await getSelectedProdsAndCats(query, body);
    else if (query["categories:in"])
      message = await filterByCategory(query, body);
    else {
      if (query?.id) message = await getById(query, body);
      else message = await getProductAndCategory(query, body);
    }
  } catch (e) {
    statusCode = e?.statusCode || constants.HTTP_ERROR_CODES.SOMETHING_WRONG;
    message = e?.message || constants.HTTP_ERROR_TEXTS.SOMETHING_WENT_WRONG;
    console.error(
      `Error: stack_api_key: ${query?.stack_apiKey}, status_code: ${statusCode}, error_message: ${message}`
    );
  }
  const res = {
    statusCode,
    headers: {
      ...constants.HTTP_RESPONSE_HEADERS,
      authToken: body?.authToken ?? "",
    },
    // body: JSON.stringify(message), // for lambda
    body: message, // for localhost
  };
  console.info("RESPONSE: ", res);
  return res;
};
