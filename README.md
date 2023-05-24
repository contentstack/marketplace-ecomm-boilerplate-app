# marketplace-ecomm-boilerplate-app
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
        |-- index.js
    |-- example
    |   |-- sapcc
    |   |   |-- root_config
    |   |   |   |-- index.js
    |   |-- sfcc
    |       |-- root_config
    |       |   |-- index.js
    |-- handler
        |-- index.js
    |-- root_config
    |   |-- index.js
    |-- .eslintrc.js
    |-- index.js
    |-- package-lock.json
    |-- package.json
|-- ui
    |-- example
    |   |-- sapcc
    |   |   |-- root_config
    |   |   |   |-- index.tsx
    |   |-- sfcc
    |       |-- root_config
    |       |   |-- index.tsx
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |-- src
        |-- assets
            |-- Logo.svg
    |-- common
        |-- constants
            |-- index.ts
        |-- locale
            |-- index.ts
        |-- types
            |-- index.ts
        |-- utils
            |-- index.tsx
    |-- components
        |-- ErrorBoundary
            |-- index.tsx
        |-- WarningMessage
            |-- index.tsx
            |-- styles.scss
    |-- containers
        |-- App
            |-- index.tsx
            |-- styles.scss
        |-- CategoryField
            |-- index.tsx
        |-- ConfigScreen
            |-- index.spec.tsx
            |-- index.tsx
            |-- styles.scss
        |-- CustomField
            |-- Category.tsx
            |-- DeleteModal.tsx
            |-- DraggableGrid.tsx
            |-- DraggableListItem.tsx
            |-- index.spec.tsx
            |-- index.tsx
            |-- ListItem.tsx
            |-- Product.tsx
            |-- RenderList.tsx
            |-- styles.scss
        |-- ProductsField
            |-- index.tsx
        |-- SelectorPage
            |-- index.tsx
            |-- styles.scss
        |-- SidebarWidget
            |-- index.tsx
            |-- ProductDescription.tsx
            |-- styles.scss
    |-- root_config
        |-- index.ts
    |-- services
        |-- index.ts
    |-- types
        |-- index.d.ts
    |-- index.css
    |-- index.tsx
    |-- react-app-env.d.ts
    |-- reportWebVitals.ts
```

</details>

* To start the development of a ECOMMERCE app using boilerplate, first Clone ECOMMERCE Boilerplate GitHub Repository and copy the content of this repo to the new repo of your APP. 
* The new app repo source folder will be referred to as APP_DIRECTORY from now on.
* Open the package.json inside the ui and api folders (`<APP_DIRECTORY>/ui/package.json` & `<APP_DIRECTORY>/api/package.json`) and update the name attribute to your app name. 
* Open the root html file of the app (available at `<APP_DIRECTORY>/ui/public/index.html`) and update the `<title>` tag value to the name of your app.
* Change the favicon.ico as per the requirement of your app. favicon.ico file is available at `<APP_DIRECTORY>/ui/public/favicon.ico`.

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
* After you install the packages, run the following command in the ui folder to get started:
```
npm run start
```
The UI server will start at port 4000.
* To install the necessary packages for API , navigate to the API folder
```
cd <APP_DIRECTORY>/ui/rte
npm i
```
* After you install the packages, run the following command in the API folder to start the server.
```
npm run dev
```
The API server will start at port 8000.

## Environment Variables

* `.env` files are required in both ui. Rename `.env.example` files to `.env` and add value for `REACT_APP_NAME`,  `REACT_APP_UI_URL` `REACT_APP_API_URL`. 
* The value of `REACT_APP_UI_URL` is the URL of your app (the url for ui will be http://localhost:4000 and the url for api will be http://localhost:8000).

## Creating an app in Developer Hub/Marketplace

* Go to developer hub at https://app.contentstack.com/#!/developerhub
* Create a new app by clicking + New App button at top right and Select app type, add name and description.The app will be initially private. If you want to make that app public,then you need to contact us. 
* After creating an app, you will be redirected to the Basic Information page. Add the icon for your app. 
* Open the UI Locations tab and add the URL of your app. 
For e.g. : https://localhost:4000
* From Available location(s) , add App Configuration, Custom Field and Entry Sidebar. For App Configuration, add name and path. In `<APP_DIRECTORY>/ui/src/containers/App/index.tsx`, for App Configuration we have added route path as `/config`. Also we are using HashRouter for routing. So the value of path should be `/#/config`. Switch on the toggle for Signed if required. Switch on the toggle for Enabled to enable the Configuration location. Add the description if required.
* For Custom Field, add name and path. The value of path should be `/product-field`. Add one more Custom Fied add name and path. The value for second path should be `/category-field`. Switch on the toggle for Enabled to enable the Custom Field location.Select the required Data Type. Add the description if required.
* For Entry Sidebar Field, add name and path. The value of path should be /sidebar-widget. Switch on the toggle for Enabled to enable the Custom Field location. Add the description if required. 

* Now install the app by clicking the Install App button at top right. From the next window, select the stack in which you want to install the app.

Note : You can give any path values but make sure the path value in `<APP_DIRECTORY>/ui/src/containers/App/index.tsx` and in UI location should be the same.

## Source code file locations for various ui location

* After the app is installed, you can refer to the pages developed at various UI locations in the stack. Below are the various UI locations and their corresponding page in source code:

|UI Location      | Page Source                                                 |
|------------     |-------------                                                |
|Config Screen    |<APP_DIRECTORY>/ui/src/containers/ConfigScreen/index.tsx     |
|Custom Field     |<APP_DIRECTORY>/ui/src/containers/CustomField/index.tsx      |
|Entry Sidebar    |<APP_DIRECTORY>/ui/src/containers/SidebarWidget/index.tsx    |

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

## Reference to documentation

* [Marketplace ECOMMERCE App Boilerplate](https://docs.google.com/document/d/1Ad1qj_PUAfuxZtHVOR2xtOl76dgaDzAQ3PJXuK3hvnM/edit#heading=h.9xnzqz46c5ew)
