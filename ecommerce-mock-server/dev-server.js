/*
  Mock third-party ecommerce vendor API.

  This Express server stands in for the real external ecommerce platform.
  The marketplace app's frontend (and later Contentstack Advanced Settings
  Rewrites) point at this server, so the full integration can be exercised
  end-to-end without ever calling — or authenticating against — the real
  vendor.

  Like a real vendor, the data endpoints require an API key
  ("Authorization: Bearer <ECOM_API_KEY>"). It performs no Contentstack-specific
  JWT / webhook verification — in the Contentstack flow the key arrives as
  "Bearer {{map.API_KEY}}", substituted server-side by Advanced Settings.

  Endpoints:
    GET /                  API index + dataset counts
    GET /health            liveness probe
    GET /products          list/filter products  (see routes/products.js)
    GET /products/search   keyword/category search
    GET /products/:id      single product
    GET /catalogs          list/filter catalogs  (see routes/catalogs.js)
    GET /catalogs/:id      single catalog
*/
import "dotenv/config";

import express from "express";
import cors from "cors";

import config from "./config.js";
import requireApiKey from "./middleware/auth.js";
import productsRouter from "./routes/products.js";
import catalogsRouter from "./routes/catalogs.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Lightweight request log for local development.
app.use((req, _res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);
  next();
});

// API index — handy when opening the tunnel URL in a browser.
app.get("/", (_req, res) => {
  res.json({
    name: config.VENDOR_NAME,
    status: "ok",
    endpoints: [
      "GET /health",
      "GET /products",
      "GET /products/search",
      "GET /products/:id",
      "GET /catalogs",
      "GET /catalogs/:id",
    ],
  });
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// All data endpoints require the API key; "/" and "/health" stay open.
app.use("/products", requireApiKey, productsRouter);
app.use("/catalogs", requireApiKey, catalogsRouter);

// 404 for anything unmatched.
app.use((req, res) => {
  res
    .status(config.HTTP_STATUS.NOT_FOUND)
    .json({ error: `Route '${req.method} ${req.originalUrl}' not found.` });
});

// Global error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res
    .status(config.HTTP_STATUS.SERVER_ERROR)
    .json({ error: "Something went wrong, please try again later." });
});

app.listen(config.PORT, () => {
  console.info(`${config.VENDOR_NAME} listening at port ${config.PORT}`);
});
