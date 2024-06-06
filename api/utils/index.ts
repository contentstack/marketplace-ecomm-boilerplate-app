import CryptoJS from "crypto-js";
import constants from "../constants";

export const _isEmpty: any = (val: any) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim().length);

export const decrypt: any = (transitmessage: any, pass: any) => {
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
