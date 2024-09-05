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
} from "../common/types/index";
import { ConfigureConfigScreen } from "../types/index";
// eslint-disable-next-line import/no-cycle
import { wrapWithDiv, getImage } from "../common/utils";
import Logo from "../assets/Logo.svg";
import MultiConfigCustomComponent from "./configscreen/MultiConfigCustomComponent";
import NonMultiConfigCustomComponent from "./configscreen/NonMultiConfigCustomComponent";
/* eslint-disable */
import categoryConfig from "./categories";
import { ApiValidationEnabledForConfig } from "../services/index";
/* eslint-enable */

/* all values in this file are an example.
    You can modify its values and implementation,
    but please do not change any keys or function names.
*/

// Please refer to the doc for getting more information on each ecommerceEnv fields/keys.
const ecommerceEnv: EcommerceEnv = {
  REACT_APP_NAME: "ecommerce-app-name",
  SELECTOR_PAGE_LOGO: Logo,
  APP_ENG_NAME: "E-Commerce App Name",
  UNIQUE_KEY: {
    product: "id",
    category: "id",
  },
  ENABLE_MULTI_CONFIG: true,
};

/**
 * The function `configureConfigScreen` provides configuration details for various fields used in the application.
 * Each field in the configuration specifies its type, label, help text, placeholder text, instruction text, and
 * various attributes related to storage and sensitivity.
 *
 * @returns {ConfigureConfigScreen} The function returns an object where each key corresponds to a field in the
 * configuration screen. The configuration includes:
 * - `type`: Specifies the input field type, such as "textInputFields".
 * - `labelText`: A label describing the input field.
 * - `helpText`: Text providing additional help or information for the input field.
 * - `placeholderText`: Placeholder text displayed in the input field when it is empty.
 * - `instructionText`: Instructions or guidance for the input field.
 * - `saveInConfig`: A boolean indicating if the key should be stored in the configuration object.
 * - `saveInServerConfig`: A boolean indicating if the key should be stored in the server configuration object.
 * - `isSensitive`: A boolean indicating if the input field contains sensitive data (e.g., passwords).
 * - `isMultiConfig`: A boolean indicating if the key should be stored in multi-configurations.
 * - `isConfidential`: A boolean indicating if the key needs to be encrypted/decrypted.
 *  - `isApiValidationEnabled`:A boolean indicating if the key needs to be validatedby api or not
 * - `suffix`: A String indicating suffix when isSensitive is set to true 
    allowDuplicateKeyValue: A boolean to indicate whether to allow duplicate values for these key for multiconfig
 */
const configureConfigScreen: () => ConfigureConfigScreen = () => ({});

// Function to generate key options from key names
const generateKeyOptionsFromNames = (
  keyNames: string[],
  mandatoryKeyNames: string[]
): KeyOption[] =>
  keyNames.map((keyName) => ({
    label: keyName,
    value: keyName,
    searchLabel: keyName,
    isDisabled: mandatoryKeyNames.includes(keyName),
  }));

const getCustomKeys = (): {
  mandatoryKeys: KeyOption[];
  nonMandatoryKeys: KeyOption[];
} => {
  const keyNames = ["id", "name", "price", "description"];
  const mandatoryKeyNames = ["id", "name"];

  const keyOptions = generateKeyOptionsFromNames(keyNames, mandatoryKeyNames);

  const mandatoryKeys = keyOptions.filter((key) => key.isDisabled);
  const nonMandatoryKeys = keyOptions;

  return { mandatoryKeys, nonMandatoryKeys };
};

// this function maps the corresponding keys to your product object that gets saved in custom field
/* eslint-disable */
const returnFormattedProduct = (product: any, config: any): TypeProduct => ({
  id: product?.id || "",
  name: product?.key || "",
  description: product?.description?.en || "-",
  image: product?.images?.[0]?.url
    ? `https://${config?.configField2}${product?.images?.[0]?.url}`
    : "",
  price: product?.price?.formattedValue || "-",
  sku: product?.sku || "",
  isProductDeleted: product?.cs_metadata?.isConfigDeleted ?? false,
  cs_metadata: product?.cs_metadata?.multiConfigName,
});

// this function maps the corresponding keys to your category object that gets saved in custom field
const returnFormattedCategory = (category: any): TypeCategory => {
  return {
    id: category?.id || "",
    name: category?.key || "",
    customUrl: "",
    description: category?.description || "Not Available",
    isCategoryDeleted: category?.cs_metadata?.isConfigDeleted ?? false,
  };
};

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
  {
    title: "MultiConfigName",
    value: product?.cs_metadata?.multiConfigName
      ? product?.cs_metadata?.multiConfigName
      : "",
  },
];

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

/**
 * Removes an item from the selected IDs based on the specified criteria.
 * @param {any} removeId - The ID of the item to be removed.
 * @param {any} selectedIds - The array of selected IDs from the e-commerce app, which can include products or categories.
 * @param {any} type - Specifies the type of item being removed, either "product" or "category".
 * @param {any} uniqueKey - The key used to identify items in the selected IDs. This is relevant when the `type` is "category".
 * @param {boolean} isOldUser - Indicates whether the user had previous data before enabling multi-configuration. This affects how data is processed.
 * @param {any} multiConfigName - Used to handle different ID formats when removing items. Required for scenarios involving multi-configuration.
 * @returns {any[]} - The filtered array of selected IDs with the specified item removed.
 */
const removeItemsFromCustomField = (
  removeId: any,
  selectedIds: any,
  type: any,
  uniqueKey: any,
  isOldUser: Boolean,
  multiConfigName: any
) => {
  if (type === "category") {
    // Remove item based on a unique key if the type is 'category'
    return selectedIds?.filter((data: any) => data?.[uniqueKey] !== removeId);
  }

  // Remove item based on a direct ID match for other types
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
    } catch (e) {
      console.error(
        "Token is invalid or request is not initiated from Contentstack!",
        e
      );
      return false;
    }
    return true;
  }
  console.error("Token is missing!");
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
const mapProductIdsByMultiConfig = (productData: any, type: any): Result => {
  const uniqueKey: any = ecommerceEnv.UNIQUE_KEY?.[type];
  let result: Result = {};
  if (productData?.length) {
    const multiConfigUniqueKey = "multiConfiguniqueKey";
    result = productData?.reduce((acc: any, item: any) => {
      const multiConfigName = item?.cs_metadata?.multiConfigName;
      if (!acc[multiConfigName]) {
        acc[multiConfigName] = { [multiConfigUniqueKey]: [] };
      }
      acc?.[multiConfigName]?.[multiConfigUniqueKey]?.push(item?.[uniqueKey]);
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
const mapCategoryIdsByMultiConfig = (categoryData: any, type: any): Result => {
  const uniqueKey: any = ecommerceEnv.UNIQUE_KEY?.[type];
  let result: Result = {};
  const multiConfigUniqueKey = "multiConfiguniqueKey";

  // Check if category data is present and has length
  if (categoryData?.length) {
    /**
     * If `customCategoryStructure` is true, return the data in the specified format.
     * The returned format will be an object with the following structure:
     *
     * {
     *   [multiConfigName]: {
     *     multiConfiguniqueKey: []  // Array of category IDs, which can be either strings or objects.
     *   }
     * }
     *
     * - `customCategoryStructure`: A boolean indicating whether to use a custom category structure.
     * - `multiConfigName`: A dynamic key for the outer object, which is used to identify different multi-configuration setups.
     * - `multiConfiguniqueKey`: A key within the `multiConfigName` object that holds an array of category IDs.
     * - The array associated with `multiConfiguniqueKey` can contain category IDs as strings or objects, depending on the implementation.
     */

    if (categoryConfig.customCategoryStructure === true) {
      return result;
    }

    // Reduce categoryData to an object grouped by multi-config names
    result = categoryData?.reduce((acc: any, item: any) => {
      const multiConfigName = item?.cs_metadata?.multiConfigName;
      if (!acc[multiConfigName]) {
        acc[multiConfigName] = { [multiConfigUniqueKey]: [] };
      }
      acc?.[multiConfigName]?.[multiConfigUniqueKey]?.push(item?.[uniqueKey]);
      return acc;
    }, {});
  }

  return result;
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
    event: { target: { name: string; value: any } },
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void,
  componentConfigOptions: any
) => (
  <MultiConfigCustomComponent
    multiConfigurationDataID={multiConfigId}
    configurationObject={configurationData}
    serverConfigurationObject={serverConfiguration}
    customComponentOnChange={onChangeCallback}
    componentConfigOptions={componentConfigOptions}
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
const customNonMultiConfigComponent = (
  configurationData: any,
  serverConfiguration: any,
  onChangeCallback: (
    event: { target: { name: string; value: any } },
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void,
  componentConfigOptions: any
) => (
  <NonMultiConfigCustomComponent
    configurationObject={configurationData}
    serverConfigurationObject={serverConfiguration}
    customComponentOnChange={onChangeCallback}
    componentConfigOptions={componentConfigOptions}
  />
);

/**
 * Custom API validation function for configuration files.
 *
 * @param configurationObject - Data stored in the configuration of the application (appsdk). This includes configuration settings that need to be validated.
 * @param serverConfiguration - Data stored in the server configuration of the application (appsdk). This includes server-side settings that need to be validated.
 * @param multiConfigTrueAndApiValidationEnabled - Array of keys where API validation is enabled and `isMultiConfig` is `true`. These are the configuration fields that should be validated using the API.
 * @param multiConfigFalseAndApiValidationEnabled - Array of keys where API validation is enabled and `isMultiConfig` is `false`. These are the configuration fields that should be validated using the API.
 * @returns A promise that resolves to a `ValidationResult` object containing the validation results.
 *
 * The function should return an object with `invalidKeys`, which is an array of objects where each object represents a configuration issue:
 * - If `multiConfigTrueAndApiValidationEnabled` contains the invalid configuration, the `source` should be the multi-config name (e.g., "demos-95") and `keys` should include the field names that are invalid.
 * - If the configuration is not multi-config, the `source` should be "configuration" or "serverConfiguration", and `keys` should include the names of the invalid fields.
 */
const validateConfigKeyByApi = async (
  configurationObject: any, // Data stored in the configuration of the app (appsdk)
  serverConfiguration: any, // Data stored in the server configuration of the app (appsdk)
  multiConfigTrueAndApiValidationEnabled: any, // Keys with API validation enabled and isMultiConfig true
  multiConfigFalseAndApiValidationEnabled: any // Keys with API validation enabled and isMultiConfig false
): Promise<ValidationResult> => {
  const apiValidationEnabledForConfigResponse =
    await ApiValidationEnabledForConfig(
      configurationObject,
      serverConfiguration,
      multiConfigTrueAndApiValidationEnabled,
      multiConfigFalseAndApiValidationEnabled
    );
  return {
    invalidKeys: [
      {
        source: "demos-95", // Example of multi-config name
        keys: ["configField8"], // Example of invalid field name
      },
    ],
  };
};

const rootConfig = {
  verifyAppSigning,
  ecommerceEnv,
  configureConfigScreen,
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
  customMultiConfigComponent,
  customNonMultiConfigComponent,
  validateConfigKeyByApi,
};

export default rootConfig;
