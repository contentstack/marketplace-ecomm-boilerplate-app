/*
  In-memory data access for the mock vendor.

  The data files (../data/products.js and ../data/categories.js) are the
  "database". These helpers query and filter them the way a real ecommerce
  platform's API would, supporting the same query params the original
  third-party integration used: `id:in`, `sku:in`, `categories:in`, plus a
  free-text `q` search and `limit`/`offset` pagination.
*/
import productsData from "../data/products.js";
import categoriesData from "../data/categories.js";

const PRODUCTS = productsData.products || [];
const CATALOGS = categoriesData.catalogs || [];

/* ----------------------------- parse helpers ----------------------------- */

// "77,80, ,81" -> [77, 80, 81]  (trims, drops empties, coerces to Number)
export const parseIdList = (value) =>
  (value ?? "")
    .toString()
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "")
    .map(Number)
    .filter((n) => !Number.isNaN(n));

// "SLCTBS, ABC" -> ["SLCTBS", "ABC"]  (trims, drops empties, keeps strings)
export const parseStringList = (value) =>
  (value ?? "")
    .toString()
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");

// Returns { limit, offset } as safe non-negative integers (limit may be null).
const parsePaging = ({ limit, offset } = {}, defaultLimit = null) => {
  const parsedLimit =
    limit === undefined || limit === null || limit === "" ?
      defaultLimit
      : Math.max(0, parseInt(limit, 10) || 0);
  const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);
  return { limit: parsedLimit, offset: parsedOffset };
};

// Applies offset/limit to a list and returns { items, meta }.
const paginate = (list, paging, defaultLimit) => {
  const { limit, offset } = parsePaging(paging, defaultLimit);
  const sliced =
    limit === null ? list.slice(offset) : list.slice(offset, offset + limit);
  return {
    items: sliced,
    meta: { total: list.length, count: sliced.length, limit, offset },
  };
};

const matchesQuery = (text, q) =>
  !q || (text ?? "").toString().toLowerCase().includes(q.toLowerCase());

/* ------------------------------- products -------------------------------- */

/**
 * List/filter products.
 * @param {Object} opts
 * @param {string} [opts.ids]        csv of product ids        (id:in)
 * @param {string} [opts.skus]       csv of product skus       (sku:in)
 * @param {string} [opts.categories] csv of category ids       (categories:in)
 * @param {string} [opts.q]          free-text search on name/sku/description
 * @param {string|number} [opts.limit]
 * @param {string|number} [opts.offset]
 * @returns {{ items: Object[], meta: Object }}
 */
export const listProducts = ({
  ids,
  skus,
  categories,
  q,
  limit,
  offset,
} = {}) => {
  let result = PRODUCTS;

  if (ids !== undefined) {
    const idList = parseIdList(ids);
    result = result.filter((p) => idList.includes(p.id));
  }

  if (skus !== undefined) {
    const skuList = parseStringList(skus);
    result = result.filter((p) => skuList.includes(p.sku));
  }

  if (categories !== undefined) {
    const catList = parseIdList(categories);
    result = result.filter((p) =>
      (p.categories || []).some((c) => catList.includes(c))
    );
  }

  if (q) {
    result = result.filter(
      (p) =>
        matchesQuery(p.name, q) ||
        matchesQuery(p.sku, q) ||
        matchesQuery(p.description, q)
    );
  }

  return paginate(result, { limit, offset });
};

// Single product by id. Returns the product object or null.
export const getProductById = (id) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;
  return PRODUCTS.find((p) => p.id === numericId) || null;
};

/* ------------------------------- catalogs -------------------------------- */

/**
 * List/filter catalogs (categories).
 * @param {Object} opts
 * @param {string} [opts.ids]    csv of catalog ids (id:in)
 * @param {string} [opts.q]      free-text search on name/description
 * @param {string|number} [opts.limit]
 * @param {string|number} [opts.offset]
 * @returns {{ items: Object[], meta: Object }}
 */
export const listCatalogs = ({ ids, q, limit, offset } = {}) => {
  let result = CATALOGS;

  if (ids !== undefined) {
    const idList = parseIdList(ids);
    result = result.filter((c) => idList.includes(c.id));
  }

  if (q) {
    result = result.filter(
      (c) => matchesQuery(c.name, q) || matchesQuery(c.description, q)
    );
  }

  return paginate(result, { limit, offset });
};

// Single catalog by id. Returns the catalog object or null.
export const getCatalogById = (id) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;
  return CATALOGS.find((c) => c.id === numericId) || null;
};
