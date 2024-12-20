// Import necessary modules
const CryptoJS = require("crypto-js");
const root_config = require("../root_config");

// Utility function to check if a value is empty
exports._isEmpty = (val) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim()?.length);

// Function to decrypt a value
exports.decrypt = (value) => {
  try {
    const decryptionKey = `${process.env.DECRYPTION_KEY}`;
    const bytes = CryptoJS.AES.decrypt(value, decryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed:", e);
    return value; // Return as is if decryption fails
  }
};

// Function to process and decrypt sensitive keys in a request body
exports.processRequestBody = (requestBody) => {
  const decryptSensitiveKeys = (obj) => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map((item) => decryptSensitiveKeys(item));
      } else {
        const result = {};
        Object.keys(obj).forEach((key) => {
          if (root_config?.SENSITIVE_CONFIG_KEYS?.includes(key)) {
            result[key] = exports.decrypt(obj?.[key]);
          } else if (typeof obj?.[key] === "object") {
            result[key] = decryptSensitiveKeys(obj?.[key]);
          } else {
            result[key] = obj?.[key];
          }
        });
        return result;
      }
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
