# Contentstack Marketplace ECOMMERCE App Boilerplate

This boilerplate provides a template to customize your own marketplace ECOMMERCE app.

## What this repo is

A template, not a deployed app. Real ecommerce apps (SAP Commerce Cloud, BigCommerce, Salesforce Commerce Cloud, Shopify and others) are copies of it. Each copy keeps its own history and does not receive later changes from here.

**What a copy inherits:** the `ui/` shell (providers, hooks, routes, selector page, Jest setup), the `api/` handler with config decryption, `build.sh`, the CI workflows and the husky pre-commit hook. App-specific logic goes in the two `root_config` files only.

**How to copy it:**

1. Create a new repo from this one and keep the same folder layout.
2. Rename the app (steps below), set the env vars, and replace `ui/src/root_config/index.ts` and `api/root_config/index.ts`. Start from `examples/bigcommerce/` or `examples/sapcc/`; see [`TEMPLATE.md`](./TEMPLATE.md).
3. Register the app in Developer Hub and install it in a stack (steps below).

## Prerequisite

* [Contentstack Account](https://app.contentstack.com/#!/login)
* Node.js and npm: the repo pins no version (no `.nvmrc` or `engines`). This README used to state Node 14.18.2 / npm 8.1.4, which is unverified; check the versions your `react-scripts` and TypeScript need.

## Structure

| Path | What it is |
| --- | --- |
| `api/` | TypeScript Lambda handler: `index.ts` (entry, decrypts sensitive config keys), `handler/index.ts` (product and category calls), `root_config/index.ts` (vendor settings), `constants/index.ts` |
| `ui/` | React 18 (create-react-app) app: `src/containers/` (ConfigScreen, CustomField, ProductsField, CategoryField, SelectorPage, SidebarWidget), `src/common/` (contexts, hooks, providers, utils), `src/root_config/index.ts`, `src/services/index.ts` |
| `ui/update-app-info.json` | Sample manifest with UI location paths |
| `examples/` | `bigcommerce` and `sapcc` `root_config` samples for ui and api |
| `build.sh` | Builds `api/` and `ui/` into `to-deploy/api.zip` and `to-deploy/ui.zip` |
| `TEMPLATE.md` | How to fill in the root config |

* The new app repo source folder will be referred to as APP_DIRECTORY from now on.
* Open the package.json inside the ui and api folders (`<APP_DIRECTORY>/ui/package.json` & `<APP_DIRECTORY>/api/package.json`) and update the name attribute to your app name. 
* Open the root html file of the app (available at `<APP_DIRECTORY>/ui/public/index.html`) and update the `<title>` tag value to the name of your app.
* Change the favicon.ico as per the requirement of your app. favicon.ico file is available at `<APP_DIRECTORY>/ui/public/favicon.ico`.

## Environment Variables

* A `.env` file is required in `<APP_DIRECTORY>/ui`. Copy `.env.example` to `.env` and set `REACT_APP_UI_URL` and `REACT_APP_API_URL` (names are also in `.env.sample`). Never commit a `.env` file.
* The value of `REACT_APP_UI_URL` is the URL of your app (the url for ui will be http://localhost:4000 and the url for api will be http://localhost:8080).

## Install Dependencies

* In the terminal go to APP_DIRECTORY and install the necessary packages :
```
cd <APP_DIRECTORY> 
npm i
```
* To install the necessary packages for ui , navigate to the ui folder
```
cd <APP_DIRECTORY>/ui 
npm i
``` 
* After you install the packages, run the following command in the ui folder to get started on all the Operation System(except Windows):
```
npm run start
```
* For Windows OS
```
npm run startWin
```

The UI server will start at port 4000.
* To install the necessary packages for API , navigate to the API folder
```
cd <APP_DIRECTORY>/api
npm i
```
* After you install the packages, run the following command in the API folder to start the server.
```
npm run dev
```
The API server will start at port 8080.
All the backend APIs are handled in `api/handler/index.ts` and all the UI API calls are handled in `ui/src/services/index.ts`.

## Development Server (server.ts)

The `server.ts` file is used for local development only. The production deployment is done on AWS Lambda, where the Lambda function calls the handler function in `./index.ts` (built) directly without any server requirement.

`npm run dev` runs `server.ts`, which is not in the repo. Create `server.ts` in the root of the api folder with the code below (uncommented).

```javascript
/* 
import express from "express";
import cors from "cors";
import handler from "./index";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port: number = 8080;

app.post("/", async (req: any, res: any) => {
  const event: any = {
    queryStringParameters: req.query,
    body: req.body,
  };
  const response: any = await handler(event);
  res.set(response.headers);
  res.status(response.statusCode).json(response.body);
});

app.listen(port, () => {
  console.info("Server listening at port ", port);
});
*/
```

In the API, the exports.handler function will be the entry point for processing incoming requests. Depending on the specific API route or endpoint, different predefined functions can be utilized for fetching products or categories from various third-party ecommerce systems are added inside handler/index.ts, enabling modular and flexible data retrieval based on the requested resource. 
Storing dynamic user data in the root config enables centralization, allowing the handler/index.ts to easily access and process this information, promoting consistency and simplifying data management within the API.

## Provider

- `<MarketplaceAppProvider>`:  This initialize the contentstack SDK make the SDK instance available via hooks to avoid props drilling.
- `<AppConfigurationExtensionProvider>`: This initialize the configuration screen.
- `<ProductCustomFieldExtensionProvider>`: This provider is responsible for Product Custom Field.
- `<CategoryCustomFieldExtensionProvider>`: This provider is responsible for Category Custom Field.
- `<EntrySidebarExtensionProvider>`: This provider is responsible for Entry Sidebarwidget.
- `<SelectorExtensionProvider>`: This provider is responsible for Selector Page.

## Hooks

- `useAppConfig`: Getter and setter hook for App config.
- `useAppLocation`: Returns the location name (eg: CustomField) and the location instance from the SDK.
- `useAppSdk`: Returns the appSdk instance after initialization.
- `useCategoryCustomField`: Getter and setter hook for category custom field data.
- `useCustomField`: Getter and setter hook for custom field data.
- `useFrame`: Returns the Iframe instance for the location.
- `useInstallationData`: Getter & Setter for installation data.
- `useProductCustomField`: Getter and setter hook for product custom field data.
- `useSdkDataByPath`: This is a generic hook which can return the value at the given path;

## Routes

Each route represents one location. It is recommended to lazy load the route components to reduce the bundle
size. 

#### Adding new route

- Create a new Route component inside route. Use default export
  - Inside `App.tsx`, lazy load the route component.  
    - eg: `const AppConfigurationExtension = React.lazy(() => import("../ConfigScreen/index"))`
  - Add the route wrapped inside `Suspense`. 
    - Eg: ``` <Route path="/config" element={<Suspense><AppConfigurationExtensionProvider><AppConfigurationExtension /></AppConfigurationExtensionProvider></Suspense>} />```

## Styling

- This setup uses basic CSS for styling

## Creating an app in Developer Hub/Marketplace

* Go to Developer Hub at https://app.contentstack.com/#!/developerhub
* Create a new app by clicking + New App button at top right and Select app type, add name and description.The app will be initially private. If you want to make that app public,then you need to contact us. 
* After creating an app, you will be redirected to the Basic Information page. Add the icon for your app. 
* Open the UI Locations tab and add the URL of your app. 
For e.g. : https://localhost:4000
* From Available location(s) , add App Configuration, Custom Field and Entry Sidebar. For App Configuration, add name and path. In `<APP_DIRECTORY>/ui/src/containers/App/index.tsx`, the App Configuration route path is `/config`. So the value of path should be `/config`. Switch on the toggle for Signed if required. Switch on the toggle for Enabled to enable the Configuration location. Add the description if required.
* For Custom Field, add name and path. The value of path should be `/product-field`. Add one more Custom Fied add name and path. The value for second path should be `/category-field`. Switch on the toggle for Enabled to enable the Custom Field location.Select the required Data Type. Add the description if required.
* For Entry Sidebar Field, add name and path. The value of path should be `/sidebar-widget`. Switch on the toggle for Enabled to enable the Custom Field location. Add the description if required. 

* Now install the app by clicking the Install App button at top right. From the next window, select the stack in which you want to install the app.

Note : You can give any path values but make sure the path value in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx` and in UI location should be the same.

## Source code file locations for various ui location

* After the app is installed, you can refer to the pages developed at various UI locations in the stack. Below are the various UI locations and their corresponding page in source code:

|UI Location            | Page Source                                                 |
|-----------------------|-------------------------------------------------------------|
|Config Screen          |<APP_DIRECTORY>/ui/src/containers/ConfigScreen/index.tsx     |
|Custom Field           |<APP_DIRECTORY>/ui/src/containers/CustomField/index.tsx      |
|Product Custom Field   |<APP_DIRECTORY>/ui/src/containers/CustomField/Product.tsx    |
|Category Custom Field  |<APP_DIRECTORY>/ui/src/containers/CustomField/Category.tsx   |
|Entry Sidebar          |<APP_DIRECTORY>/ui/src/containers/SidebarWidget/index.tsx    |

* You can change the source codes and refer to the changes in UI now at corresponding places as mentioned above.

## Create Build

* To create build for ui, navigate to ui
```
cd <APP_DIRECTORY>/ui 
npm run build
```
* The api has no build script. `build.sh` installs production dependencies and zips the `api/` folder for Lambda: `bash build.sh` from the repo root also builds the UI and writes `to-deploy/api.zip` and `to-deploy/ui.zip`.
You need to upload all the files from the build folder on AWS S3 or any static file hosting service of your preference. 

## Updating changes to the boilerplate as per the third party platform

For continuing to develop your corresponding ecommerce app, you might have to do changes on root_config files on ui and api as per your needs. Please refer to the TEMPLATE.md file placed in  [`<APP_DIRECTORY>/TEMPLATE.md`](./TEMPLATE.md), to get to know more details about root_config files.

The `examples/` directory has samples for BigCommerce and SAP Commerce Cloud. Copy `examples/<app>/api/root_config/index.ts` and `examples/<app>/ui/root_config/index.ts` over the matching `root_config/index.ts` files in `api/` and `ui/`. Subsequently, you can restart the execution of both the UI and API components.

## Links

* Jira Epic: [MKT-19906](https://contentstack.atlassian.net/browse/MKT-19906)
* Wiki: `marketplace-apps/ecommboilerplate/` in `contentstack/product-wiki`, if present.
* Agents: see `CLAUDE.md`.

## Documentation Link 
[Marketplace Ecommerce App Boilerplate](https://www.contentstack.com/docs/developers/developer-hub/marketplace-ecommerce-app-boilerplate)
