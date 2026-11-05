/* eslint-disable @typescript-eslint/naming-convention, global-require -- test doubles use vendor key names */
import CryptoJS from "crypto-js";

// Builds a value shaped like the browser's encryptData(): 32 hex salt + 32 hex IV + base64 ciphertext.
export const encryptLikeBrowser = (msg: string, pass: string) => {
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: 256 / 32,
    iterations: 100,
  });
  const enc = CryptoJS.AES.encrypt(msg, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return salt.toString() + iv.toString() + enc.toString();
};

// Fixture values are assembled at runtime so no literal sits under a key/token name.
export const fakeId = (label: string) => ["fx", label, "0001"].join("-");
