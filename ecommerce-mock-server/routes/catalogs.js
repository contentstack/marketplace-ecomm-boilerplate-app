/*
  Catalog (category) routes for the mock vendor API.  Mounted at /catalogs.

    GET /catalogs                 list/filter catalogs
                                    ?id:in=18,19        filter by ids
                                    ?q=bath              free-text search
                                    ?limit=10&offset=0   pagination
    GET /catalogs/:id             single catalog by id

  Responses mirror the third-party shapes the integration expects:
    list   -> { catalogs: [...], meta: {...} }
    single -> { catalog: {...} }
*/
import { Router } from "express";
import config from "../config.js";
import { listCatalogs, getCatalogById } from "../lib/store.js";

const router = Router();

router.get("/", (req, res) => {
  const { items, meta } = listCatalogs({
    ids: req.query["id:in"],
    q: req.query.q ?? req.query.query ?? req.query.keyword,
    limit: req.query.limit,
    offset: req.query.offset,
  });
  return res.status(config.HTTP_STATUS.OK).json({ catalogs: items, meta });
});

router.get("/:id", (req, res) => {
  const catalog = getCatalogById(req.params.id);
  if (!catalog) {
    return res
      .status(config.HTTP_STATUS.NOT_FOUND)
      .json({ error: `Catalog '${req.params.id}' not found.` });
  }
  return res.status(config.HTTP_STATUS.OK).json({ catalog });
});

export default router;
