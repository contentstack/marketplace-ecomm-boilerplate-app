/* eslint-disable */
/* @typescript-eslint/naming-convention */
import axios from "axios";
// import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtVerify, importJWK, JWTPayload } from "jose";
import { ColumnsProp } from "../common/types";
// eslint-disable-next-line import/no-cycle
import { wrapWithDiv, getImage } from "../common/utils";
import { TypeCategory, KeyOption, TypeProduct, SidebarDataObj } from "../types";
import Logo from "../assets/Logo.svg";

/* all values in this file are an example.
    You can modify its values and implementation,
    but please do not change any keys or function names.
*/
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

      // console.info(
      //   "app token is valid!",
      //   app_uid,
      //   installation_uid,
      //   organization_uid,
      //   user_uid,
      //   stack_api_key
      // );
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
const ecommerceEnv: any = {
  REACT_APP_NAME: "sapcommercecloud",
  SELECTOR_PAGE_LOGO: Logo,
  APP_ENG_NAME: "SAP Commerce Cloud",
  UNIQUE_KEY: "id",
  FETCH_PER_PAGE: 20,
};

// example config fields. you will need to use these values in the config screen accordingly.
const configureConfigScreen: any = () => ({
  configField1: {
    type: "textInputFields",
    labelText: "IsMultiConfig(config)",
    helpText: "Is MultiConfig True and Save In Config Is True",
    placeholderText: "Is MultiConfig True and Save In Config Is True",
    instructionText: "Is MultiConfig True and Save In Config Is True",
    saveInConfig: true,
    saveInServerConfig: false,
    isSensitive: false,
    isMultiConfig: true,
  },
  configField2: {
    type: "textInputFields",
    labelText: "IsMultiConfig(config)",
    helpText: "Is MultiConfig True and Save In Config Is True",
    placeholderText: "Is MultiConfig True and Save In Config Is True",
    instructionText: "Is MultiConfig True and Save In Config Is True",
    saveInConfig: true,
    saveInServerConfig: false,
    isSensitive: false,
    isMultiConfig: true,
  },
  configField3: {
    type: "textInputFields",
    labelText: "IsMultiConfig(serverConfig)",
    helpText: "Is MultiConfig True and Save In ServerConfig Is True",
    placeholderText: "Is MultiConfig True and Save In ServerConfig Is True",
    instructionText: "Is MultiConfig True and Save In ServerConfig Is True",
    saveInConfig: false,
    saveInServerConfig: true,
    isSensitive: false,
    isMultiConfig: true,
  },
  configField4: {
    type: "textInputFields",
    labelText: "IsMultiConfig(serverConfig)",
    helpText: "Is MultiConfig True and Save In ServerConfig Is True",
    placeholderText: "Is MultiConfig True and Save In ServerConfig Is True",
    instructionText: "Is MultiConfig True and Save In ServerConfig Is True",
    saveInConfig: false,
    saveInServerConfig: true,
    isSensitive: false,
    isMultiConfig: true,
  },
  configField5: {
    type: "textInputFields",
    labelText: "IsMultiConfigFalse(serverConfig)",
    helpText: "Is MultiConfig False and Save In ServerConfig Is True",
    placeholderText: "Is MultiConfig False and Save In ServerConfig Is True",
    instructionText: "Is MultiConfig False and Save In ServerConfig Is True",
    saveInConfig: false,
    saveInServerConfig: true,
    isSensitive: false,
    isMultiConfig: false,
  },
  configField6: {
    type: "textInputFields",
    labelText: "IsMultiConfigFalse(conffig)",
    helpText: "Is MultiConfig False and Save In Config True",
    placeholderText: "Is MultiConfig False and Save In Config True",
    instructionText: "Is MultiConfig False and Save In Config True",
    saveInConfig: true,
    saveInServerConfig: false,
    isSensitive: false,
    isMultiConfig: false,
  },
});

const customKeys: any = [
  { label: "code", value: "code" },
  { label: "name", value: "name" },
];

const openSelectorPage = (config: any) => !!config.configField1;

const returnUrl = (response: any) => ({
  items: response?.data?.products || response?.data?.catalogs, // assign this to the key that contains your data
  meta: {
    total: response?.data?.pagination?.totalResults, // assign this to the key that specifies the total count of the data fetched
    // eslint-disable-next-line @typescript-eslint/naming-convention
    current_page: response?.data?.pagination?.currentPage, // assign this to the key that corresponds to the current page
  },
});

const getCustomKeys = () =>
  <KeyOption[]>[
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

const getSelectedCategoriesUrl = (config: any, type: any, selectedIDs: any) => {
  const apiUrl = `${process.env.REACT_APP_API_URL}?query=${type}&id:in=categories`;
  const requestData = {
    config,
    selectedIDs,
  };
  return { apiUrl, requestData };
};
const ecomCustomFieldCategoryData: any = true;

const generateSearchApiUrlAndData = (
  config: any,
  keyword: any,
  page: any,
  limit: any,
  categories?: any
) => {
  const catQuery = categories?.length
    ? `&searchCategories=${categories?.map((str: any) => str.value).join(",")}`
    : "";

  const queryType = config.type === "category" ? "category" : "product";

  const apiUrl = `${process.env.REACT_APP_API_URL}?query=${queryType}&searchParam=keyword=${keyword}&page=${page}&limit=${limit}${catQuery}`;

  return { apiUrl, requestData: config };
};

// this function maps the corresponding keys to your product object that gets saved in custom field
const returnFormattedProduct = (product: any, config: any) => {
  return <TypeProduct>{
    id: product?.id || "",
    name:
      product?.masterData?.name?.["en"] ??
      product?.masterData?.name?.["en-US"] ??
      product?.name,
    description: product?.cs_metadata?.multi_config_name,
    image: product?.images?.[0]?.src,
    price: product?.price?.formattedValue || "-",
    sku: product?.sku || "",
  };
};

// this function maps the corresponding keys to your category object that gets saved in custom field
const returnFormattedCategory = (category: any) =>
  <TypeCategory>{
    id: category?.id || "",
    name: category?.name || "-",
    customUrl: "",
    description: category?.description || "Not Available",
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
const categorySelectorColumns = (config?: any) =>
  <ColumnsProp[]>[
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

const arrangeList = (
  sortedIdsArray: any[],
  dataArray: any[],
  uniqueKey: string
) => {
  const data: any[] = [];
  sortedIdsArray?.forEach((mItem: any) => {
    dataArray?.forEach((sItem: any) => {
      if (sItem && sItem[uniqueKey] === mItem) {
        data.push(sItem);
      }
    });
  });
  console.info("data", data);
  return data;
};
const removeItemsFromCustomField = (
  removeId: any,
  selectedIds: any,
  setSelectedIds: any,
  type: any,
  uniqueKey: any
) => {
  if (type === "category")
    setSelectedIds(
      selectedIds?.filter((data: any) => data?.[uniqueKey] !== removeId)
    );
  else
    setSelectedIds(
      selectedIds?.filter((data: any) => Number(data) !== Number(removeId))
    );
};

const rootConfig = {
  verifyAppSigning,
  ecommerceEnv,
  configureConfigScreen,
  customKeys,
  openSelectorPage,
  returnUrl,
  ecomCustomFieldCategoryData,
  getSelectedCategoriesUrl,
  generateSearchApiUrlAndData,
  returnFormattedProduct,
  returnFormattedCategory,
  getOpenerLink,
  getProductSelectorColumns,
  categorySelectorColumns,
  getCustomKeys,
  getSidebarData,
  arrangeList,
  removeItemsFromCustomField,
};

export default rootConfig;
