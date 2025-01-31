# Marketplace eCommerce App Boilerplate Template Documentation

## Front End

### UI Locations
- `Config Screen`
- `Product Custom Field`
    - `Product Selector Page`
- `Category Custom Field`
    - `Category Selector Page`
- `Sidebar Widget`

## eCommerce Root Configuration
The root configuration is the file you need to make the most changes to. You need to define and specify how the UI elements of your app will be handled here.

## Environment Variables

Type: 

```
{
  REACT_APP_NAME: string;
  SELECTOR_PAGE_LOGO: SVG;
  APP_ENG_NAME: string;
  UNIQUE_KEY: {
    product: string;
    category: string;
  }
  ENABLE_MULTI_CONFIG: boolean,
}
```


|Key                    | Type            | Description
|-----------------------|-----------------|---------------------------------------------|
|REACT_APP_NAME*       |String     |This defines the name of the app |
|SELECTOR_PAGE_LOGO*   |Svg code of Logo  |Svg code of Logo for Selector page |
|APP_ENG_NAME*   |String |This value is used to display the app name in error messages |
|UNIQUE_KEY* |Object  |Unique Identifier for the product and category object returned from the API Eg. `{product: 'id', category: 'id'}` |
|ENABLE_MULTI_CONFIG*   | boolean          | This determines whether to enable multi-configuration for the eCommerce app.

## Configuration Screen

### Root Config 
Navigate to the root_config file `(ui/src/root_config/index.ts)`.
In this file, you need to make two changes. 

1. `configureConfigScreen()` function
* This function will return objects of Config Screen keys along with their corresponding field key names and functionality. An example can be found in the codebase.
```
configfield: {
    type: "textInputfiled",
    labelText: "",
    helpText: "",
    placeholderText: "",
    instructionText: "",
    saveInConfig: ",
    saveInServerConfig: "",
    isSensitive: "",
    isMultiConfig: "" 
    isConfidential: ,
    isApiValidationEnabled: ,
    suffixName: "",
    allowDuplicateKeyValue: ,
    required: ,
  },
```

|Key                    | Type            | Description
|-----------------------|-----------------|---------------------------------------------|
|type*            |string    | type of field, here textfield is handled |
|labelText*      |string    |The label of the field. |
|helpText  |string |Help text for the field. Appears as a tooltip beside the label. |
|placeholderText |string |Placeholder for the input field. |
|instructionText* |string |Any additional information you want to display for that field. Appears below the input field.|
|saveInConfig |boolean |Determines whether you want to save it in a config |
|saveInServerConfig |boolean|Determines whether you want to save it in a serverconfig| 
|isSensitive  |boolean  |A boolean indicating if the input field contains sensitive data (e.g., passwords) |
|isMultiConfig  |boolean  |A boolean indicating if the key should be stored in multi-configurations|
|isConfidential  |boolean  |A boolean indicating if the key needs to be encrypted/decrypted|
|isApiValidationEnabled  |boolean  |A boolean indicating if the key needs to be validated by api or not|
|suffixName  |boolean  |A String indicating suffix when isSensitive is set to true|
|allowDuplicateKeyValue  |boolean  | A boolean to indicate whether to allow duplicate values for these key for multiconfig|


You can use this object in the configuration page code. 

2. `getCustomKeys()` Function
(ui/src/root_config/index.ts)
* The getCustomKeys() function gets called to populate the Custom Keys select options in the configuration page. This feature allows the user to select what keys they want to save in the entry whenever Custom JSON is selected.
* It should return an array of objects of the following type:

```
[{
    label: string,
    value: string,
    searchLabel: string,
    isDisabled? : boolean
}]
```



## API Requirements
To support MultiConfig across all APIs, additional parameters need to be included in API requests:

Detailed Documentation :https://docs.google.com/document/d/1Eq-wFLABdED13Zf9V03J_kbusnU4gagS3ly8ekYjgoQ/edit?tab=t.0
## Overview
MultiConfig support allows a single application to handle multiple configurations in a single step. This enables better organization and tracking of products and categories across different configurations.

### Required Parameters
```json
cs_metadata: {
    "multiConfigName": "configKey", // The name of the multi-config used
    "isConfigDeleted": false // Indicates that the configuration is not deleted
}
```

### Purpose of Parameters
- **multiConfigName**: Tracks which configuration a product or category belongs to.
- **isConfigDeleted**: Ensures that configurations marked as deleted are not processed.

## Implementation
Ensure that all API endpoints handling configurations, products, and categories include the `cs_metadata` object in their request/response payloads. This allows seamless tracking and management of different configurations within the same application.

## Notes
- Always ensure `multiConfigName` is correctly assigned to prevent misclassification.
- `isConfigDeleted` should be updated accordingly when configurations are removed.
- Proper logging should be implemented to monitor configuration usage and modifications.

This ensures a streamlined approach to handling multiple configurations within a single application.


## Product Custom Field

In the Product Custom Field, you need to implement the `returnFormattedProduct()` function. 

### Definition

`returnFormattedProduct()`: Function
* This function assigns and returns the required data formatting to be displayed in the product custom field.

* Parameter
`product` - this variable contains the product returned from your commerce API. You need to restructure it into the following format and return it.
```
# Product Data Model

This document outlines the structure of the product data model and provides descriptions for each field.

## Fields

- **id** (`string`):  
  A unique identifier for the product.

- **name** (`string`):  
  The name of the product.

- **description** (`string`):  
  A brief description of the product.

- **image** (`string`):  
  URL or path to the product image.

- **price** (`string`):  
  The price of the product in string format.

- **sku** (`string`, optional):  
  Stock Keeping Unit – a unique identifier for inventory management.

- **isProductDeleted** (`boolean`):  
  A flag sent from the backend to track whether the product configuration has been deleted from the config gateway.

- **cs_metadata** (`string`):  
  Extra metadata added from the API side, primarily used for multi-configuration purposes. More details are available in the API section.

- **multiConfigName** (`string`):  
  A unique identifier for multi-configuration settings.

- **isDeletedFromPortal** (`boolean`):  
  A boolean flag indicating whether the asset has been deleted from the e-commerce portal.

```
Use the `product` parameter to provide the values to these keys accordingly.

## Category Custom Field

For the Category Custom Field to work, you need to implement the `returnFormattedCategory()` function.

### Definition

`returnFormattedCategory()`: Function
* This function assigns and returns required data formatting to be displayed in the category custom field.

* Parameter
`category` - this variable contains the category returned from your commerce API. You need to restructure it into the following format and return it. 
```
# Category Data Model

This document outlines the structure of the category data model and provides descriptions for each field.

## Fields

- **id** (`string`):  
  A unique identifier for the category. Defaults to an empty string if not available.

- **name** (`string`):  
  The localized name of the category. Falls back to `"-"` if not provided.

- **key** (`string`):  
  A unique key for the category, used for identification. Defaults to `"-"` if missing.

- **isCategoryDeleted** (`boolean`):  
  A flag that indicates whether the category configuration has been deleted from the config gateway. Pulled from `cs_metadata`.

- **multiConfigName** (`string`):  
  A unique identifier for the multi-configuration setup, sourced from `cs_metadata`.

- **isDeletedFromPortal** (`boolean`):  
  A flag indicating whether the category has been deleted from the e-commerce portal. Pulled from `cs_metadata`.

- **image** (`string`):  
  URL or path to the category image. Defaults to an empty string if not available.

```
Use the `category` parameter to provide the values to these keys accordingly.

## Sidebar Widget

By default, the sidebar widget will contain the Name, Description, Price, SKU, and Image. If you want to add additional details to the sidebar widget, you can implement getSidebarData() which will return an array of the following type:
```
{
    title: string,
    value: string
}
```
Here, the `title` corresponds to the label that you want to display, and the `value` is the actual data to be displayed under that label.

## Selector Page

At the selector page, you need to define the columns that will be displayed in the table. You can do this by calling the `getProductSelectorColumns()` and `getCategorySelectorColumns()` functions.
You get access to the `config` object as the parameter in these functions.
These functions return a separate array of objects that defines columns for the product selector page and category selector page. You can specify the array of columns as follows:
```
{
    Header: string;
    id?: string | undefined;
    accessor: string | Function;
    default?: boolean | undefined;
    disableSortBy?: boolean | undefined;
    Cell?: ((props: any) => React.ReactNode) | undefined;
    addToColumnSelector?: boolean | undefined;
    cssClass?: string | undefined;
    columnWidthMultiplier?: number | undefined;
}
```
|Key                    | Type            | Description
|-----------------------|-----------------|-------------------------------------------|
|Header*      |String     |The Title of the Column |
|id*  |string |This is the unique ID for the column. It is used by reference in things like sorting, grouping, filtering, etc. |
|accessor* |String, Function |* builds the data model for your column. If a string is passed, the column's value will be looked up on the original row via that key, eg. If your column's accessor is ‘name’ then its value would be read from row['name']. You can also specify deeply nested values with accessors like ‘row.name.eng’ or even ‘names[0].value’ If a function is passed, the column's value will be looked up on the original row using this accessor function, eg. If your column's accessor is row => row.firstName, then its value would be determined by passing the row to this function and using the resulting value. |
|default |boolean  |   |
|disableSortBy   |boolean   |Determines whether you want that column to be sortable. |
|Cell  |Function returning a react node   | |
|addToColumnSelector   |boolean   |Determines whether you want to include this column in the column selector. |
|cssClass |string |You can define a custom CSS class to this particular column |
|columnWidthMultiplier |number |* multiplies this number with one unit of the column width. * 0.x means smaller than one specified unit by 0.x times * x means bigger than one specified unit by x times

## Other Functions In Root Config

#### 1. `getFormattedResponse()`
Parameters:
response: response from the commerce API
Returns the formatted response as follows:
```
{
    items: Array<any>,
    meta: {
        total: number,
        current_page: number,
    }
}
```
You may assign the corresponding values to the specified keys from the `response` objects.

#### 2. `getOpenerLink()`
Parameters:
id : product or category id
config: configuration object
type: product/category

This must return a `string` that corresponds to the particular product or category in your Commerce Application. This will be used in the Selector Page and in the Custom Field.

#### 3. `verifyAppSigning()`
Parameters:
app_token: string

This function is used for app signing, i.e. for verifying app tokens in the UI

#### 4. `removeItemsFromCustomField()`
Parameters:
```
removeId: string
selectedIds: Array<objects>
type: "product" | "category"
unikeyKey: string
```

If you have a requirement wherein you need to perform multiple checks or validations on the items selected in the custom field, you can use this function to remove the items from the custom field. You must return an array of products/categories ater removing your desired object.




## Back End
The backend implementation for this app will be present in the /api folder at the root level. 

Here, you need to make changes in one files.
* `root_config` (/api/root_config/index.js)

## Root Config
(/api/root_config/index.js)

* The Root Config will contain all important information about making API calls to the third-party service. You can use this config in the handler file while fetching the data.

Currently, we have the following configurations:

### Keys

- `API_BASE_URL`: This will be the base URL for your Commerce API calls

- `URI_ENDPOINTS`: This maps the separate endpoints for product and category fetching.
- `SEARCH_URL_PARAMS`: If you have a separate endpoint for your Commerce's search API, you can add it here
- `SENSITIVE_CONFIG_KEYS`: These are the keys that are sent encrypted from the UI, and are decrypted in the backend. You may enter the keys which you marked as `isSensitive: true` in the Config Screen Configuration.
- `getSeparateProductsAndCategories`: This serves as a
configuration setting that indicates whether the API should handle and retrieve products and categories separately when making API calls. If you have very disctinct configurations to make API calls for fetching products and categories, and you want to separate them, you can set this property to `true`

    When set to `true`, you must implement the following:
    ```
    1. getAllProducts()
    2. getAllCategories()
    3. getSelectedProductsById()
    4. getSelectedCategoriesById()
    ```

    If set to false, you need to implement the following:
    ```
    1. getAllProductsAndCategories()
    2. getSelectedProductsandCategories()
    ```
    This setting helps in organizing and managing the data retrieval process more efficiently based on the specific requirements related to products and categories within the commerce application.

### Functions

All these functions have two parameters: `data` and `body`. 

`data` has everything that is sent as a query string parameter
`body` has the configuration data

#### Required Functions:

- `getSingleProduct()`

this function should fetch and return a single product.

#### Required Functions, if `getSeparateProductsAndCategories: true`:

- `getSelectedProductsById()`

this function fetches multiple products and returns an array of products. 

- `getSelectedCategoriesById()`

this function fetches multiple categories and returns an array of categories. 

- `getAllProducts()`

this functions fetches all products, and returns an array of products along with pagination related data

- `getAllCategories()`

this functions fetches all categories, and returns an array of categories along with pagination related data

#### Required Functions, if `getSeparateProductsAndCategories: false`:

If your functions for fetching products and catgories are fairly similar, you can use a common function to get them.

- `getSelectedProductsandCategories()`

this function fetches both product and categories and returns an array containing these.

- `getAllProductsAndCategories()`

this function returns either all products or all categories to be displayed in the selector page.

Additionally, if you have your app specific details or function, you can add them in the root_config and manage it accordingly in the handler file. These URLs are being used to make API calls in the handler file. You can modify these existing ones, and even add more, based on your usage.


## Additional Information
### App Signing and Sensitive Information
#### All the UI locations are signed by default in this template. 
The Sensitive Information in the configuration of the app (like Auth Tokens, API Keys) should ideally be saved in `server_configuration`, so that it is not visible in API calls made on UI Locations. You can make use of App Webhooks in order to trigger sending configuration information to your backend and save the sensitive information at the backend as per your needs. Enabling the `Update` webhook in the app will send the configuration information to your backend whenever the configuration is saved. With this, you can preserve sensitive information from unauthorized users.

API calls that are made on UI locations gets triggered from the service file i.e. `ui/src/services/index.ts`

## App Manifest for eCommerce Apps
* **Name**: Your App Name
* **UI Locations:**
- 1. App Configuration
    - a. Name: Your App Name
    - b. Path: /config
    - c. Signed: enabled
    - d. Enabled: enabled
- 2. Custom Field
    - Product Custom Field
        - a. Name: Your App Name - Product Field
        - b. Path: /product-field
        - c. Signed: enabled
        - d. Enabled: enabled
        - e. Data Type: JSON
    - Category Custom Field
        - a. Name: Your App Name - Category Field
        - b. Path: /category-field
        - c. Signed: enabled
        - d. Enabled: enabled
        - e. Data Type: JSON
- 3. Entry Sidebar
    - a. Name: Your App Name
    - b. Path: /sidebar-widget
    - c. Signed: enabled
    - d. Enabled: enabled

**For adding Webhooks**
* Enable Webhook: True
* URL To Notify: Absolute URL of your backend
* App Events: Install, Update, Uninstall



