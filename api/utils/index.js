// Import necessary modules
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import handler from "../handler/index.js";
import constants from "../constants/index.js";
import root_config from "../root_config/index.js";

// Utility function to check if a value is empty
const _isEmpty = (val) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim()?.length);

// Function to decrypt a value
const decrypt = (value) => {
  try {
    const bytes = CryptoJS.AES.decrypt(value, `${process.env.DECRYPTION_KEY}`);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed:", e);
    return value; // Return as is if decryption fails
  }
};

// Function to process and decrypt sensitive keys in a request body
const processRequestBody = (requestBody) => {
  const decryptSensitiveKeys = (obj) => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj))
        return obj.map((item) => decryptSensitiveKeys(item));

      const result = {};
      Object.keys(obj).forEach((key) => {
        result[key] = root_config?.SENSITIVE_CONFIG_KEYS?.includes(key) ?
          decrypt(obj?.[key])
          : typeof obj?.[key] === "object" ?
          decryptSensitiveKeys(obj?.[key])
          : obj?.[key];
      });
      return result;
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

const verifyRequest = async (appToken) =>
  jwt.verify(appToken, await handler.getCSPublicKey());

const generateJwt = (jwtPayload) => {
  return jwt.sign(jwtPayload, process.env.JWT_API_SECRET, {
    expiresIn: constants.JWT_EXPIRES_IN,
  });
};

const verifyAuthToken = (authToken) => {
  try {
    jwt.verify(authToken, process.env.JWT_API_SECRET);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default {
  _isEmpty,
  decrypt,
  processRequestBody,
  verifyRequest,
  generateJwt,
  verifyAuthToken,
};
