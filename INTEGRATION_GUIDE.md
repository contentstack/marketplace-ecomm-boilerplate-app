# Integration Guide — Adapting the Frontend-Only Boilerplate to a Commerce Vendor

> **Audience:** developers *and* the AI code-generation workflow.
> **Goal:** given this boilerplate + a vendor's Swagger/OpenAPI spec, produce a
> working commerce app **without writing a backend**. All vendor-specific logic
> lives in a small, well-defined **adaptation surface** (mostly 3 files).

This guide documents that surface, maps each piece to where it comes from in a
Swagger spec, lists the non-obvious gotchas, and ends with a fully worked
reference example (BigCommerce v3).

---

## 1. Architecture in one paragraph

This is a **frontend-only** app. There is no custom backend. The UI calls the
third-party vendor API directly through the Contentstack App SDK
(`appSdk.api()`), hitting a **rewrite path** (default prefix `/ecom`). The app's
**Advanced Settings** (configured in Developer Hub) rewrite that path to the real
vendor URL and inject secrets **server-side** via **mappings**, so credentials
never reach the browser. A standalone mock vendor (`ecommerce-mock-server/`)
exists only for local testing; production points at the real vendor.

### Request lifecycle

```
UI service call
  └─ ecommerce.ts        build path + query (vendor-shaped)
      └─ ecomClient.ecomGet(path, query)
          ├─ resolveStoreId()        reads non-sensitive id from appSdk.getConfig()
          ├─ buildUrl()              REWRITE_BASE + STORE_PATH + path + ?query
          └─ appSdk.api(url, {headers:{ [AUTH_HEADER_NAME]: AUTH_HEADER_TEMPLATE }})
                            │
            ┌───────────────┘  (leaves the browser here)
            ▼
Contentstack Advanced Settings
  ├─ Rewrite:  /ecom/(.*)  ->  https://vendor.example.com/$1
  └─ Mapping:  {{map.AUTH_TOKEN}}  ->  serverConfiguration.<secret>   (injected into header)
            │
            ▼
        Vendor API  ──>  { data | items, meta | pagination }
            │
            ▼
Back in the UI:
  callEcommerce()  ->  rootConfig.getFormattedResponse({ data: responseBody })
                   ->  { items, meta:{ total, current_page } }  ->  rendered
```

**Key security rule:** a mapping can only read **`serverConfiguration`** (not the
client-readable `configuration`). So *secret* fields must be saved with
`saveInServerConfig: true` and injected via a mapping; *non-secret* fields (like a
store id) can be read in the browser via `getConfig()` and placed in the URL path.

---

## 2. The adaptation surface (what changes per vendor)

| File | What to adapt | Derived from Swagger? |
|------|---------------|------------------------|
| `ui/src/services/config.ts` | base URL, endpoint paths, auth header name + template, extra params, Advanced Settings wiring | ✅ mostly |
| `ui/src/services/ecomClient.ts` | how credentials are injected (header vs path), which id is read from client config | ⚠️ partly — credential **sensitivity** is a product decision |
| `ui/src/services/ecommerce.ts` | path building, query-param mapping (pagination + filters), response extraction, per-resource id normalization | ✅ yes |
| `ui/src/root_config/index.tsx` | `configureConfigScreen` fields, `UNIQUE_KEY`, `returnFormattedProduct/Category`, selector columns, `getFormattedResponse`, `getOpenerLink` | ✅ field names from response schema |
| Advanced Settings (Dev Hub, manual) | one rewrite + one mapping per secret credential | ✅ securitySchemes → header; rewrite host from `servers[]` |

Everything else (React components, providers, custom-field/selector/sidebar
plumbing, drag-drop, multi-config) is **vendor-agnostic — do not touch it.**

### 2.1 `config.ts`

```ts
const config = {
  API_BASE_URL: "https://api.vendor.com/<path>/$/...",   // reference only; $ = the id segment
  URI_ENDPOINTS: { product: "...", category: "..." },     // resource paths (no leading slash)
  PRODUCT_INCLUDE: "...",                                  // optional expand/include param value
  SENSITIVE_CONFIG_KEYS: ["<secret_field>"],
  ENDPOINTS_CONFIG: { getSeparateProductsAndCategories: true },  // true if products/categories are different endpoints
  ECOM_API: {
    REWRITE_BASE: "/ecom",                                 // path prefix the rewrite matches
    STORE_PATH_TEMPLATE: "/stores/{store_id}/v3",          // per-tenant path segment, or "" if none
    AUTH_HEADER_NAME: "X-Auth-Token",                      // vendor's auth header name
    AUTH_HEADER_TEMPLATE: "{{map.AUTH_TOKEN}}",            // mapping placeholder, resolved server-side
  },
};
```

- If the vendor has **no per-tenant path segment**, set `STORE_PATH_TEMPLATE: ""`
  and skip `resolveStoreId()` use.
- If the vendor authenticates with `Authorization: Bearer`, set
  `AUTH_HEADER_NAME: "Authorization"` and `AUTH_HEADER_TEMPLATE: "Bearer {{map.TOKEN}}"`.

### 2.2 `ecomClient.ts`

Generic transport — usually only two things change:
1. **Credential injection** — the header is built from `AUTH_HEADER_NAME` /
   `AUTH_HEADER_TEMPLATE`, so normally no code change; just config. If the vendor
   needs the secret in the **query string** instead of a header, add it there.
2. **The non-secret tenant id** — `resolveStoreId()` reads it from
   `appSdk.getConfig()` (client config). Rename/repoint it to whatever the vendor
   calls its non-secret tenant identifier, or drop it if there's none.

### 2.3 `ecommerce.ts`

This is where vendor request/response *shape* lives. Adapt these helpers:

- **`toListParams(query)`** — map the app's `{skip, limit, searchParam}` onto the
  vendor's pagination + search params. (BigCommerce uses 1-based `page`; others
  use `offset`/`cursor`. Search term key varies: `keyword`, `q`, `query`…)
- **`toPagination(meta)`** — map the vendor's pagination block onto
  `{ totalResults, currentPage }` (the contract `getFormattedResponse` expects).
- **`toIdCsv(raw)`** — normalize the selected-ids value into the format the
  vendor's "by id" filter wants (BigCommerce: comma-separated ints for `id:in`).
- **`normalize<Resource>()`** — if the response's unique-id field name differs
  between endpoints, surface it as the field the boilerplate expects (`id`).
- The `root_config` methods — set the right path, filter param names, and which
  response key holds the array (`res.data` vs `res.items` vs `res.products`).

> **Contract to preserve:** the selected-items methods must return objects keyed
> by `products` / `catalogs` (NOT the raw endpoint path), because
> `getFormattedResponse` reads `response.data.products || response.data.catalogs`.

### 2.4 `root_config/index.tsx`

- **`configureConfigScreen`** — declare the credential fields. Mark secrets
  `saveInServerConfig: true, isSensitive: true, saveInConfig: false`; mark
  non-secrets `saveInConfig: true`.
- **`ecommerceEnv.UNIQUE_KEY`** — the id field per resource (must match the field
  your `normalize` step guarantees).
- **`getFormattedResponse`** — `items` + `meta.total` / `meta.current_page`.
- **`returnFormattedProduct` / `returnFormattedCategory`** — map vendor fields to
  `{ id, name, description, image, price, sku }` etc.
- **`getProductSelectorColumns` / `categorySelectorColumns`** — table `accessor`s
  must reference real response fields.
- **`getOpenerLink`** — deep link into the vendor console.

---

## 3. Swagger / OpenAPI → boilerplate mapping

| Boilerplate target | OpenAPI source |
|--------------------|----------------|
| `API_BASE_URL`, rewrite destination, `STORE_PATH_TEMPLATE` | `servers[].url` (note `{var}` path templating) |
| `AUTH_HEADER_NAME` + template, mapping | `components.securitySchemes` (type `apiKey`, `in: header`, `name`) or `http`/`bearer` |
| `URI_ENDPOINTS`, single-item paths | `paths` keys |
| `toListParams` (pagination, search) | each operation's `parameters` (e.g. `page`/`limit`/`offset`/`q`) |
| filter param names (`id:in`, `category_id:in`) + **format** | `parameters` (name + `schema`/`style`) |
| `toPagination`, response array key | response `content.schema` (`data`/`items` + `meta`/`pagination`) |
| `returnFormatted*`, `UNIQUE_KEY`, columns | response item `schema` **property names** |

---

## 4. Credential sensitivity — the one thing Swagger can't tell you

Swagger declares *that* a credential exists and *how* it's sent, but **not whether
it's a secret**. You must decide per field:

- **Secret** (API token, access token, client secret) → `saveInServerConfig: true`
  → referenced by a **mapping** → injected server-side. Never in the URL/browser.
- **Non-secret identifier** (store id/hash, account id, region) → `saveInConfig: true`
  → read via `getConfig()` → placed in the URL path (`STORE_PATH_TEMPLATE`).

> For the AI workflow: when sensitivity is ambiguous, **prompt the user**. Default
> anything token/secret/key-shaped to *secret*.

---

## 5. Advanced Settings setup (manual, in Developer Hub)

Per app install, under **Advanced Settings**:

1. **Rewrite** — host swap from the rewrite base to the vendor:
   - Source: `/ecom/(.*)`  →  Destination: `https://<vendor-host>/$1`
   - (If `(.*)` isn't accepted, add explicit `:param` routes per endpoint.)
2. **Mapping** — one per secret, pointing into server config (dot notation):
   - `AUTH_TOKEN` → `<server_config_field>` (e.g. `auth_token`)
   - Used in the header as `{{map.AUTH_TOKEN}}`.
3. **Variables** — only if a secret is *static/shared* rather than per-install.
   Per-install secrets come from server config via a mapping (no variable needed).

Names must match `config.ECOM_API` (`REWRITE_BASE`, the `{{map.*}}` names).

---

## 6. Gotcha checklist (the bugs a naïve port hits)

These are exactly the failures the BigCommerce dry-run surfaced. The AI should
treat each as an explicit verification step:

- [ ] **Pagination model** — page (1-based) vs offset vs cursor. Compute correctly
      in `toListParams` (BigCommerce: `page = floor(skip/limit)+1`).
- [ ] **Filter value format** — strict vendors reject `id:in=[77]`; they want
      `id:in=77,80`. Normalize with `toIdCsv` (handles CSV / JSON-array /
      multi-config object). Symptom: HTTP 422 "id param format is invalid".
- [ ] **Unique-id field name mismatch** — list/detail/filter may use different id
      fields (e.g. categories return `category_id`, not `id`). Normalize to `id`,
      and ensure `UNIQUE_KEY` + selector `accessor`s agree. Symptom: blank ID
      column + 422 on re-fetch of saved items.
- [ ] **Response array key** — `res.data` vs `res.items` vs `res.products`. And the
      **selected-items return key** must be `products`/`catalogs`, not the endpoint
      path. Symptom: data fetches fine but nothing renders (items `undefined`).
- [ ] **Auth header name** — not always `Authorization: Bearer`.
- [ ] **Credential location** — secret→mapping/header, id→path. A mapping cannot
      read client `configuration`.
- [ ] **Image/price field paths** — `returnFormattedProduct` must point at real
      fields (e.g. BigCommerce images use `url_standard`, not `url`).
- [ ] **Selector column accessors** — must reference fields that exist (the product
      selector's `accessor: "code"` is a known leftover; real id is `id`).

---

## 7. Worked reference example — BigCommerce v3

The diff below (mock-vendor baseline → BigCommerce) is the canonical pattern to
imitate. Full diff: `git diff HEAD -- ui/src/services ui/src/root_config`.

### 7.1 `config.ts`

| Field | Baseline (generic/mock) | BigCommerce |
|-------|--------------------------|-------------|
| `API_BASE_URL` | `https://my.example.com/$/v3/` | `https://api.bigcommerce.com/stores/$/v3/` |
| `URI_ENDPOINTS.product` | `products` | `catalog/products` |
| `URI_ENDPOINTS.category` | `catalogs` | `catalog/trees/categories` |
| extra param | — | `PRODUCT_INCLUDE: "primary_image,variants,images"` |
| `STORE_PATH_TEMPLATE` | — | `/stores/{store_id}/v3` |
| `AUTH_HEADER_NAME` | (implicit `Authorization`) | `X-Auth-Token` |
| `AUTH_HEADER_TEMPLATE` | `Bearer {{map.API_KEY}}` | `{{map.AUTH_TOKEN}}` |

### 7.2 `ecommerce.ts` — request shaping

```ts
// Pagination: BigCommerce is 1-based `page`, search term is `keyword`.
const toListParams = (query) => {
  const params = {};
  const limit = query?.limit ? Number(query.limit) : undefined;
  if (limit !== undefined) params.limit = limit;
  if (query?.skip && limit) params.page = Math.floor(Number(query.skip) / limit) + 1;
  if (query?.searchParam) {
    const term = String(query.searchParam).replace(/^keyword=/, "");
    if (term) params.keyword = term;
  }
  return params;
};

// Pagination block lives under meta.pagination.
const toPagination = (meta) => ({
  totalResults: meta?.pagination?.total,
  currentPage: meta?.pagination?.current_page,
});

// id:in must be a bare comma-separated int list (else 422).
const toIdCsv = (raw) => { /* CSV | "[77,80]" | {store:{id:[77]}} -> "77,80" */ };

// catalog/trees/categories returns `category_id`; boilerplate wants `id`.
const normalizeCategories = (arr) =>
  arr.map(c => (c.id === undefined && c.category_id !== undefined ? { ...c, id: c.category_id } : c));
```

### 7.3 `ecommerce.ts` — response key contract

```ts
// Selected items must be keyed by products/catalogs, NOT URI_ENDPOINTS[query]
// ("catalog/products"), or getFormattedResponse can't find them.
const resultKey = query === "category" ? "catalogs" : "products";
return { [resultKey]: response };
```

### 7.4 Config fields + Advanced Settings

```
configureConfigScreen:
  store_id    -> saveInConfig:true,  isSensitive:false   (client; goes in URL path)
  auth_token  -> saveInServerConfig:true, isSensitive:true  (server; goes in mapping)

Advanced Settings:
  Rewrite:  /ecom/(.*)  ->  https://api.bigcommerce.com/$1
  Mapping:  AUTH_TOKEN  ->  serverConfiguration.auth_token   (header: X-Auth-Token: {{map.AUTH_TOKEN}})
```

### 7.5 Endpoint reference

```
GET catalog/products              ?id:in= ?categories:in= ?keyword= ?page= ?limit= &include=
GET catalog/products/:id          &include=
GET catalog/trees/categories      ?category_id:in= ?page= ?limit=
-> all return { data: [...]|{...}, meta: { pagination: { total, current_page } } }
```

---

## 8. Notes for the AI workflow

- Restrict generated edits to the **adaptation surface** (§2). Treat components,
  providers, hooks, and selector/custom-field/sidebar plumbing as read-only.
- Derive everything you can from the Swagger spec (§3); **ask the user** for the
  one thing it can't express — **credential sensitivity** (§4).
- After generating, self-verify against the **gotcha checklist** (§6) — these are
  the high-probability failure modes.
- Use the BigCommerce diff (§7) as the pattern to imitate, not values to copy.
