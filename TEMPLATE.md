# Marketplace Ecommerce App Boilerplate Template Documentation

## * Front End

## UI Locations
- `Config Screen`
- `Product Custom Field`
    - `Product Selector Page`
- `Category Custom Field`
    - `Category Selector Page`
- `Sidebar Widget`

## ECommerce Root Configuration
The root configuration is the file you need to make the most changes to. You need to define and specify how the UI elements of your app will be handled here.

## Environment Variables

|Key                    | Type            | Description
|-----------------------|-----------------|---------------------------------------------|
|REACT_APP_NAME*       |String     |This defines the name of the app |
|SELECTOR_PAGE_LOGO*   |Svg code of Logo  |Svg code of Logo for Selector page |
|APP_ENG_NAME*   |String |This value is used to display the app name in error messages |
|UNIQUE_KEY* |String  |Unique Identifier for the object returned from the API Eg. ‘id’, ‘key’ |
|FETCH_PER_PAGE    |Integer   |The number of objects you want to fetch per page in the selector page. Default: 20 |

## Configuration Screen

### Root Config 
Navigate to the root_config file (ui/src/root_config/index.ts)
In this file, you need to make two changes. 

1. `ecommerceConfigFields` variable
* ecommerceConfigFields is an object that will contain objects of the type ConfigInfo along with their corresponding field key names. An example can be found in the codebase.
```
ConfigInfo : {
    label: string,
    help?: string,
    placeholder?: string,
    instruction: string
}
```
|Key                    | Type            | Description
|-----------------------|-----------------|---------------------------------------------|
|label*      |string    |The label of the field. |
|help  |string |Help text for the field. Appears as a tooltip beside the label. |
|placeholder |string |Placeholder for the input field. |
|instruction* |string |Any additional information you want to display for that field. Appears below the input field.|

You can use this object in the configuration page code. 

2. `getCustomKeys()` Function
(ui/src/root_config/index.ts)
* The getCustomKeys() function gets called to populate the Custom Keys select options in the configuration page. This allows you to select what keys you want to save in the entry whenever Custom JSON is selected.
* It should return an array of objects of the following type:

```
[{
    label: string,
    value: string,
    searchLabel: string,
    isDisabled? : boolean
}]
```
### Config Screen
Navigate to index.tsx of ConfigScreen (ui/src/containers/ConfigScreen/index.tsx).
* Under the state variable, add your required configuration variables. 
* The key defined here should match with the name attribute given in the JSX element that handles input to these states.
* Best Practice: You should ideally store sensitive information (like API Keys, Auth Tokens) in the server_configuration in the app state. The data saved in the server_configuration is not exposed in any UI locations.
* You must use the ecommerceConfigFields object defined in the root_config here to build your components that take input for the corresponding config variables.

For example, if your state variable is `store_id`, the JSX code that handles this should look something like this:

```
  <Field>
    <div className="flex">
        <FieldLabel required htmlFor="store_id">
        {" "}
        {/* Change the label caption as per your requirement */}
        {rootConfig.ecommerceConfigFields.ConfigInfo.label}
        </FieldLabel>
        {/* Change the help caption as per your requirement */}
        <Help text={rootConfig.ecommerceConfigFields.ConfigInfo.help} />
    </div>
    <TextInput
        required
        value={state?.installationData?.configuration?.store_id}
        placeholder={
        rootConfig.ecommerceConfigFields.ConfigInfo.placeholder
        }
        name={rootConfig.ecommerceConfigFields.ConfigInfo.name}
        data-testid="store_id-input"
        onChange={updateConfig}
    />
    <InstructionText>
        {rootConfig.ecommerceConfigFields.ConfigInfo.instruction}
    </InstructionText>
    </Field>
```

## Product Custom Field

In the Product Custom Field, you only need to implement the `returnFormattedProduct()` function. 

### Definition

`returnFormattedProduct()`: Function
* This function performs the required data formatting to be displayed in the product custom field.

* Parameters
`product` - this variable contains the product returned from your commerce API. You need to restructure it into the following format and return it.
```
{
    id: string,
    name: string,
    description: string,
    image: string,
    price: string,
    sku?: string
}
```
Use the `product` parameter to provide the values to these keys accordingly.

## Category Custom Field

For the Category Custom Field to work, you need to implement the `returnFormattedCategory()` function.

### Definition

`returnFormattedCategory()`: Function
* This function performs required data formatting to be displayed in the category custom field.

* Parameters
`category` - this variable contains the category returned from your commerce API. You need to restructure it into the following format and return it. 
```
{
    id: string,
    name: string,
    customUrl?: string,
    description: string,
}
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

At the selector page, you need to define a separate array of objects that defines columns for the product selector page and category selector page. You can specify the array of columns as follows:
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
|id  |string |This is the unique ID for the column. It is used by reference in things like sorting, grouping, filtering, etc. |
|accessor* |String, Function |* builds the data model for your column. If a string is passed, the column's value will be looked up on the original row via that key, eg. If your column's accessor is ‘name’ then its value would be read from row['name']. You can also specify deeply nested values with accessors like ‘row.name.eng’ or even ‘names[0].value’ If a function is passed, the column's value will be looked up on the original row using this accessor function, eg. If your column's accessor is row => row.firstName, then its value would be determined by passing the row to this function and using the resulting value. |
|default |boolean  |   |
|disableSortBy   |boolean   |Determines whether you want that column to be sortable. |
|Cell  |Function returning a react node   | |
|addToColumnSelector   |boolean   |Determines whether you want to include this column in the column selector. |
|cssClass |string |You can define a custom CSS class to this particular column |
|columnWidthMultiplier |number |* multiplies this number with one unit of the column width. * 0.x means smaller than one specified unit by 0.x times * x means bigger than one specified unit by x times

## Other Functions

1. `getOpenerLink()`
(ui/src/root_config/index.ts)

Parameters:
Id : product or category id
config: configuration object
type: product/category

2. `makeAnApiCall()`
(ui/src/services/index.ts)

In this function, only at the successful API call, you will need to structure the data returned from your backend. It should be of the following format:
```
{
    error: boolean,
    data: {
        items: [],
        meta: {
            total: number,
            current_page: number
        }
    }
}
```
Please observe the data key. 
* In the `items` key, you need to provide the corresponding key that contains the array of products/categories from the response object.
* In the meta`` key, you need to assign the corresponding values of `total` and `current_page` from the response object. The `total` key indicates the number of items in the array, and `current_page` key indicates the page number, for pagination.

## * Back End
The backend implementation for this app will be present in the /api folder at the root level. 

Here, you need to make changes in two files.
* `root_config` (/api/root_config/index.js)
* `handler` ( /api/handler/index.js)

## Root Config
(/api/root_config/index.js)

* The Root Config will contain all important information about making API calls to the third-party service. You can use this config in the handler file while fetching the data.

Currently, we have the following configurations:
```
{
    API_BASE_URL: string,
    URI_ENDPOINTS: {
        product: string,
        category: string,
    },
    PRODUCT_URL_PARAMS: string,
}
```
These URLs are being used to make API calls in the handler file. You can modify these existing ones, and even add more, based on your usage.

## Handler
(/api/handler/index.js)
The handler file contains all the functions required to make API calls.
You will need to implement the following functions as per your requirements.

1. `_getHeaders(key)`:
This function must return an object that contains necessary headers to make an API call to the third-party service.

2. `_getApiOptions(queryParams, reqBody)`:
With this function, you can use the queryStringParameters from the UI’s API call to generate an option object that Axios can use. This must return an object that contains an object having URL, method, and headers for Axios to use.

3. `getProductAndCategory(queryParams, reqBody)`:
This function should return all the products and categories as per the query.

4. `getById(queryParams, reqBody)`:
This function should return a particular product or a category as per the requested ID and query.

5. `getSelectedProdsAndCats(queryParams, reqBody)`:
This function should return the given products and categories from the queryStringParameters. 

6. `filterByCategory(queryParams, reqBody)`:
This function should return products filtered by the given category in the queryStringParameters.

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

**Webhooks**
* Enable Webhook: True
* URL To Notify: Absolute URL of your backend
* App Events: Install, Update, Uninstall



