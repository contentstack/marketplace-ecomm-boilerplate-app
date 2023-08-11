# Contentstack Marketplace ECOMMERCE App Boilerplate Documentation

## UI Locations
- `Config Screen`
- `Product Custom Field`
    - `Product Selector Page`
- `Category Custom Field`
    - `Category Selector Page`
- `Sidebar Widget`

## ECommerce Root Configuration
* The root configuration is the file you need to make the most changes to. You need to define and specify how the UI elements of your app will be handled here.

## Environment Variables

|Key                    | Type            | Description
|-----------------------|-----------------|---------------------------------------------|
|REACT_APP_NAME*       |String     |This defines the name of the app |
|SELECTOR_PAGE_LOGO*   |Svg code of Logo  |Svg code of Logo for Selector page |
|APP_ENG_NAME*   |String |This value is used to display the app name in error messages |
|UNIQUE_KEY* |String  |Unique Identifier for the object returned from the API Eg. ‘id’, ‘key’ |
|FETCH_PER_PAGE    |Integer   |The number of objects you want to fetch per page in the selector page. Default: 20 |

## Configuration Screen

### Step 1. Root Config 
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
### Step 2. Config Screen
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

* In the Product Custom Field, you only need to implement the `returnFormattedProduct()` function. 

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

* By default, the sidebar widget will contain the Name, Description, Price, SKU, and Image. If you want to add additional details to the sidebar widget, you can implement getSidebarData() which will return an array of the following type:
```
{
    title: string,
    value: string
}
```
Here, the `title`` corresponds to the label that you want to display, and the `value` is the actual data to be displayed under that label.

## Selector Page

* At the selector page, you need to define a separate array of objects that defines columns for the product selector page and category selector page. You can specify the array of columns as follows:
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
|accessor* |String, Function |* builds the data model for your column.
* If a string is passed, the column's value will be looked up on the original row via that key, eg. If your column's accessor is ‘name’ then its value would be read from row['name']. You can also specify deeply nested values with accessors like ‘row.name.eng’ or even ‘names[0].value’
If a function is passed, the column's value will be looked up on the original row using this accessor function, eg. If your column's accessor is row => row.firstName, then its value would be determined by passing the row to this function and using the resulting value. |
|default |boolean  |   |
|disableSortBy   |boolean   |Determines whether you want that column to be sortable. |
|Cell  |Function returning a react node   | |
|addToColumnSelector   |boolean   |Determines whether you want to include this column in the column selector. |
|cssClass |string |You can define a custom CSS class to this particular column |
|columnWidthMultiplier |number |* multiplies this number with one unit of the column width. * 0.x means smaller than one specified unit by 0.x times
* x means bigger than one specified unit by x times
