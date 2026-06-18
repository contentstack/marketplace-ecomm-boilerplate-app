# Contentstack Marketplace E-COMMERCE App Boilerplate

This boilerplate provides a template to create your own [Marketplace](https://www.contentstack.com/marketplace) E-COMMERCE app, and can be deployed on [Launch](https://www.contentstack.com/launch).

It is a **frontend-only** app. There is no custom backend to build or deploy: the UI talks to your third-party ecommerce platform directly through the Contentstack App SDK (`appSdk.api`), routed via **Advanced Settings** (Rewrites + Mappings). Sensitive credentials (like the ecommerce API key) are stored in the app's server configuration and injected server-side, so they are never exposed to the browser.

A standalone **mock ecommerce vendor server** (`ecommerce-mock-server/`) is included so you can develop and test the full flow locally without calling — or authenticating against — a real ecommerce platform.

## Prerequisite

* [Contentstack Account](https://app.contentstack.com/#!/login) with Marketplace & Launch enabled
* Node.js (v18+ recommended) & npm
* A tunnelling tool (e.g. ngrok / cloudflared) to expose the local mock server to Contentstack during development

## Features

* React.js app template (frontend-only)
* Secure third-party API calls via the Contentstack App SDK `appSdk.api()` — no app backend required
* Contentstack **Advanced Settings** integration (Variables, Mappings, Rewrites) for server-side credential injection
* A standalone **mock ecommerce vendor server** for local development (API-key protected, ships with sample product/category data)
* Root config support for configuring the whole app (config screen, response formatting, selector columns, etc.)
* Tooling to create, manage, and deploy the marketplace app — see [scripts/README.md](./scripts/README.md)

## Structure of the Marketplace Ecommerce App Boilerplate

<details>
  <summary>
    Reveal/Collapse the code structure
  </summary>

```bash
marketplace-ecomm-boilerplate-app
|-- ecommerce-mock-server          # standalone mock of a third-party ecommerce vendor (local dev only; NOT deployed)
|   |-- config.js                  # port, vendor name, API key, HTTP status
|   |-- dev-server.js              # Express app entry (port 8080)
|   |-- middleware
|   |   |-- auth.js                # requires `Authorization: Bearer <ECOM_API_KEY>`
|   |-- routes
|   |   |-- products.js            # GET /products, /products/search, /products/:id
|   |   |-- catalogs.js            # GET /catalogs, /catalogs/:id
|   |-- lib
|   |   |-- store.js               # in-memory data access + filtering
|   |-- data
|   |   |-- products.js            # sample products
|   |   |-- categories.js          # sample catalogs/categories
|   |-- .env                       # PORT, ECOM_API_KEY
|   |-- package.json
|-- examples                       # reference root_config implementations
|   |-- bigcommerce
|   |   |-- ui
|   |-- sapcc
|   |   |-- ui
|-- scripts                        # create/manage/deploy the marketplace app (see scripts/README.md)
|   |-- settings                   # app manifests & installation details
|   |-- src
|-- ui                             # the React app (this is what gets deployed)
|   |-- public
|   |-- src
|   |   |-- assets
|   |   |-- common
|   |   |   |-- contexts
|   |   |   |-- hooks               # useAppSdk, useInstallationData, useCustomField, ...
|   |   |   |-- locale/en-us
|   |   |   |-- providers           # MarketplaceAppProvider, *ExtensionProvider
|   |   |   |-- types
|   |   |   |-- utils
|   |   |-- components              # ErrorBoundary, WarningMessage
|   |   |-- containers
|   |   |   |-- App
|   |   |   |-- ConfigScreen        # config page (single API-key field)
|   |   |   |-- CustomField         # Product & Category custom fields
|   |   |   |-- CategoryField
|   |   |   |-- ProductsField
|   |   |   |-- SelectorPage
|   |   |   |-- SidebarWidget
|   |   |-- root_config             # app-shaping config (configureConfigScreen, formatting, columns, ...)
|   |   |-- services
|   |   |   |-- ecommerce.ts        # vendor API calls (via appSdk.api)
|   |   |   |-- ecomClient.ts       # appSdk.api() wrapper + singleton
|   |   |   |-- config.ts           # rewrite base + auth header template + endpoint config
|   |   |   |-- auth.ts             # app-token verification (app signing)
|   |   |   |-- index.ts            # service layer consumed by the UI
|   |   |-- types
|   |-- .env                        # REACT_APP_UI_URL, REACT_APP_ENCRYPTION_KEY, ...
|   |-- package.json
|-- build.sh                        # production build (UI only -> to-deploy/ui.zip)
|-- README.md
|-- TEMPLATE.md
|-- SECURITY.md
|-- LICENSE
```

</details>

* To start developing an eCommerce app from this boilerplate, clone the repository and copy its contents into your own app repo.
* The new app repo source folder will be referred to as `APP_DIRECTORY` from now on.
* Open `<APP_DIRECTORY>/ui/package.json` and update the `name` attribute to your app name.
* Open the root HTML file (`<APP_DIRECTORY>/ui/public/index.html`) and update the `<title>` tag to your app name.
* Change `<APP_DIRECTORY>/ui/public/favicon.ico` as per your app's requirement.

## Environment Variables

A `.env` file is required in `<APP_DIRECTORY>/ui`. Rename `ui/.env.example` to `ui/.env` and fill in the values.

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_UI_URL` | Yes | The URL of your app's UI (locally `http://localhost:4000`). |
| `REACT_APP_ENCRYPTION_KEY` | Yes | Key used to encrypt/decrypt confidential config values stored in the app configuration. |
| `REACT_APP_API_URL` / `REACT_APP_API_AUTH_URL` | Legacy | Held the old app-backend URL. The frontend-only flow does not use these for ecommerce data (that now goes through `appSdk.api` + Advanced Settings). Left for backward compatibility. |

The mock vendor server has its own `ecommerce-mock-server/.env` (`PORT`, `ECOM_API_KEY`).

## Development Setup

1. Install UI dependencies:

   ```bash
   cd <APP_DIRECTORY>/ui
   npm i
   ```

2. Create and install the Contentstack marketplace app (login, dev app creation/installation, and a sample content model). See [scripts/README.md](./scripts/README.md) for the commands and flow.

3. Start the UI (port 4000):

   ```bash
   cd <APP_DIRECTORY>/ui
   npm run start      # macOS/Linux
   npm run startWin   # Windows
   ```

4. Start the mock ecommerce vendor server (port 8080) in a separate terminal:

   ```bash
   cd <APP_DIRECTORY>/ecommerce-mock-server
   npm install
   npm run dev
   ```

5. Expose the mock server to Contentstack with a tunnel (so Advanced Settings rewrites can reach it):

   ```bash
   # e.g. with ngrok
   ngrok http 8080
   ```

6. Configure **Advanced Settings** and the **config page** (see the next section), then open the app inside Contentstack.

> The mock server replaces a real ecommerce platform during development. In production you point the Advanced Settings rewrites at your real vendor instead.

## Advanced Settings (secure API calls)

The UI never calls the ecommerce platform directly with credentials. Instead it calls a clean rewrite path through `appSdk.api()`, and Contentstack rewrites the request to the real (or mock) vendor while injecting the API key server-side.

The flow:

```
Config page (API Key field)  ->  serverConfiguration.api_key   (stored server-side, never sent to the browser)
                                        |
              Advanced Settings Mapping: API_KEY -> api_key
                                        |
   appSdk.api("/ecom/products", { headers: { Authorization: "Bearer {{map.API_KEY}}" }})
                                        |
       Advanced Settings Rewrite: /ecom/* -> <vendor>/...   (key substituted server-side)
                                        |
                          Ecommerce vendor API returns data
```

Configure the following in **Developer Hub → your app → Advanced Settings**:

**Mapping**

| Name | Value (server-config path) |
|------|----------------------------|
| `API_KEY` | `api_key` |

**Rewrites** (replace `<your-tunnel-host>` with the public tunnel that forwards to `localhost:8080`):

| Source | Destination |
|--------|-------------|
| `/ecom/products/:id` | `https://<your-tunnel-host>/products/:id` |
| `/ecom/products` | `https://<your-tunnel-host>/products` |
| `/ecom/catalogs` | `https://<your-tunnel-host>/catalogs` |

The rewrite base path (`/ecom`) and the auth header template (`Bearer {{map.API_KEY}}`) are defined in `ui/src/services/config.ts`.

Finally, open the app's **config page** and paste your ecommerce API key (for the mock server, this is the `ECOM_API_KEY` from `ecommerce-mock-server/.env`). It is saved to `serverConfiguration.api_key`.

## Provider

* `<MarketplaceAppProvider>`: Initializes the Contentstack SDK and makes the SDK instance available via hooks (avoids prop drilling). It also hands the SDK to the ecommerce client so service calls can reach the vendor API.
* `<AppConfigurationExtensionProvider>`: Initializes the configuration screen.
* `<CustomFieldExtensionProvider>`: Performs operations on the Custom Fields (Product and Category).
* `<EntrySidebarExtensionProvider>`: Provides relevant data to the Entry Sidebar Widget.

## Hooks

* `useAppConfig`: Returns the app configuration data.
* `useAppLocation`: Returns the location name (e.g. CustomField) and the location instance from the SDK.
* `useAppSdk`: Returns the appSdk instance after initialization.
* `useError`: Getter and setter for app errors that occur due to API calls or configuration issues.
* `useCustomField`: Getter and setter for custom field data.
* `useFrame`: Returns the iframe instance for the location.
* `useInstallationData`: Getter & setter for installation data.
* `useSdkDataByPath`: Generic hook that returns the value at the given path.

## Routes

Each route represents one location. It is recommended to lazy-load the route components to reduce the bundle size.

#### Adding a new route

* Create a new Route component inside the route folder (use default export).
  * Inside `App.tsx`, lazy-load the route component:

    ```javascript
    const AppConfigurationExtension = React.lazy(() => import("../ConfigScreen/index"))
    ```

  * Add the route wrapped inside `Suspense`:

    ```javascript
    <Route path="/config" element={
      <Suspense>
        <AppConfigurationExtensionProvider>
          <AppConfigurationExtension />
        </AppConfigurationExtensionProvider>
      </Suspense>}
    />
    ```

## Styling

* This setup uses SCSS for styling.
* Style files live under `ui/src/containers/<COMPONENT_NAME>/styles.scss`.

## Manually creating an app in Developer Hub/Marketplace

* Go to Developer Hub at <https://app.contentstack.com/#!/developerhub>
* Create a new app (**+ New App**), select the app type, and add a name and description. The app is private initially; contact Contentstack to make it public.
* On the Basic Information page, add an icon for your app.
* Open the **UI Locations** tab and add your app's URL (e.g. `https://localhost:4000`). From Available location(s), add:
  * **App Configuration** — path `/config`
  * **Custom Field** (Product) — path `/product-field`, Data Type JSON
  * **Custom Field** (Category) — path `/category-field`, Data Type JSON
  * **Entry Sidebar** — path `/sidebar-widget`
* Open the **Advanced Settings** tab and add the Mapping and Rewrites described in [Advanced Settings](#advanced-settings-secure-api-calls).
* Install the app (**Install App**) into the stack of your choice.

> Note: You can use any path values, but the path in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx` and in the UI location must match.

## Source code file locations for various UI locations

| UI Location | Page Source |
|-------------|-------------|
| Config Screen | `<APP_DIRECTORY>/ui/src/containers/ConfigScreen/index.tsx` |
| Custom Field | `<APP_DIRECTORY>/ui/src/containers/CustomField/index.tsx` |
| Product Custom Field | `<APP_DIRECTORY>/ui/src/containers/CustomField/Product.tsx` |
| Category Custom Field | `<APP_DIRECTORY>/ui/src/containers/CustomField/Category.tsx` |
| Entry Sidebar | `<APP_DIRECTORY>/ui/src/containers/SidebarWidget/index.tsx` |

## Production Setup

This app is frontend-only, so the production build is just the UI React app. `build.sh` builds the UI and outputs `to-deploy/ui.zip`:

```bash
bash build.sh
```

To create and deploy the production marketplace app on Launch, see [scripts/README.md](./scripts/README.md). The environment variables in `<APP_DIRECTORY>/ui/.env` are used during the app's deployment on Launch.

> In production, the `ecommerce-mock-server/` is **not** deployed. Point your Advanced Settings rewrites at your real ecommerce vendor's API, and store your real API key on the config page.

## Customizing the boilerplate for your ecommerce platform

To adapt this boilerplate to your ecommerce platform, you mainly change `ui/src/root_config/index.tsx` (how UI elements/data are shaped) and `ui/src/services/` (how the vendor API is called). See [`TEMPLATE.md`](./TEMPLATE.md) for full details on the root config and the ecommerce data layer.

Reference implementations for platforms like BigCommerce and SAP Commerce Cloud are available under the `examples/` directory. You can copy the contents of `examples/<APPNAME>/ui/root_config/index.ts` into `ui/src/root_config/index.tsx` and adapt the service layer accordingly.

## Documentation Link

[Marketplace Ecommerce App Boilerplate](https://www.contentstack.com/docs/developers/developer-hub/marketplace-ecommerce-app-boilerplate)
