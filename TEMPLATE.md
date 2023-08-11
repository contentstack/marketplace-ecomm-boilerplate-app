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
|UNIQUE_KEY* |String  |Unique Identifier for the object returned from the API
Eg. ‘id’, ‘key’ |
|FETCH_PER_PAGE    |Integer   |The number of objects you want to fetch per page in the selector page. Default: 20