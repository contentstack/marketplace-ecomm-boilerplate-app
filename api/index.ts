import CryptoJS from "crypto-js";
import constants from "./constants";
import {
  getProductAndCategory,
  getById,
  getSelectedProdsAndCats,
  filterByCategory,
} from "./handler";
import root_config from "./root_config";

const _isEmpty: any = (val: any) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim().length);

const decrypt: any = (transitmessage: any, pass: any) => {
  const salt = CryptoJS?.enc?.Hex?.parse(transitmessage?.substr(0, 32));
  const iv = CryptoJS?.enc?.Hex?.parse(transitmessage?.substr(32, 32));
  const encrypted = transitmessage?.substring(64);

  const key = CryptoJS?.PBKDF2(pass, salt, {
    keySize: constants.DECRYPTION.keySize / 32,
    iterations: constants.DECRYPTION.iterations,
  });

  const decrypted = CryptoJS?.AES?.decrypt(encrypted, key, {
    iv,
    padding: CryptoJS?.pad?.Pkcs7,
    mode: CryptoJS?.mode?.CBC,
  });
  return decrypted?.toString(CryptoJS.enc.Utf8);
};

const handler: any = async ({ queryStringParameters: query, body }: any) => {
  let message: any;
  let statusCode = constants.HTTP_ERROR_CODES.OK;
  const configKeys: string[] = Object.keys(body);
  const configKeysLength: number = configKeys?.length;
  for (let i = 0; i < configKeysLength; i += 1) {
    const key: any = configKeys[i];
    const value: any = body[key];
    // body will have the config object
    if (root_config.SENSITIVE_CONFIG_KEYS.indexOf(key) > -1) {
      body[key] = decrypt(value, constants.DECRYPTION.password);
    }
  }
  try {
    console.info(constants.LOGS.REQ_BODY, body);
    console.info(constants.LOGS.QUERY_PARAMS, query);
    const resErr: any = new Error();
    if (_isEmpty(body)) {
      resErr.statusCode = constants.HTTP_ERROR_CODES.BAD_REQ;
      resErr.message = constants.HTTP_ERROR_TEXTS.QUERY_MISSING;

      throw resErr;
    }

    /** Below block of code is just for illustration.
     * Actuall logic of getting products or categories or any other data,
     * might change based on the ecommerce platform that you are using to integrate.
     * Please update the code accordingly.
     * */
    query.limit =
      query?.limit > constants.FETCH_PRODUCT_LIMIT ?
        constants.FETCH_PRODUCT_LIMIT
        : query?.limit;
    if (query["sku:in"] || query["id:in"])
      message = await getSelectedProdsAndCats(query, body);
    else if (query["categories:in"])
      message = await filterByCategory(query, body);
    else if (query?.id) message = await getById(query, body);
    else message = await getProductAndCategory(query, body);
    /** Above block of code is just for illustration.
     * Actuall logic of getting products or categories or any other data,
     * might change based on the ecommerce platform that you are using to integrate.
     * Please update the code accordingly.
     * */
  } catch (e: any) {
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
      authToken: "",
    },
    // body: JSON.stringify(message), // For deploying the code to AWS Lambda
    body: message, // For Localhost
  };
  return res;
};

export default handler;
