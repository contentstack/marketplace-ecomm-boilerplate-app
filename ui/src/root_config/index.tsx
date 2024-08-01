/* @typescript-eslint/naming-convention */
import React from "react";
import axios from "axios";
import { jwtVerify, importJWK, JWTPayload } from "jose";
import {
  ColumnsProp,
  Result,
  TypeCategory,
  KeyOption,
  TypeProduct,
  SidebarDataObj,
  EcommerceEnv,
  FormattedRespose,
  ValidationResult,
} from "../common/types";
// eslint-disable-next-line import/no-cycle
import { wrapWithDiv, getImage } from "../common/utils";
import Logo from "../assets/Logo.svg";
import MultiConfigCustomComponent from "../containers/ConfigScreen/MultiConfigCustomComponent";
import NonMultiConfigCustomComponent from "../containers/ConfigScreen/NonMultiConfigCustomComponent";
/* eslint-disable */
import categoryConfig from "./categories";
/* eslint-enable */

/* all values in this file are an example.
    You can modify its values and implementation,
    but please do not change any keys or function names.
*/

// Please refer to the doc for getting more information on each ecommerceEnv fields/keys.
const ecommerceEnv: EcommerceEnv = {
  REACT_APP_NAME: "sapcommercecloud",
  SELECTOR_PAGE_LOGO: Logo,
  APP_ENG_NAME: "SAP Commerce Cloud",
  UNIQUE_KEY: {
    product: "code",
    category: "id",
  },
};

// example config fields. you will need to use these values in the config screen accordingly.
const configureConfigScreen: any = () => ({
  region_url: {
    type: "selectInputFields",
    labelText: "Select Your commercetools Region",
    helpText: "Select Your commercetools Region",
    placeholderText: "Select Your commercetools Region",
    instructionText: "Select Your commercetools Region",
    saveInConfig: true,
    saveInServerConfig: false,
    isSensitive: false,
    isMultiConfig: true,
  },
  project_key: {
    type: "textInputFields",
    labelText: "Project Key",
    helpText: "Project Key",
    placeholderText: "Project Key",
    instructionText: "Project Key",
    saveInConfig: true,
    saveInServerConfig: false,
    isSensitive: false,
    isMultiConfig: true,
  },
  client_id: {
    type: "textInputFields",
    labelText: "Client ID",
    helpText: "Client ID",
    placeholderText: "Client ID",
    instructionText: "Client ID",
    saveInConfig: false,
    saveInServerConfig: true,
    isSensitive: false,
    isMultiConfig: true,
  },
  client_secret: {
    type: "textInputFields",
    labelText: "Client Secret",
    helpText: "Client Secret",
    placeholderText: "Client Secret",
    instructionText: "Client Secret",
    saveInConfig: false,
    saveInServerConfig: true,
    isSensitive: false,
    isMultiConfig: true,
  },
  access_token: {
    type: "textInputFields",
    labelText: "Access Token",
    helpText: "Access Token",
    placeholderText: "Access Token",
    instructionText: "Access Token",
    saveInConfig: true,
    saveInServerConfig: false,
    isSensitive: false,
    isMultiConfig: true,
  },
});

const getCustomKeys = (): KeyOption[] => [
  {
    label: "approvalStatus",
    value: "approvalStatus",
    searchLabel: "approvalStatus",
  },
  {
    label: "availableForPickup",
    value: "availableForPickup",
    searchLabel: "availableForPickup",
  },
  {
    label: "averageRating",
    value: "averageRating",
    searchLabel: "averageRating",
  },
  {
    label: "baseOptions",
    value: "baseOptions",
    searchLabel: "baseOptions",
  },
  {
    label: "baseProduct",
    value: "baseProduct",
    searchLabel: "baseProduct",
  },
  {
    label: "baseProductName",
    value: "baseProductName",
    searchLabel: "baseProductName",
  },
  {
    label: "categories",
    value: "categories",
    searchLabel: "categories",
  },
  {
    label: "children",
    value: "children",
    searchLabel: "children",
  },
  {
    label: "classifications",
    value: "classifications",
    searchLabel: "classifications",
  },
  {
    label: "code",
    value: "code",
    searchLabel: "code",
    isDisabled: true,
  },
  {
    label: "colors",
    value: "colors",
    searchLabel: "colors",
  },
  {
    label: "componentId",
    value: "componentId",
    searchLabel: "componentId",
  },
  {
    label: "configurable",
    value: "configurable",
    searchLabel: "configurable",
  },
  {
    label: "configuratorType",
    value: "configuratorType",
    searchLabel: "configuratorType",
  },
  {
    label: "description",
    value: "description",
    searchLabel: "description",
  },
  {
    label: "disabledMessage",
    value: "disabledMessage",
    searchLabel: "disabledMessage",
  },
  {
    label: "futureStocks",
    value: "futureStocks",
    searchLabel: "futureStocks",
  },
  {
    label: "hasParentBpos",
    value: "hasParentBpos",
    searchLabel: "hasParentBpos",
  },
  {
    label: "images",
    value: "images",
    searchLabel: "images",
  },
  {
    label: "isBundle",
    value: "isBundle",
    searchLabel: "isBundle",
  },
  {
    label: "isComponentEditable",
    value: "isComponentEditable",
    searchLabel: "isComponentEditable",
  },
  {
    label: "isMaxLimitReachedForBundle",
    value: "isMaxLimitReachedForBundle",
    searchLabel: "isMaxLimitReachedForBundle",
  },
  {
    label: "isRemovableEntry",
    value: "isRemovableEntry",
    searchLabel: "isRemovableEntry",
  },
  {
    label: "mainSpoPriceInBpo",
    value: "mainSpoPriceInBpo",
    searchLabel: "mainSpoPriceInBpo",
  },
  {
    label: "manufacturer",
    value: "manufacturer",
    searchLabel: "manufacturer",
  },
  {
    label: "modifiedTime",
    value: "modifiedTime",
    searchLabel: "modifiedTime",
  },
  {
    label: "multidimensional",
    value: "multidimensional",
    searchLabel: "multidimensional",
  },
  {
    label: "name",
    value: "name",
    searchLabel: "name",
    isDisabled: true,
  },
  {
    label: "numberOfReviews",
    value: "numberOfReviews",
    searchLabel: "numberOfReviews",
  },
  {
    label: "offeringGroup",
    value: "offeringGroup",
    searchLabel: "offeringGroup",
  },
  {
    label: "parents",
    value: "parents",
    searchLabel: "parents",
  },
  {
    label: "potentialPromotions",
    value: "potentialPromotions",
    searchLabel: "potentialPromotions",
  },
  {
    label: "preselected",
    value: "preselected",
    searchLabel: "preselected",
  },
  {
    label: "price",
    value: "price",
    searchLabel: "price",
  },
  {
    label: "priceRange",
    value: "priceRange",
    searchLabel: "priceRange",
  },
  {
    label: "productOfferingPrice",
    value: "productOfferingPrice",
    searchLabel: "productOfferingPrice",
  },
  {
    label: "productReferences",
    value: "productReferences",
    searchLabel: "productReferences",
  },
  {
    label: "productSpecDescription",
    value: "productSpecDescription",
    searchLabel: "productSpecDescription",
  },
  {
    label: "productSpecification",
    value: "productSpecification",
    searchLabel: "productSpecification",
  },
  {
    label: "purchasable",
    value: "purchasable",
    searchLabel: "purchasable",
  },
  {
    label: "reviews",
    value: "reviews",
    searchLabel: "reviews",
  },
  {
    label: "soldIndividually",
    value: "soldIndividually",
    searchLabel: "soldIndividually",
  },
  {
    label: "stock",
    value: "stock",
    searchLabel: "stock",
  },
  {
    label: "storageSize",
    value: "storageSize",
    searchLabel: "storageSize",
  },
  {
    label: "parents",
    value: "parents",
    searchLabel: "parents",
  },
  {
    label: "summary",
    value: "summary",
    searchLabel: "summary",
  },
  {
    label: "tags",
    value: "tags",
    searchLabel: "tags",
  },
  {
    label: "url",
    value: "url",
    searchLabel: "url",
  },
  {
    label: "validFor",
    value: "validFor",
    searchLabel: "validFor",
  },
  {
    label: "variantMatrix",
    value: "variantMatrix",
    searchLabel: "variantMatrix",
  },
  {
    label: "variantOptions",
    value: "variantOptions",
    searchLabel: "variantOptions",
  },
  {
    label: "variantType",
    value: "variantType",
    searchLabel: "variantType",
  },
  {
    label: "volumePrices",
    value: "volumePrices",
    searchLabel: "volumePrices",
  },
  {
    label: "volumePricesFlag",
    value: "volumePricesFlag",
    searchLabel: "volumePricesFlag",
  },
];

const mandatoryKeys: KeyOption[] = [
  { label: "code", value: "code", searchLabel: "code" },
  { label: "name", value: "name", searchLabel: "name" },
];

// this function maps the corresponding keys to your product object that gets saved in custom field
const returnFormattedProduct = (product: any, config: any): TypeProduct => ({
  id: product?.code || "",
  name: product?.name || "",
  description: product?.description || "-",
  image: product?.images?.[0]?.url
    ? `https://${config?.configField2}${product?.images?.[0]?.url}`
    : "",
  price: product?.price?.formattedValue || "-",
  sku: product?.sku || "",
  isProductDeleted: product?.cs_metadata?.isConfigDeleted ?? false,
});

// this function maps the corresponding keys to your category object that gets saved in custom field
const returnFormattedCategory = (category: any): TypeCategory => ({
  id: category?.id || "",
  name: category?.name || "-",
  customUrl: "",
  description: category?.description || "Not Available",
  isCategoryDeleted: category?.cs_metadata?.isConfigDeleted ?? false,
});

/* this function returns the titles and data that are to be displayed in the sidebar
    by default, name, image, price and description are being displayed.
    you can add additional values in this function that you want to display
*/
const getSidebarData = (product: any): SidebarDataObj[] => [
  {
    title: "Manufacturer",
    value: product?.manufacturer,
  },
  {
    title: "Available For Pickup",
    value: product?.availableForPickup ? "Yes" : "No",
  },
  {
    title: "Configurable",
    value: product?.configurable ? "Yes" : "No",
  },
  {
    title: "Url",
    value: product?.url,
  },
];

// this defines what and how will the columns will be displayed in your product selector page
const getProductSelectorColumns = (config: any): ColumnsProp[] => [
  {
    Header: "ID", // the title of the column
    id: "code",
    accessor: "code", // specifies how you want to display data in the column. can be either string or a function
    default: true,
    disableSortBy: true, // disable sorting of the table with this column
    addToColumnSelector: true, // specifies whether you want to add this column to column selector in the table
    columnWidthMultiplier: 0.8, // multiplies this number with one unit of column with.
    // 0.x means smaller than one specified unit by 0.x times
    // x means bigger that one specified unit by x times
  },
  {
    Header: "Image",
    accessor: (obj: any) =>
      obj?.images?.[0]?.url
        ? getImage(`https://${config?.configField2}${obj?.images?.[0]?.url}`)
        : getImage(obj?.images?.[0]?.url),
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 0.7,
  },
  {
    Header: "Product Name",
    id: "name",
    accessor: (obj: any) => wrapWithDiv(obj?.name),
    default: true,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 3,
  },
  {
    Header: "Price",
    id: "price",
    accessor: (obj: any) => obj?.price?.formattedValue,
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 1,
  },
  {
    Header: "Description",
    id: "description",
    accessor: (obj: any) => wrapWithDiv(obj?.description),
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 2.7,
  },
];

// this defines what and how will the columns will be displayed in your category selector page
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const categorySelectorColumns = (config?: any): ColumnsProp[] => [
  {
    Header: "Category ID",
    id: "code",
    accessor: "id",
    default: true,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 1.5,
  },
  {
    Header: "Category Name",
    id: "name",
    accessor: (obj: any) => obj?.name || "-",
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 1.5,
  },
  {
    Header: "Catalog Version",
    id: "catalogVersionId",
    accessor: "catalogVersionId",
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
  },
];

const getFormattedResponse = (response: any): FormattedRespose => ({
  items: response?.data?.products || response?.data?.catalogs, // assign this to the key that contains your data
  meta: {
    total: response?.data?.pagination?.totalResults, // assign this to the key that specifies the total count of the data fetched
    // eslint-disable-next-line @typescript-eslint/naming-convention
    current_page: response?.data?.pagination?.currentPage, // assign this to the key that corresponds to the current page
  },
});

// this function returns the link to open the product or category in the third party app
// you can use the id, config and type to generate links
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getOpenerLink = (id: any, config: any, type: any): string =>
  config?.configField4;

// keep this function if you have to remove product/category from custom field as per your own requirement
const removeItemsFromCustomField = (
  removeId: any,
  selectedIds: any,
  type: any,
  uniqueKey: any
) => {
  if (type === "category")
    return selectedIds?.filter((data: any) => data?.[uniqueKey] !== removeId);

  return selectedIds?.filter((data: any) => Number(data) !== Number(removeId));
};

// this function is used for app signing, i.e. for verifying app tokens in ui
interface TokenPayload extends JWTPayload {
  app_uid: string;
  installation_uid: string;
  organization_uid: string;
  user_uid: string;
  stack_api_key: string;
}
/**
 * The function `verifyAppSigning` verifies the authenticity of an app token using a public key
 * retrieved from a specified URL.
 * @param {string} app_token - The `app_token` parameter is a string that represents the token of an
 * application. This function `verifyAppSigning` is designed to verify the authenticity of the
 * `app_token` by fetching a public key from a specific URL, importing the key, and then verifying the
 * token using the imported key.
 * @returns The `verifyAppSigning` function returns a Promise that resolves to a boolean value. If the
 * app token is valid and the verification process is successful, the function returns `true`. If the
 * app token is missing or invalid, or if there is an error during the verification process, the
 * function returns `false`.
 */
const verifyAppSigning = async (app_token: string): Promise<boolean> => {
  if (app_token) {
    try {
      const { data }: { data: any } = await axios.get(
        "https://app.contentstack.com/.well-known/public-keys.json"
      );
      const publicKeyJWK = data["signing-key"];
      // Import the public key from the JWK format
      const publicKey = await importJWK(publicKeyJWK, "RS256");
      // Verify the token
      const { payload } = (await jwtVerify(app_token, publicKey)) as {
        payload: TokenPayload;
      };
      const {
        app_uid,
        installation_uid,
        organization_uid,
        user_uid,
        stack_api_key,
      } = payload;
      console.info(
        "app token is valid!",
        app_uid,
        installation_uid,
        organization_uid,
        user_uid,
        stack_api_key
      );
    } catch (e) {
      console.error(
        "app token is invalid or request is not initiated from Contentstack!",
        e
      );
      return false;
    }
    return true;
  }
  console.error("app token is missing!");
  return false;
};

/**
 * Groups and formats product IDs by multi-config settings.
 *
 * When multi-config is enabled, this function returns a result object where keys are multi-config names
 * and values are objects containing arrays of product IDs. The structure of the returned result is as follows:
 * {
 *   [multiConfigName]: {
 *     multiConfiguniqueKey: [] // Array of strings or objects representing product IDs
 *   }
 * }
 *
 * @param {any} productData - The array of product data objects to be formatted.
 * @returns {Result} - The formatted result object containing grouped product IDs.
 */
const mapProductIdsByMultiConfig = (productData: any): Result => {
  let result: Result = {};
  if (productData?.length) {
    const uniqueKey = "multiConfiguniqueKey";
    result = productData?.reduce((acc: any, item: any) => {
      const multiConfigName = item?.cs_metadata?.multiConfigName;
      if (!acc[multiConfigName]) {
        acc[multiConfigName] = { [uniqueKey]: [] };
      }
      acc?.[multiConfigName]?.[uniqueKey]?.push(item?.[uniqueKey]);
      return acc;
    }, {});
  }
  return result;
};

/**
 * Groups category IDs by multi-config names when multi-config is enabled.
 *
 * This function processes an array of category data and returns an object where:
 * - Each key is a multi-config name derived from `cs_metadata.multiConfigName`.
 * - Each value is an object containing an array of category IDs associated with that multi-config name.
 *
 * The structure of the result is as follows:
 * {
 *   [multiConfigName]: {
 *     multiConfiguniqueKey: []  // Array of category IDs, which can be either strings or objects.
 *   }
 * }
 *
 * @param {any} categoryData - Array of category data objects, each expected to include `cs_metadata` and `uniqueKey`.
 * @returns {Result} - An object grouping category IDs by multi-config names.
 */
const mapCategoryIdsByMultiConfig = (categoryData: any): Result => {
  let result: Result = {};
  const uniqueKey = "multiConfiguniqueKey";

  // Check if category data is present and has length
  if (categoryData?.length) {
    // If customCategoryStructure is true, return empty result
    if (categoryConfig.customCategoryStructure === true) {
      return result;
    }

    // Reduce categoryData to an object grouped by multi-config names
    result = categoryData?.reduce((acc: any, item: any) => {
      const multiConfigName = item?.cs_metadata?.multiConfigName;
      if (!acc[multiConfigName]) {
        acc[multiConfigName] = { [uniqueKey]: [] };
      }
      acc?.[multiConfigName]?.[uniqueKey]?.push(item?.[uniqueKey]);
      return acc;
    }, {});
  }

  return result;
};

/**
 * Checks the validity of configuration data and performs optional API validation.
 *
 * @param {Object} configurationData - The configuration data saved in `state?.installationData?.configuration`.
 * @param {Object} serverConfiguration - The server configuration data saved in `state?.installationData?.serverConfiguration`.
 * @param {boolean} validateMultiConfigKeysByApi - Set to `true` to enable API validation for multi-config keys, otherwise `false`.
 * @param {boolean} validateOtherKeysByApi - Set to `true` to enable API validation for non-multi-config keys, otherwise `false`.
 * @returns {Promise<{ isValid: boolean, invalidKeys: { source: string, keys: any[] }[] }>} - Returns an object with `isValid` indicating if all keys are valid and `invalidKeys` listing the invalid keys.
 */
const checkValidity = async (
  configurationData: { [x: string]: any; multi_config_keys?: any },
  serverConfiguration: { [x: string]: any; multi_config_keys?: any },
  validateMultiConfigKeysByApi: boolean,
  validateOtherKeysByApi: boolean
) => {
  const checkMultiConfigKeys = (multiConfigKeys: any) => {
    const invalidKeys: any = {};

    Object.entries(multiConfigKeys || {})?.forEach(([configKey, config]) => {
      Object.entries(config || {})?.forEach(([key, value]) => {
        if (typeof value === "string" && value?.trim() === "") {
          if (!invalidKeys?.[configKey]) {
            invalidKeys[configKey] = [];
          }
          invalidKeys?.[configKey]?.push(key);
        }
      });
    });

    return invalidKeys;
  };

  const checkOtherKeys = (keys: any) => {
    const invalidKeys: string[] = [];

    Object.entries(keys || {})?.forEach(([key, value]) => {
      if (typeof value === "string" && value?.trim() === "") {
        invalidKeys?.push(key);
      }
    });

    return invalidKeys;
  };

  let normalInvalidKeys = {};
  let serverNormalInvalidKeys = {};

  if (!validateMultiConfigKeysByApi) {
    normalInvalidKeys = checkMultiConfigKeys(
      configurationData?.multi_config_keys
    );
    serverNormalInvalidKeys = checkMultiConfigKeys(
      serverConfiguration?.multi_config_keys
    );
  }

  const normalInvalidKeysList = [
    ...Object.entries(normalInvalidKeys)
      .filter(([keys]) => keys?.length)
      .map(([source, keys]) => ({ source, keys })),
    ...Object.entries(serverNormalInvalidKeys)
      .filter(([keys]) => keys?.length)
      .map(([source, keys]) => ({ source, keys })),
  ];

  let otherInvalidKeysList: { source: string; keys: any[] }[] = [];
  if (!validateOtherKeysByApi) {
    const otherInvalidKeys = checkOtherKeys(configurationData);
    const serverOtherInvalidKeys = checkOtherKeys(serverConfiguration);

    otherInvalidKeysList = [
      ...otherInvalidKeys.map((key) => ({
        source: "configurationData",
        keys: [key],
      })),
      ...serverOtherInvalidKeys.map((key) => ({
        source: "serverConfiguration",
        keys: [key],
      })),
    ];
  }

  if (validateMultiConfigKeysByApi || validateOtherKeysByApi) {
    /**
     * Returns the validation result with invalid keys.
     *
     * The result should be returned in the following format:
     * {
     *   invalidKeys: [
     *     { source: "string", keys: ["string"] },
     *     ...
     *   ]
     * }
     */
    const validateConfigFilesByApi = async (): Promise<ValidationResult> => ({
      invalidKeys: [{ source: "demos-95", keys: ["configField8"] }],
    });

    const apiValidationResults = await validateConfigFilesByApi();

    const apiInvalidKeysList = apiValidationResults.invalidKeys;

    const allInvalidKeys = [
      ...normalInvalidKeysList,
      ...otherInvalidKeysList,
      ...apiInvalidKeysList,
    ];

    const isValid = allInvalidKeys?.length === 0;

    return { isValid, invalidKeys: allInvalidKeys };
  }
  // eslint-disable-next-line
  else {
    const allInvalidKeys = [...normalInvalidKeysList, ...otherInvalidKeysList];
    const isValid = allInvalidKeys?.length === 0;

    return { isValid, invalidKeys: allInvalidKeys };
  }
};

/**
 * Renders a custom multi-config component for handling multi-config fields that are not text input fields.
 *
 * @param multiConfigId - The name of the multi-config field, e.g., "legacy_config".
 * @param configurationData - The data saved in the configuration.
 * @param serverConfiguration - The data saved in the server configuration.
 * @param onChangeCallback - The function to call when a change occurs in the custom component.
 *
 *   - Handles changes for the custom component.
 *   - @param {Object} event - The event object containing the `name` and `value`.
 *     - `name`: The name of the changed field.
 *     - `value`: The new value of the changed field.
 *   - @param {any} multiConfigID - The ID of the multi-configuration, should be present if multi-config is true.
 *   - @param {boolean} isMultiConfig - Indicates whether multi-config is enabled or not.
 *
 * @returns A JSX element rendering the MultiConfigCustomComponent.
 */
const customMultiConfigComponent = (
  multiConfigId: string,
  configurationData: any,
  serverConfiguration: any,
  onChangeCallback: (
    event: { name: string; value: any },
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void
) => (
  <MultiConfigCustomComponent
    multiConfigurationData={multiConfigId}
    configurationObject={configurationData}
    serverConfigurationObject={serverConfiguration}
    customComponentOnChange={onChangeCallback}
  />
);

/**
 * Renders a custom Non multi-config component for handling Non multi-config fields that are not text input fields.
 *
 * @param configurationData - The data saved in the configuration.
 * @param serverConfiguration - The data saved in the server configuration.
 * @param onChangeCallback - The function to call when a change occurs in the custom component.
 *
 *   - Handles changes for the custom component.
 *   - @param {Object} event - The event object containing the `name` and `value`.
 *     - `name`: The name of the changed field.
 *     - `value`: The new value of the changed field.
 *   - @param {any} multiConfigID - The ID of the multi-configuration, should be present if multi-config is true.
 *   - @param {boolean} isMultiConfig - Indicates whether multi-config is enabled or not.
 *
 * @returns A JSX element rendering the MultiConfigCustomComponent.
 */
const customNonMultiConfigComponet = (
  configurationData: any,
  serverConfiguration: any,
  onChangeCallback: (
    event: { name: string; value: any },
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void
) => (
  <NonMultiConfigCustomComponent
    configurationObject={configurationData}
    serverConfigurationObject={serverConfiguration}
    customComponentOnChange={onChangeCallback}
  />
);

const rootConfig = {
  verifyAppSigning,
  ecommerceEnv,
  configureConfigScreen,
  mandatoryKeys,
  getFormattedResponse,
  returnFormattedProduct,
  returnFormattedCategory,
  getOpenerLink,
  getProductSelectorColumns,
  categorySelectorColumns,
  getCustomKeys,
  getSidebarData,
  removeItemsFromCustomField,
  mapProductIdsByMultiConfig,
  mapCategoryIdsByMultiConfig,
  checkValidity,
  customMultiConfigComponent,
  customNonMultiConfigComponet,
};

export default rootConfig;
