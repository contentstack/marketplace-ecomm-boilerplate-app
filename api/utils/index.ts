import CryptoJS from "crypto-js";
import root_config from "../root_config";

export const _isEmpty: any = (val: any) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim().length);

export const decrypt = (value: any) => {
  try {
    const decryptionKey = `${process.env.DECRYPTION_KEY}`;
    const bytes = CryptoJS.AES.decrypt(value, decryptionKey); // Replace 'yourEncryptionKey' with your actual key
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed:", e);
    return value; // Return as is if decryption fails
  }
};

export const processRequestBody = (requestBody: any): any => {
  const decryptSensitiveKeys = (obj: any): any => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map((item) => decryptSensitiveKeys(item));
      } else {
        const result: any = {};
        Object.keys(obj).forEach((key) => {
          if (root_config?.SENSITIVE_CONFIG_KEYS?.includes(key)) {
            result[key] = decrypt(obj[key]);
          } else if (typeof obj[key] === "object") {
            result[key] = decryptSensitiveKeys(obj[key]);
          } else {
            result[key] = obj[key];
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
