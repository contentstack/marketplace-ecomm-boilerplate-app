/*
  Migrated from the backend (api/auth.js + the auth helpers in api/utils/index.js
  and api/handler/index.js).

  Previously the UI POSTed the Contentstack `app-token` to the backend auth
  endpoint, which verified the token and issued a signed authtoken.

  Now the UI only verifies the `app-token` against Contentstack's public signing
  key (utils.verifyRequest -> jwt.verify(appToken, getCSPublicKey())). It does
  NOT generate an authtoken anymore. The backend used the `jsonwebtoken` Node
  library; in the browser we use `jose` (already a dependency).
*/

import axios from "axios";
import {
  compactVerify,
  importSPKI,
  decodeProtectedHeader,
  JWTPayload,
} from "jose";

// Migrated from api/constants/index.js.
const CS_PUBLIC_KEY_URL =  "https://app.contentstack.com/.well-known/public-keys.json";

/**
 * Fetches Contentstack's public signing key.
 * Migrated from api/handler/index.js -> getCSPublicKey.
 */
const getCSPublicKey = async (): Promise<string> => {
  const res = await axios.get(CS_PUBLIC_KEY_URL);
  return res?.data?.["signing-key"];
};

// --- PKCS#1 -> SPKI conversion --------------------------------------------
// Contentstack returns the key as a PKCS#1 RSA public key
// ("-----BEGIN RSA PUBLIC KEY-----"). The Node `jsonwebtoken` lib accepted that
// directly, but `jose`/WebCrypto only import SPKI ("-----BEGIN PUBLIC KEY-----").
// So we wrap the PKCS#1 DER in a SubjectPublicKeyInfo (rsaEncryption) structure.

// DER length encoding (short form < 0x80, else long form).
const derLen = (n: number): number[] => {
  if (n < 0x80) return [n];
  const bytes: number[] = [];
  let x = n;
  while (x > 0) {
    bytes.unshift(x % 256);
    x = Math.floor(x / 256);
  }
  return [0x80 + bytes.length, ...bytes];
};

const derTLV = (tag: number, content: number[]): number[] => [
  tag,
  ...derLen(content.length),
  ...content,
];

const pkcs1ToSpkiPem = (pkcs1Pem: string): string => {
  const b64 = pkcs1Pem
    .replace(/-----(BEGIN|END)[^-]+-----/g, "")
    .replace(/\s+/g, "");
  const der = Array.from(atob(b64), (c) => c.charCodeAt(0));

  // AlgorithmIdentifier ::= SEQUENCE { OID rsaEncryption, NULL }
  const algId = [
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01,
    0x01, 0x05, 0x00,
  ];
  // subjectPublicKey BIT STRING (0x00 unused bits + the PKCS#1 DER).
  const bitString = derTLV(0x03, [0x00, ...der]);
  // SubjectPublicKeyInfo ::= SEQUENCE { algorithm, subjectPublicKey }
  const spki = derTLV(0x30, [...algId, ...bitString]);

  const spkiB64 = btoa(String.fromCharCode(...spki));
  const lines = spkiB64.match(/.{1,64}/g)?.join("\n") ?? spkiB64;
  return `-----BEGIN PUBLIC KEY-----\n${lines}\n-----END PUBLIC KEY-----`;
};

/**
 * Verifies the Contentstack app-token against the public signing key.
 * Migrated from api/utils/index.js -> verifyRequest
 * (jwt.verify(appToken, getCSPublicKey())).
 */
const verifyRequest = async (appToken: string): Promise<JWTPayload> => {
  const pem = await getCSPublicKey();
  // `jose` needs the algorithm to import the key; read it from the token header
  // (Contentstack signs with RS256) instead of hardcoding.
  const { alg } = decodeProtectedHeader(appToken);
  const publicKey = await importSPKI(pkcs1ToSpkiPem(pem), alg || "RS256");
  // Verify the signature only (i.e. that the token was genuinely signed by
  // Contentstack). We intentionally use `compactVerify` instead of `jwtVerify`
  // so JWT claim checks like `exp` are NOT enforced — Contentstack app-tokens
  // are short-lived and we only care about authenticity here.
  const { payload } = await compactVerify(appToken, publicKey);
  return JSON.parse(new TextDecoder().decode(payload));
};

/**
 * Verifies an app-token. Mirrors the default handler in api/auth.js, minus the
 * authtoken generation: it just fetches the public key and verifies the token.
 *
 * @param appToken - The Contentstack app-token received in the URL.
 * @returns `{ error: false }` if the token is valid, `{ error: true }` otherwise.
 */
const authenticate = async (
  appToken: string = ""
): Promise<{ error: boolean }> => {
  // Backend required a non-empty `app-token`.
  if (!appToken) {
    return { error: true };
  }

  try {
    await verifyRequest(appToken);
    return { error: false };
  } catch (err) {
    console.error(err);
    return { error: true };
  }
};

export { getCSPublicKey, verifyRequest, authenticate };
