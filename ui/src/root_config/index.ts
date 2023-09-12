import currency from "currency.js";
import axios from "axios";
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt, { JwtPayload } from "jsonwebtoken";
import { ColumnsProp } from "../common/types";
// eslint-disable-next-line import/no-cycle
import { wrapWithDiv, getImage } from "../common/utils";
import {
  TypeCategory,
  EcommerceEnv,
  KeyOption,
  TypeProduct,
  SidebarDataObj,
} from "../types";
import Logo from "../assets/Logo.svg";
/* eslint-disable */

/* all values in this file are an example.
    You can modify its values and implementation,
    but please do not change any keys or function names.
*/

// this function is used for app signing, i.e. for verifying app tokens in ui
const verifyAppSigning = async (app_token: any): Promise<boolean> => {
  if (app_token) {
    try {
      const { data }: { data: any } = await axios.get(
        "https://app.contentstack.com/.well-known/public-keys.json"
      );
      const publicKey = data["signing-key"];

      const {
        app_uid,
        installation_uid,
        organization_uid,
        user_uid,
        stack_api_key,
      }: any = jwt.verify(app_token, publicKey) as JwtPayload;

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
        "app token is invalid or request is not initiated from Contentstack!"
      );
      return false;
    }
    return true;
  } else {
    console.error("app token is missing!");
    return false;
  }
};

// Please refer to the doc for getting more information on each ecommerceEnv fields/keys.
const ecommerceEnv: EcommerceEnv = {
  REACT_APP_NAME: "yourappnameinlowercasefordisplayingitemsoncustomfield",
  SELECTOR_PAGE_LOGO: Logo,
  APP_ENG_NAME: "YourAppName",
  UNIQUE_KEY: {
    product: "id",
    category: "id",
  },
  FETCH_PER_PAGE: 20,
};
// example config fields. you will need to use these values in the config screen accordingly.

const configureConfigScreen: any = () =>
  /* IMPORTANT: 
  1. All sensitive information must be saved in serverConfig
  2. serverConfig is used when webhooks are implemented
  3. save the fields that are to be accessed in other location in config
  4. either saveInConfig or saveInServerConfig should be true for your field data to be saved in contentstack
  5. If values are stored in serverConfig then those values will not be available to other UI locations
  6. Supported type options are textInputFields, radioInputFields, selectInputFields */

  ({
    configField1: {
      type: "textInputFields",
      labelText: "Sample Ecommerce App Client ID",
      helpText:
        "You can use this field for information such as Store ID, Auth Token, Client ID, Base URL, etc.",
      placeholderText: "Enter the value",
      instructionText: "Enter the Client ID from your ecommerce platform",
      saveInConfig: true,
      isSensitive: false,
    },
    configField2: {
      type: "textInputFields",
      labelText: "Sample Ecommerce App Client Secret",
      helpText:
        "You can use this field for information such as Store ID, Auth Token, Client ID, Base URL, etc.",
      placeholderText: "Enter the value",
      instructionText: "Enter the Client Secret from your ecommerce platform.",
      saveInConfig: true,
      isSensitive: true,
    },
  });

// Keys to fetch the custom json on the custom field
const customKeys: any = [
  { label: "id", value: "id" },
  { label: "name", value: "name" },
];
// Key used in function used in selector page to open your application
const openSelectorPage = (config: any) => {
  return config.configField1 ? true : false;
};

// Function to create your app url in UI for service/index.ts file
const returnUrl = (response: any) => ({
  items: response?.data?.data, //response?.item?.data
  meta: {
    total: response?.data?.meta?.pagination?.total,
    current_page: response?.data?.meta?.pagination?.current_page,
  },
});

// url created to fetch the categories on custom field
const getSelectedCategoriesUrl = (config: any, type: any, selectedIDs: any) => {
  const apiUrl = `${
    process.env.REACT_APP_API_URL
  }?query=${type}&categories:in=${
    selectedIDs?.reduce((str: any, i: any) => `${str}${i},`, "") || ""
  }`;
  const requestData = {
    config,
  };
  return { apiUrl, requestData };
};

// URL to search products and categories
const generateSearchApiUrlAndData = (
  config: any,
  keyword: any,
  page: any,
  limit: any,
  categories: any
) => {
  const catQuery = categories.length
    ? `&searchCategories=${categories.map((str: any) => str.value).join(",")}`
    : "";

  const queryType = config.type === "category" ? "category" : "product";

  const apiUrl = `${process.env.REACT_APP_API_URL}?query=${queryType}&searchParam=keyword=${keyword}&page=${page}&limit=${limit}${catQuery}`;

  return { apiUrl, requestData: config };
};

// Custom field to be added for config screen
const getCustomKeys = () =>
  <KeyOption[]>[
    {
      label: "product_name",
      value: "product_name",
      searchLabel: "product_name",
    },
    {
      label: "product_id",
      value: "product_id",
      searchLabel: "product_id",
    },
    {
      label: "base_variant_id",
      value: "base_variant_id",
      searchLabel: "base_variant_id",
    },
    {
      label: "cost_price",
      value: "cost_price",
      searchLabel: "cost_price",
    },
    {
      label: "date_created",
      value: "date_created",
      searchLabel: "date_created",
    },
    {
      label: "depth",
      value: "depth",
      searchLabel: "depth",
    },
    {
      label: "description",
      value: "description",
      searchLabel: "description",
    },
    {
      label: "gift_wrapping_options_list",
      value: "gift_wrapping_options_list",
      searchLabel: "gift_wrapping_options_list",
    },
    {
      label: "images",
      value: "images",
      searchLabel: "images",
    },
    {
      label: "meta_keywords",
      value: "meta_keywords",
      searchLabel: "meta_keywords",
    },
    {
      label: "price",
      value: "price",
      searchLabel: "price",
    },
    {
      label: "price_hidden_label",
      value: "price_hidden_label",
      searchLabel: "price_hidden_label",
    },
    {
      label: "primary_image",
      value: "primary_image",
      searchLabel: "primary_image",
    },
    {
      label: "product_tax_code",
      value: "product_tax_code",
      searchLabel: "product_tax_code",
    },
    {
      label: "width",
      value: "width",
      searchLabel: "width",
    },
  ];

// this function maps the corresponding keys to your product object that gets saved in custom field
const returnFormattedProduct = (product: any, config?: any) =>
  <TypeProduct>{
    id: product?.id || "",
    name: product?.name || "",
    description: product?.description || {},
    image: product?.primary_image?.url_thumbnail || "",
    price: `$${currency(product?.price) || "Not Available"}`,
    sku: product?.sku || "",
  };

// this function maps the corresponding keys to your category object that gets saved in custom field
const returnFormattedCategory = (category: any) =>
  <TypeCategory>{
    id: category?.id || "",
    name: category?.name || "",
    customUrl: category?.custom_url?.url || "",
    description: category?.description || "Not Available",
  };

/* this function returns the titles and data that are to be displayed in the sidebar
    by default, name, image, price and description are being displayed.
    you can add additional values in this function that you want to display
*/
const getSidebarData = (product: any) =>
  <SidebarDataObj[]>[
    {
      title: "Dimensions",
      value: `${product?.width}in X ${product?.height}in X `,
    },
    {
      title: "Height",
      value: product?.height,
    },
    {
      title: "Width",
      value: product?.width,
    },
  ];

// this function returns the link to open the product or category in the third party app
// you can use the id, config and type to generate links
const getOpenerLink = (data: any, config: any, type: any) =>
  `https://app.mybigcommerce.com/manage/products/${
    type === "category" ? `categories/${data?.id}/edit` : `edit/${data?.id}`
  }`;

// this defines what and how will the columns will be displayed in your product selector page
const getProductSelectorColumns = (config?: any) =>
  <ColumnsProp[]>[
    {
      Header: "ID", // the title of the column
      id: "id",
      accessor: "id", // specifies how you want to display data in the column. can be either string or a function
      default: false,
      disableSortBy: true, // disable sorting of the table with this column
      addToColumnSelector: true, // specifies whether you want to add this column to column selector in the table
      columnWidthMultiplier: 0.8, // multiplies this number with one unit of column with.
      // 0.x means smaller than one specified unit by 0.x times
      // x means bigger that one specified unit by x times
    },
    {
      Header: "Image",
      accessor: (obj: any) => getImage(obj?.primary_image?.url_tiny),
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 0.7,
    },
    {
      Header: "SKU",
      id: "sku",
      accessor: "sku",
      default: true,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 0.8,
    },
    {
      Header: "Product Name",
      id: "name",
      accessor: "name",
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 3,
    },
    {
      Header: "Price",
      accessor: (obj: any) => `$${currency(obj?.price)}`,
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 1,
    },
    {
      Header: "Description",
      accessor: (obj: any) => wrapWithDiv(obj?.description),
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 3.5,
    },
  ];

// this defines what and how will the columns will be displayed in your category selector page
const categorySelectorColumns = (config?: any) =>
  <ColumnsProp[]>[
    {
      Header: "ID",
      id: "id",
      accessor: "id",
      default: true,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 0.8,
    },
    {
      Header: "Image",
      id: "image",
      accessor: (obj: any) => getImage(obj?.primary_image?.url_tiny),
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 0.7,
    },
    {
      Header: "Category Name",
      id: "name",
      accessor: "name",
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
    },
    {
      Header: "Custom URL",
      accessor: "custom_url.url",
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
    },
    {
      Header: "Description",
      accessor: (obj: any) => wrapWithDiv(obj?.description),
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 4,
    },
  ];
// this function is used to arrange the product list on custom field
const arrangeList = (
  sortedIdsArray: any[] = [],
  dataArray: any[] = [],
  uniqueKey?: string
) => {
  const data: any[] = [];
  sortedIdsArray?.forEach((mItem: any) => {
    dataArray?.forEach((sItem: any) => {
      if (Number(sItem?.id) === Number(mItem)) {
        data.push(sItem);
      }
    });
  });
  return data;
};

const rootConfig: any = {
  verifyAppSigning,
  ecommerceEnv,
  configureConfigScreen,
  customKeys,
  openSelectorPage,
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
  arrangeList,
};

export default rootConfig;
