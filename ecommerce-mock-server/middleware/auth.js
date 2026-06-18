/*
  API-key authentication for the mock vendor.

  Simulates a real third-party ecommerce platform that requires an API key on
  every request. Callers must send:

      Authorization: Bearer <ECOM_API_KEY>

  In the Contentstack flow the frontend sends `Bearer {{map.API_KEY}}` and
  Advanced Settings substitutes the real key server-side before the request
  reaches this server — so the key is never exposed to the browser.
*/
import config from "../config.js";

const BEARER_PREFIX = "Bearer ";

export default function requireApiKey(req, res, next) {
  // Misconfiguration guard: refuse to run "open" if no key is set on the server.
  if (!config.API_KEY) {
    return res.status(config.HTTP_STATUS.SERVER_ERROR).json({
      error: "Server is missing ECOM_API_KEY configuration.",
    });
  }

  const header = req.headers.authorization || "";
  const provided = header.startsWith(BEARER_PREFIX) ?
    header.slice(BEARER_PREFIX.length).trim()
    : "";

  if (!provided) {
    return res
      .status(config.HTTP_STATUS.UNAUTHORIZED)
      .json({ error: "Missing API key. Send 'Authorization: Bearer <key>'." });
  }

  if (provided !== config.API_KEY) {
    return res
      .status(config.HTTP_STATUS.UNAUTHORIZED)
      .json({ error: "Invalid API key." });
  }

  return next();
}
