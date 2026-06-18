/*
  Product routes for the mock vendor API.  Mounted at /products.

    GET /products                list/filter products
                                   ?id:in=77,80        filter by ids
                                   ?sku:in=SLCTBS       filter by skus
                                   ?categories:in=23    filter by category
                                   ?q=towel             free-text search
                                   ?limit=10&offset=0   pagination
    GET /products/search          same filters as above (keyword/category
                                   search endpoint, mirrors the real vendor)
    GET /products/:id             single product by id

  Responses mirror the third-party shapes the integration expects:
    list   -> { products: [...], meta: {...} }
    single -> { product: {...} }
*/
import { Router } from "express";
import config from "../config.js";
import { listProducts, getProductById } from "../lib/store.js";

const router = Router();

// Shared handler for the list + search endpoints.
const handleList = (req, res) => {
  const { items, meta } = listProducts({
    ids: req.query["id:in"],
    skus: req.query["sku:in"],
    categories: req.query["categories:in"],
    q: req.query.q ?? req.query.query ?? req.query.keyword,
    limit: req.query.limit,
    offset: req.query.offset,
  });
  return res.status(config.HTTP_STATUS.OK).json({ products: items, meta });
};

router.get("/", handleList);

// Define before "/:id" so it isn't captured as an id.
router.get("/search", handleList);

router.get("/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res
      .status(config.HTTP_STATUS.NOT_FOUND)
      .json({ error: `Product '${req.params.id}' not found.` });
  }
  return res.status(config.HTTP_STATUS.OK).json({ product });
});

export default router;
