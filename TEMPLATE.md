# Marketplace eCommerce App Boilerplate Template Documentation

This app is **frontend-only**. You shape the app through two areas:

1. **Root config** (`ui/src/root_config/index.tsx`) — how UI locations and data are presented.
2. **Ecommerce data layer** (`ui/src/services/`) — how the third-party vendor API is called (through the Contentstack App SDK + Advanced Settings).

There is no app backend. A local **mock ecommerce vendor server** (`ecommerce-mock-server/`) stands in for a real platform during development.

## Front End

### UI Locations

- `Config Screen`
- `Product Custom Field`
  - `Product Selector Page`
- `Category Custom Field`
  - `Category Selector Page`
- `Sidebar Widget`

## eCommerce Root Configuration

The root configuration (`ui/src/root_config/index.tsx`) is the file you will change the most. It defines and specifies how the UI elements of your app are handled.

## ecommerceEnv

Type:

```ts
{
  REACT_APP_NAME: string;
  SELECTOR_PAGE_LOGO: SVG;
  APP_ENG_NAME: string;
  UNIQUE_KEY: {
    product: string;
    category: string;
  };
  ENABLE_MULTI_CONFIG: boolean;
}
```

| Key | Type | Description |
|-----|------|-------------|
| `REACT_APP_NAME`* | string | The name of the app. |
| `SELECTOR_PAGE_LOGO`* | SVG | SVG logo for the selector page. |
| `APP_ENG_NAME`* | string | Used to display the app name in error messages. |
| `UNIQUE_KEY`* | object | Unique identifier for the product and category objects returned from the API, e.g. `{ product: 'id', category: 'id' }`. |
| `ENABLE_MULTI_CONFIG`* | boolean | Whether to enable multi-configuration. This boilerplate ships with it set to `false` (a single global configuration). Set it to `true` if you need multiple named configurations. |

## Configuration Screen

### Root Config

Navigate to `ui/src/root_config/index.tsx`. Two functions drive the config screen:

1. `configureConfigScreen()`

Returns an object of config-screen fields keyed by field name. This boilerplate ships with a single field, `api_key`, that stores the ecommerce API key in the **server configuration** (never exposed to the browser):

```ts
api_key: {
  type: "textInputFields",
  labelText: "API Key",
  helpText: "The API key used to authenticate requests to your ecommerce server.",
  placeholderText: "Enter your ecommerce API Key",
  instructionText: "Stored in server configuration and injected server-side via the Advanced Settings API_KEY mapping.",
  saveInConfig: false,
  saveInServerConfig: true,
  isSensitive: true,
  isConfidential: false,
  isMultiConfig: false,
  isApiValidationEnabled: false,
  suffixName: "API Key",
  allowDuplicateKeyValue: false,
  required: true,
}
```

| Key | Type | Description |
|-----|------|-------------|
| `type`* | string | Field type (`textInputFields` is handled here). |
| `labelText`* | string | The field label. |
| `helpText` | string | Tooltip beside the label. |
| `placeholderText` | string | Placeholder for the input. |
| `instructionText`* | string | Helper text below the input. |
| `saveInConfig` | boolean | Save the value in the (client-readable) configuration. |
| `saveInServerConfig` | boolean | Save the value in the server configuration. Use this for secrets like API keys. |
| `isSensitive` | boolean | Masks the input and shows a show/hide toggle. |
| `isMultiConfig` | boolean | Whether the key is stored per multi-configuration. |
| `isConfidential` | boolean | Whether the key is encrypted/decrypted (applies to `saveInConfig` values, using `REACT_APP_ENCRYPTION_KEY`). |
| `isApiValidationEnabled` | boolean | Whether the key is validated via an API. |
| `suffixName` | string | Suffix label used when `isSensitive` is `true`. |
| `allowDuplicateKeyValue` | boolean | Whether duplicate values are allowed across multi-configs. |
| `required` | boolean | Whether the field is required. |

> Security note: a field stored only in the server configuration (`saveInServerConfig: true` and `saveInConfig: false`) is kept out of the client-readable configuration, so the value is never exposed to the browser. This is how the API key is handled.

2. `getCustomKeys()`

Populates the Custom Keys select options on the config page (used when "Custom JSON" is selected, to choose which keys are saved in the entry). Returns an array of:

```ts
[{
  label: string,
  value: string,
  searchLabel: string,
  isDisabled?: boolean
}]
```

## Product Custom Field

Implement `returnFormattedProduct()` to map a product from your commerce API into the shape the custom field displays:

```
id (string)            – unique product identifier
name (string)          – product name
description (string)   – short description
image (string)         – URL/path to the product image
price (string)         – price
sku (string, optional) – stock keeping unit
isProductDeleted (bool)– whether the product config was deleted from the config gateway
cs_metadata (string)   – extra metadata (multi-config purposes)
```

## Category Custom Field

Implement `returnFormattedCategory()` to map a category from your commerce API:

```
id (string)             – unique category identifier
name (string)           – localized name (falls back to "-")
customUrl/key (string)  – identifier/url for the category
description (string)    – description
isCategoryDeleted (bool)– whether the category config was deleted
image (string)          – URL/path to the category image
```

## Sidebar Widget

By default the sidebar widget shows Name, Description, Price, SKU, and Image. To add more, implement `getSidebarData()` returning an array of:

```ts
{
  title: string,
  value: string
}
```

## Selector Page

Define the table columns with `getProductSelectorColumns()` and `categorySelectorColumns()`. Each receives the `config` object and returns an array of column definitions:

```ts
{
  Header: string;
  id?: string;
  accessor: string | Function;
  default?: boolean;
  disableSortBy?: boolean;
  Cell?: (props: any) => React.ReactNode;
  addToColumnSelector?: boolean;
  cssClass?: string;
  columnWidthMultiplier?: number;
}
```

| Key | Type | Description |
|-----|------|-------------|
| `Header`* | string | The column title. |
| `id`* | string | Unique column id (used for sorting/grouping/filtering). |
| `accessor`* | string \| Function | How the cell value is read from a row (key string, deep path, or function). |
| `default` | boolean | Whether the column is shown by default. |
| `disableSortBy` | boolean | Disable sorting on this column. |
| `Cell` | Function | Returns a React node for the cell. |
| `addToColumnSelector` | boolean | Include this column in the column selector. |
| `cssClass` | string | Custom CSS class for the column. |
| `columnWidthMultiplier` | number | Multiplies one unit of column width. |

## Other Functions In Root Config

#### `getFormattedResponse()`

Receives the response from the commerce API and returns:

```ts
{
  items: Array<any>,
  meta: {
    total: number,
    current_page: number,
  }
}
```

#### `getOpenerLink()`

Parameters: `id`, `config`, `type` (`product`/`category`). Returns a `string` URL that opens the item in your commerce application (used in the Selector Page and Custom Field).

#### `verifyAppSigning()`

Parameter: `app_token: string`. Verifies app tokens in the UI (app signing). See `ui/src/services/auth.ts`.

#### `removeItemsFromCustomField()`

Parameters: `removeId`, `selectedIds`, `type` (`product` | `category`), `uniqueKey`. Use this when you need extra checks/validations before removing items from the custom field; return the array after removing the desired object.

## Ecommerce Data Layer

The UI fetches ecommerce data through the Contentstack App SDK (`appSdk.api`), routed via Advanced Settings. The relevant files:

| File | Responsibility |
|------|----------------|
| `ui/src/services/ecommerce.ts` | The vendor access layer: `getSingleProduct`, `getSelectedProductsById`, `getSelectedCategoriesById`, `getAllProducts`, `getAllCategories`, `filterProductsByCategory`, and the combined variants. Each issues a request via the SDK. |
| `ui/src/services/ecomClient.ts` | Wraps `appSdk.api()`. Holds the initialized SDK (set by `MarketplaceAppProvider`) and exposes `ecomGet(path, query)`, which calls `appSdk.api("<REWRITE_BASE><path>", …)` and returns the parsed JSON. |
| `ui/src/services/config.ts` | Endpoint configuration (below). |
| `ui/src/services/index.ts` | The service layer the UI components call; formats results via `rootConfig.getFormattedResponse`. |

### `ui/src/services/config.ts` keys

- `URI_ENDPOINTS` — maps the resource type to its endpoint key (`{ product: "products", category: "catalogs" }`).
- `SEARCH_URL_PARAMS`, `FIELDS_URL` — optional search/field params for your platform.
- `SENSITIVE_CONFIG_KEYS` — keys treated as sensitive.
- `ENDPOINTS_CONFIG.getSeparateProductsAndCategories` — when `true` (the default), products and categories are fetched via separate methods (`getAllProducts`/`getAllCategories`/`getSelectedProductsById`/`getSelectedCategoriesById`). When `false`, the combined methods (`getAllProductsAndCategories`/`getSelectedProductsandCategories`) are used.
- `ECOM_API.REWRITE_BASE` — the rewrite path prefix the app calls (default `/ecom`).
- `ECOM_API.AUTH_HEADER_TEMPLATE` — the Authorization header value, `Bearer {{map.API_KEY}}`. The `{{map.API_KEY}}` token is resolved server-side by Advanced Settings.

## Mock Ecommerce Vendor Server

`ecommerce-mock-server/` is a standalone Express app that imitates a third-party ecommerce vendor for local development. It is **not** deployed to production.

- Runs on port `8080` (`npm run dev`).
- Requires `Authorization: Bearer <ECOM_API_KEY>` on data endpoints (`ECOM_API_KEY` lives in `ecommerce-mock-server/.env`). In the Contentstack flow this key arrives as `Bearer {{map.API_KEY}}`, substituted server-side.
- Endpoints:
  - `GET /products` — supports `?id:in=`, `?sku:in=`, `?categories:in=`, `?q=`, `?limit=`, `?offset=`
  - `GET /products/search` — keyword/category search
  - `GET /products/:id` — single product
  - `GET /catalogs` — supports `?id:in=`, `?q=`, paging
  - `GET /catalogs/:id` — single catalog
  - `GET /` / `GET /health` — index & health (open, no auth)
- Sample data lives in `ecommerce-mock-server/data/`.

To point the app at a real vendor, change the Advanced Settings rewrite destinations (and the data-layer paths/shapes in `ui/src/services/`) accordingly.

## Advanced Settings (Rewrites & Mappings)

Rewrites are the only way `appSdk.api()` can reach an external endpoint. Mappings inject server-stored values (like the API key) into requests without exposing them to the browser.

**Mapping**

| Name | Value (server-config path) |
|------|----------------------------|
| `API_KEY` | `api_key` |

**Rewrites** (replace `<your-tunnel-host>` with the public tunnel forwarding to the mock server's `localhost:8080`)

| Source | Destination |
|--------|-------------|
| `/ecom/products/:id` | `https://<your-tunnel-host>/products/:id` |
| `/ecom/products` | `https://<your-tunnel-host>/products` |
| `/ecom/catalogs` | `https://<your-tunnel-host>/catalogs` |

Reference these in code via `{{map.API_KEY}}` (used in `ui/src/services/config.ts`'s `AUTH_HEADER_TEMPLATE`).

## Additional Information

### App Signing and Sensitive Information

All UI locations are signed by default in this template.

Sensitive information (API keys, tokens) should be stored in the **server configuration** (`saveInServerConfig: true`, `saveInConfig: false`), so it is never visible in API calls made from UI locations. This boilerplate stores the ecommerce API key this way (`api_key`) and injects it into outbound requests server-side via the Advanced Settings `API_KEY` mapping — there is no need to send credentials to a custom backend.

## App Manifest for eCommerce Apps

- **Name**: Your App Name
- **UI Locations:**
  1. App Configuration — Name: Your App Name; Path: `/config`; Signed & Enabled
  2. Custom Field
     - Product — Name: Your App Name - Product Field; Path: `/product-field`; Signed & Enabled; Data Type: JSON
     - Category — Name: Your App Name - Category Field; Path: `/category-field`; Signed & Enabled; Data Type: JSON
  3. Entry Sidebar — Name: Your App Name; Path: `/sidebar-widget`; Signed & Enabled
- **Advanced Settings:** the `API_KEY` mapping and the `/ecom/*` rewrites (see above).
