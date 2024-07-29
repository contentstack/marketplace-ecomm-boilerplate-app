/* @typescript-eslint/naming-convention */
import axios from "axios";
import { jwtVerify, importJWK, JWTPayload } from "jose";
import { ColumnsProp, Result } from "../common/types";
// eslint-disable-next-line import/no-cycle
import { wrapWithDiv, getImage } from "../common/utils";
import {
  TypeCategory,
  KeyOption,
  TypeProduct,
  SidebarDataObj,
  EcommerceEnv,
} from "../types";
import Logo from "../assets/Logo.svg";

/* all values in this file are an example.
    You can modify its values and implementation,
    but please do not change any keys or function names.
*/
// this function is used for app signing, i.e. for verifying app tokens in ui
interface TokenPayload extends JWTPayload {
  app_uid: string;
  installation_uid: string;
  organization_uid: string;
  user_uid: string;
  stack_api_key: string;
}
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
// Please refer to the doc for getting more information on each ecommerceEnv fields/keys.
const ecommerceEnv: EcommerceEnv = {
  REACT_APP_NAME: "CommerceTools",
  SELECTOR_PAGE_LOGO: Logo,
  APP_ENG_NAME: "CommerceTools",
  UNIQUE_KEY: {
    product: "id",
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

const customKeys: any = [
  { label: "id", value: "id" },
  { label: "key", value: "key" },
];

// const openSelectorPage = (config: any) => !!config.configField1;

// change name for this function
const returnUrl = (response: any) => {
  console.info("response returnUrl", response);
  return {
    items:
      response?.data?.results
      || response?.data?.products
      || response?.data?.catalogs,
    // assign this to the key that contains your data
    meta: {
      total: response?.data?.total, // assign this to the key that specifies the total count of the data fetched
      // eslint-disable-next-line @typescript-eslint/naming-convention
      current_page: response?.data?.pagination?.currentPage, // assign this to the key that corresponds to the current page
    },
  };
};

const getCustomKeys = () =>
  <KeyOption[]>[
    {
      label: "id",
      value: "id",
      searchLabel: "id",
    },
    {
      label: "version",
      value: "version",
      searchLabel: "version",
    },
    {
      label: "versionModifiedAt",
      value: "versionModifiedAt",
      searchLabel: "versionModifiedAt",
    },
    {
      label: "lastMessageSequenceNumber",
      value: "lastMessageSequenceNumber",
      searchLabel: "lastMessageSequenceNumber",
    },
    {
      label: "createdAt",
      value: "createdAt",
      searchLabel: "createdAt",
    },
    {
      label: "lastModifiedAt",
      value: "lastModifiedAt",
      searchLabel: "lastModifiedAt",
    },
    {
      label: "lastModifiedBy",
      value: "lastModifiedBy",
      searchLabel: "lastModifiedBy",
    },
    {
      label: "createdBy",
      value: "createdBy",
      searchLabel: "createdBy",
    },
    {
      label: "productType",
      value: "productType",
      searchLabel: "productType",
    },
    {
      label: "masterData",
      value: "masterData",
      searchLabel: "masterData",
    },
    {
      label: "key",
      value: "key",
      searchLabel: "key",
    },
    {
      label: "taxCategory",
      value: "taxCategory",
      searchLabel: "taxCategory",
    },
    {
      label: "lastVariantId",
      value: "lastVariantId",
      searchLabel: "lastVariantId",
    },
    {
      label: "cs_metadata",
      value: "cs_metadata",
      searchLabel: "cs_metadata",
    },
  ];

const getSelectedCategoriesUrl = (config: any, type: any, selectedIDs: any) => {
  const apiUrl = `${process.env.REACT_APP_API_URL}?query=${type}&id:in=categories`;
  const requestData = {
    config,
    selectedIDs,
  };
  return { apiUrl, requestData };
};

// change the name of this function
const generateSearchApiUrlAndData = (
  config: any,
  keyword: any,
  skip: any,
  limit: any,
  categories?: any
) => {
  const catQuery = categories?.length
    ? `&searchCategories=${categories?.map((str: any) => str.value).join(",")}`
    : "";

  const queryType = config.type === "category" ? "category" : "product";

  const apiUrl = `${process.env.REACT_APP_API_URL}?query=${queryType}&searchParam=keyword=${keyword}&skip=${skip}&limit=${limit}${catQuery}`;

  return { apiUrl, requestData: config };
};

// this function maps the corresponding keys to your product object that gets saved in custom field
// eslint-disable-next-line
const returnFormattedProduct = (product: any, config: any) =>
  <TypeProduct>{
    id: product?.id || "",
    name: product?.key || "",
    description: product?.id || "",
    image: product?.images?.[0]?.src || "",
    price: product?.price?.formattedValue || "-",
    sku: product?.sku || "",
    isProductDeleted: product?.cs_metadata?.isconfigdeleted ?? false,
  };

// this function maps the corresponding keys to your category object that gets saved in custom field
const returnFormattedCategory = (category: any) =>
  <TypeCategory>{
    id: category?.id || "",
    name: category?.name?.["en-US"] || "-",
    customUrl: "",
    description: category?.description || "Not Available",
    isCategoryDeleted: category?.cs_metadata?.isconfigdeleted ?? false,
  };

// this function returns the link to open the product or category in the third party app
// you can use the id, config and type to generate links
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getOpenerLink = (id: any, config: any, type: any) => config?.configField4;

/* this function returns the titles and data that are to be displayed in the sidebar
    by default, name, image, price and description are being displayed.
    you can add additional values in this function that you want to display
*/
const getSidebarData = (product: any) =>
  <SidebarDataObj[]>[
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
const getProductSelectorColumns = (config: any) =>
  <ColumnsProp[]>[
    {
      Header: "ID", // the title of the column
      id: "id",
      accessor: "id", // specifies how you want to display data in the column. can be either string or a function
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
      accessor: (productData: any) =>
        productData?.masterData?.current?.name?.["en-US"] ?? productData?.key,
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
const categorySelectorColumns = (config?: any) =>
  <ColumnsProp[]>[
    {
      Header: "Category ID",
      id: "id",
      accessor: "id",
      default: true,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 1.5,
    },
    {
      Header: "Category Name",
      id: "name",
      accessor: (categoryData: any) =>
        categoryData?.name?.["en-US"] || categoryData?.key,
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
/*
const arrangeList = (
  sortedIdsArray: any[],
  dataArray: any[],
  uniqueKey: string,
  isOldUser:Boolean
) => {
  const data: any[] = [];
  if(isOldUser===false){

  }
  else{

  }
  sortedIdsArray?.forEach((mItem: any) => {
    dataArray?.forEach((sItem: any) => {
      if (sItem && sItem[uniqueKey] === mItem) {
        data.push(sItem);
      }
    });
  });
  return data;
};
*/

// keep this function if you have to remove product/category from custom field as per your own requirement
const removeItemsFromCustomField = (
  removeId: any,
  selectedIds: any,
  type: any,
  uniqueKey: any,
  isOldUser: Boolean,
  multiConfigName: any
) => {
  if (isOldUser === true) {
    if (type === "category")
      return selectedIds?.filter((data: any) => data?.[uniqueKey] !== removeId);

    return selectedIds?.filter(
      (data: any) => Number(data) !== Number(removeId)
    );
  }
  let updatedRootConfig = { ...selectedIds };
  const config = selectedIds?.[multiConfigName];
  const updatedIds = config.multiConfiguniqueKey.filter(
    (id: any) => id !== removeId
  );
  const updatedConfig = {
    ...config,
    multiConfiguniqueKey: updatedIds,
  };

  updatedRootConfig = {
    ...updatedRootConfig,
    [multiConfigName]: updatedConfig,
  };
  return updatedRootConfig;
};

const returnFormattedProductIDSForMultiConfig = (productData: any): Result => {
  console.info("productData", productData);
  let result: Result = {};
  if (productData?.length) {
    const uniqueKey = "multiConfiguniqueKey";
    result = productData.reduce((acc: any, item: any) => {
      const multiConfigName = item?.cs_metadata?.multi_config_name;
      // console.info("multiConfigName",multiConfigName)
      if (!acc[multiConfigName]) {
        acc[multiConfigName] = { [uniqueKey]: [] };
      }
      acc[multiConfigName][uniqueKey].push(item.id);
      return acc;
    }, {});
  }
  return result;
};

const returnFormattedCategoryIDSForMultiConfig = (
  categoryData: any
): Result => {
  let result: Result = {};
  if (categoryData?.length) {
    const uniqueKey = "multiConfiguniqueKey";
    result = categoryData.reduce((acc: any, item: any) => {
      const multiConfigName = item?.cs_metadata?.multi_config_name;
      console.info("");
      if (!acc[multiConfigName]) {
        acc[multiConfigName] = { [uniqueKey]: [] };
      }
      acc[multiConfigName][uniqueKey].push(item.id);
      return acc;
    }, {});
  }
  return result;
};

const rootConfig = {
  verifyAppSigning,
  ecommerceEnv,
  configureConfigScreen,
  customKeys,
  // openSelectorPage,
  returnUrl,
  getSelectedCategoriesUrl,
  generateSearchApiUrlAndData,
  returnFormattedProduct,
  returnFormattedCategory,
  getOpenerLink,
  getProductSelectorColumns,
  categorySelectorColumns,
  getCustomKeys,
  getSidebarData,
  // arrangeList,
  removeItemsFromCustomField,
  returnFormattedProductIDSForMultiConfig,
  returnFormattedCategoryIDSForMultiConfig,
};

export default rootConfig;
