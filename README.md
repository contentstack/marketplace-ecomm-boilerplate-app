# Contentstack Marketplace ECOMMERCE App Boilerplate

This boilerplate provides a template to customize your own marketplace ECOMMERCE app.

##  Prerequisite

* [Contentstack Account](https://app.contentstack.com/#!/login)
* Nodejs - v14.18.2 & NPM - 8.1.4

## Structure of the Marketplace Ecommerce App Boilerplate
<details>
  <summary>
    Reveal/Collapse the code structure
  </summary>
  
```bash
marketplace-ecomm-boilerplate-app
|-- api
    |-- constants
    |   |-- index.js
    |-- handler
    |   |-- index.js
    |-- root_config
    |   |-- index.js
    |-- .eslintrc.js
    |-- index.js
    |-- package-lock.json
    |-- package.json
|-- example
   |-- sapcc
      |-- api
        |-- root_config
          |-- index.js
      |-- ui
        |-- root_config
          |-- index.js
   |-- bigcommerce
      |-- api
        |-- root_config
          |-- index.js
      |-- ui
        |-- root_config
          |-- index.js
|-- ui
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |-- .env
    |-- src
    |   |-- assets
    |   |    |-- Logo.svg
    |   |-- common
    |   |    |-- constants
    |   |        |-- index.ts
    |   |    |-- contexts
    |   |        |-- appConfigurationExtensionContext.ts
    |   |        |-- categoryCustomFieldExtensionContext.ts
    |   |        |-- customFieldExtensionContext.ts
    |   |        |-- entrySidebarExtensionContext.ts
    |   |        |-- marketplaceContext.ts
    |   |        |-- productCustomFieldExtensionContext.ts      
    |   |        |-- selectorExtensionContext.ts    
    |   |   |-- hooks
    |   |       |-- useAppConfig.ts 
    |   |       |-- useAppLocation.ts
    |   |       |-- useAppSdk.tsx
    |   |       |-- useCategoryCustomField.tsx
    |   |       |-- useCustomField.tsx
    |   |       |-- uuseFrame.ts
    |   |       |-- useInstallationData.tsx    
    |   |       |-- useProductCustomField.tsx    
    |   |       |-- useSdkDataByPath.ts                                                   
    |   |    |-- locale
    |   |        |-- index.ts
    |   |   |-- providers
    |   |        |-- AppConfigurationExtensionProvider.tsx
    |   |        |-- CategoryCustomFieldExtensionProvider.tsx
    |   |        |-- CustomFieldExtensionProvider.tsx
    |   |        |-- EntrySidebarExtensionProvider.tsx
    |   |        |-- MarketplaceAppProvider.tsx
    |   |        |-- ProductCustomFieldExtensionProvider.tsx
    |   |        |-- SelectorExtensionProvider.tsx                                                     
    |   |   |-- types
    |   |       |-- index.ts
    |   |   |-- utils
    |   |   |   |-- index.tsx
    |   |-- components
    |   |   |-- ErrorBoundary
    |   |       |-- index.tsx
    |   |   |-- WarningMessage
    |   |       |-- index.tsx
    |   |       |-- styles.scss
    |   |-- containers
    |   |   |-- App
    |   |   |   |-- index.tsx
    |   |   |   |-- styles.scss
    |   |   |-- CategoryField
    |   |   |   |-- index.tsx
    |   |   |-- ConfigScreen
    |   |   |   |-- index.spec.tsx
    |   |   |   |-- index.tsx
    |   |   |   |-- styles.scss
    |   |   |-- CustomField
    |   |   |   |-- Category.tsx
    |   |   |   |-- DeleteModal.tsx
    |   |   |   |-- DraggableGrid.tsx
    |   |   |   |-- DraggableListItem.tsx
        |   |   |-- DraggableListItemCategory.tsx
    |   |   |   |-- index.spec.tsx
    |   |   |   |-- index.tsx
    |   |   |   |-- ListItem.tsx
    |   |   |   |-- Product.tsx
    |   |   |   |-- RenderList.tsx
    |   |   |   |-- styles.scss
    |   |   |-- ProductsField
    |   |   |   |-- index.tsx
    |   |   |-- SelectorPage
    |   |   |   |-- index.tsx
    |   |   |   |-- styles.scss
    |   |   |-- SidebarWidget
    |   |   |   |-- index.tsx
    |   |   |   |-- ProductDescription.tsx
    |   |   |   |-- styles.scss
    |   |-- root_config
    |   |    |-- index.ts
    |   |-- services
    |   |    |-- index.ts
    |   |-- types
    |   |   |-- index.d.ts
    |   |-- index.css
    |   |-- index.tsx
    |   |-- react-app-env.d.ts
    |   |-- reportWebVitals.ts
    |   |-- .babelrc
    |-- .eslintrc
    |-- config.overides.js
    |-- jest.config.js
    |-- jest.CSStub.js
    |-- jest.setup.js
    |-- package-lock.json
    |-- package.json
    |-- tsconfig.json
    |-- update-app-info.json
└─ .gitignore
└─ LICENSE
└─ README.md
└─ SECURITY.md
└─ build.sh
└─ package.lock.json
└─ package. json
```

</details>

* To start the development of a ECOMMERCE app using boilerplate, first Clone ECOMMERCE Boilerplate GitHub Repository and copy the content of this repo to the new repo of your APP. 
* The new app repo source folder will be referred to as APP_DIRECTORY from now on.
* Open the package.json inside the ui and api folders (`<APP_DIRECTORY>/ui/package.json` & `<APP_DIRECTORY>/api/package.json`) and update the name attribute to your app name. 
* Open the root html file of the app (available at `<APP_DIRECTORY>/ui/public/index.html`) and update the `<title>` tag value to the name of your app.
* Change the favicon.ico as per the requirement of your app. favicon.ico file is available at `<APP_DIRECTORY>/ui/public/favicon.ico`.

## Environment Variables

* `.env` file are required in <APP_DIRECTORY>/ui. Rename `.env.example` files to `.env` and add value for `REACT_APP_UI_URL` `REACT_APP_API_URL`. 
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
All the backend APIs are handled in an handler file in the `api/handler/index.js` and all the UI API calls are handled in the `ui/src/services.index.tsx` file.

In the API, the exports.handler function will be the entry point for processing incoming requests. Depending on the specific API route or endpoint, different predefined functions can be utilized for fetching products or categories from various third-party ecommerce systems are added inside handler/index.js, enabling modular and flexible data retrieval based on the requested resource. 
Storing dynamic user data in the root config enables centralization, allowing the handler/index.js to easily access and process this information, promoting consistency and simplifying data management within the API.

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

* Go to developer hub at https://app.contentstack.com/#!/developerhub
* Create a new app by clicking + New App button at top right and Select app type, add name and description.The app will be initially private. If you want to make that app public,then you need to contact us. 
* After creating an app, you will be redirected to the Basic Information page. Add the icon for your app. 
* Open the UI Locations tab and add the URL of your app. 
For e.g. : https://localhost:4000
* From Available location(s) , add App Configuration, Custom Field and Entry Sidebar. For App Configuration, add name and path. In `<APP_DIRECTORY>/ui/src/containers/App/index.tsx`, for App Configuration we have added route path as `/config`. So the value of path should be `/config`. Switch on the toggle for Signed if required. Switch on the toggle for Enabled to enable the Configuration location. Add the description if required.
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
|Product Custom Field   |<APP_DIRECTORY>/ui/src/containers/CustomField/Category.tsx   |
|Category Custom Field  |<APP_DIRECTORY>/ui/src/containers/CustomField/Product.tsx    |
|Entry Sidebar          |<APP_DIRECTORY>/ui/src/containers/SidebarWidget/index.tsx    |

* You can change the source codes and refer to the changes in UI now at corresponding places as mentioned above.

## Create Build

* To create build for ui, navigate to ui
```
cd <APP_DIRECTORY>/ui 
npm run build
```
* To create build for api, navigate to api
```
cd <APP_DIRECTORY>/api
npm run build
```
You need to upload all the files from the build folder on AWS S3 or any static file hosting service of your preference. 

## Updating changes to the boilerplate as per the third party platform

For continuing to develop your corresponding ecommerce app, you might have to do changes on root_config files on ui and api as per your needs. Please refer to the TEMPLATE.md file placed in  [`<APP_DIRECTORY>/TEMPLATE.md`](./TEMPLATE.md), to get to know more details about root_config files.

An illustrative file containing samples of ecommerce applications like BigCommerce and SAP Commerce Cloud app has been created within the 'example' directory. To confirm the functionality of the application, you can replicate the content of the `example/APPNAME/root_config/index.ts` file and apply it to the `root_config/index.ts of the API and UI` file. Subsequently, you can restart the execution of both the UI and API components.
