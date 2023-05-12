/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnsProp } from "@contentstack/venus-components/build/components/Table/InfiniteScrollTable";
// eslint-disable-next-line import/no-cycle
import { wrapWithDiv, getImage } from "../../../src/common/utils";
import {
  TypeCategory,
  ConfigFields,
  KeyOption,
  TypeProduct,
  SidebarDataObj,
} from "../../../src/types";
import Logo from "../assets/Logo.svg";

/* all values in this file are an example.
    You can modify its values and implementation,
    but please do not change any keys or function names.

*/
const ecommerceEnv: any = {
  REACT_APP_NAME: "sapcommercecloud",
  SELECTOR_PAGE_LOGO: Logo,
  APP_ENG_NAME: "SAP Commerce Cloud",
  UNIQUE_KEY: {
    product: "code",
    category: "id",
  },
  FETCH_PER_PAGE: 20,
};
// example config fields. you will need to use these values in the config screen accordingly.
const ecommerceConfigFields: ConfigFields = {
/* IMPORTANT: 
  1. All sensitive information must be saved in serverConfig
  2. serverConfig is used when webhooks are implemented
  3. save the fields that are to be accessed in other location in config
  4. either saveInConfig or saveInServerConfig should be true for your field data to be saved in contentstack
  5. If values are stored in serverConfig then those values will not be available to other UI locations */
  
  apiRouteField: {
    label: "API Route",
    help: "Your API Base URL is the URL from which your data will be fetched. Ideally starts with 'api'. You can get it from your SAP Commerce Cloud Portal",
    placeholder: "/rest/v2/",
    instruction: "Copy and Paste your API Route",
    },
  field1: {
    label: "API Base URL",
    help: "Your API Base URL is the URL from which your data will be fetched. Ideally starts with 'api'. You can get it from your SAP Commerce Cloud Portal",
    placeholder: "Enter your API Base URL",
    instruction: "Copy and Paste your API Base URL  without https://",
  },
  field2: {
    label: "Base Site ID",
    help: "You can find your Base Site ID in the Base Commerce Section of your SAP Backoffice.",
    placeholder: "Enter your Base Site ID",
    instruction: "Copy and Paste your Base Site ID",
  },
  field3: {
    label: "Backoffice URL",
    help: "You can get your Backoffice URL from the SAP Commerce Cloud Portal.",
    placeholder: "Enter your Backoffice URL",
    instruction: "Copy and Paste your Backoffice URL",
  },
};

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
// this function maps the corresponding keys to your product object
const returnFormattedProduct = (product: any, config: any) =>
  <TypeProduct>{
    id: Number(product?.code) || "",
    name: product?.name || "",
    description: product?.description || "-",
    image: product?.images?.[0]?.url ? `https://${config?.base_url}${product?.images[0]?.url}` : "",
    price: product?.price?.formattedValue || "-",
    sku: product?.sku || "",
  };

// this function maps the corresponding keys to your category object
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
const getOpenerLink = (id: any, config: any, type: any) =>
  config?.backoffice_url;

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
      id: "image",
      accessor: (obj: any) => obj?.images?.[0]?.url ? 
          getImage(`https://${config?.base_url}${obj?.images?.[0]?.url}`)
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
      id: 'description',
      accessor: (obj: any) => wrapWithDiv(obj?.description),
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 2.7,
    },
  ];

// this defines what and how will the columns will be displayed in your category selector page
const categorySelectorColumns: ColumnsProp[] = [
  {
    Header: "ID",
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
    accessor: (obj:any) => obj?.name || '-', 
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 1.5,
  },
  {
    Header: "Catalog Name",
    id: "catalogName",
    accessor: "catalogName",
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
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

const rootConfig = {
  ecommerceEnv,
  ecommerceConfigFields,
  returnFormattedProduct,
  returnFormattedCategory,
  getOpenerLink,
  getProductSelectorColumns,
  categorySelectorColumns,
  getCustomKeys,
  getSidebarData,
};

export default rootConfig;