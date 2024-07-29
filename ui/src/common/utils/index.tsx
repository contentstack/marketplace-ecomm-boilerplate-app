import React from "react";
import { Icon, Tooltip, Link } from "@contentstack/venus-components";
import { TypePopupWindowDetails } from "../types";
import localeTexts from "../locale/en-us/index";
import NoImg from "../../assets/NoImg.svg";

const isEmpty = (val: any): boolean =>
  val === undefined
  || val === null
  || (typeof val === "object" && !Object.keys(val)?.length)
  || (typeof val === "string" && !val.trim().length);

const filterFetchedArray = (array: any[]) => {
  const tempFetchedList = [...array];
  return Array.from(new Set(tempFetchedList?.map((a) => a.id))).map((id) =>
    tempFetchedList.find((a) => a.id === id)
  );
};

const popupWindow = (windowDetails: TypePopupWindowDetails) => {
  const left = window.screen.width / 2 - windowDetails.w / 2;
  const top = window.screen.height / 2 - windowDetails.h / 2;
  return window.open(
    windowDetails.url,
    windowDetails.title,
    "toolbar=no, location=no, directories=no, "
      + `status=no, menubar=no, scrollbars=no, resizable=no, `
      + `copyhistory=no, width=${windowDetails.w}, `
      + `height=${windowDetails.h}, `
      + `top=${top}, left=${left}`
  );
};

const mergeObjects = (target: any, source: any) => {
  const sourceCopy = JSON.parse(JSON.stringify(source)); // Deep copy of source

  Object.keys(sourceCopy)?.forEach((key) => {
    if (sourceCopy[key] instanceof Object && key in target) {
      Object.assign(
        sourceCopy[key],
        mergeObjects(target[key], sourceCopy[key])
      );
    }
  });

  Object.assign(target || {}, sourceCopy);
  return target;
};

const getCurrencySymbol = (code: string) => {
  switch (code) {
    case "USD":
      return "$"; // US Dollar
    case "EUR":
      return "€"; // Euro
    case "CRC":
      return "₡"; // Costa Rican Colón
    case "GBP":
      return "£"; // British Pound Sterling
    case "ILS":
      return "₪"; // Israeli New Sheqel
    case "INR":
      return "₹"; // Indian Rupee
    case "JPY":
      return "¥"; // Japanese Yen
    case "KRW":
      return "₩"; // South Korean Won
    case "NGN":
      return "₦"; // Nigerian Naira
    case "PHP":
      return "₱"; // Philippine Peso
    case "PLN":
      return "zł"; // Polish Zloty
    case "PYG":
      return "₲"; // Paraguayan Guarani
    case "THB":
      return "฿"; // Thai Baht
    case "UAH":
      return "₴"; // Ukrainian Hryvnia
    case "VND":
      return "₫"; // Vietnamese Dong
    default:
      return "";
  }
};

const wrapWithDiv = (description: string) =>
  description ? (
    <div
      className="product-desc"
      // eslint-disable-next-line react/no-danger, @typescript-eslint/no-use-before-define, @typescript-eslint/naming-convention
      dangerouslySetInnerHTML={{ __html: removeHTMLTags(description) }}
    />
  ) : (
    ""
  );
const findProduct = (products: any, id: any, uniqueKey: any) =>
  products?.find((p: any) => p?.[uniqueKey] === id) || {};

const findProductIndex = (products: any, id: any) =>
  products?.findIndex((p: any) => p?.id === id);

const getImage = (url: string, customField: boolean = false) =>
  url ? (
    <div
      className={
        customField ? "custom-field-product-image" : "selector-product-image"
      }
    >
      <img src={url} alt="item-img" />
    </div>
  ) : (
    <div
      className={
        customField ? "custom-field-product-image" : "selector-product-image"
      }
    >
      <Tooltip
        content={localeTexts.selectorPage.ImageTooltip.label}
        position="top"
        showArrow={false}
        variantType="light"
        type="secondary"
      >
        <img
          src={NoImg}
          alt={localeTexts.selectorPage.noImageAvailable}
          className={
            customField
              ? "custom-field-product-image"
              : "selector-product-image"
          }
        />
      </Tooltip>
    </div>
  );

const productColumns = [
  {
    Header: "Product Id",
    id: "code",
    accessor: "code",
    default: true,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 0.8,
  },
  {
    Header: "Image",
    accessor: (obj: any) =>
      obj?.images?.[0]?.url
        ? getImage(
            `https://api.ct8lafaf1m-contentst1-d1-public.model-t.cc.commerce.ondemand.com${obj?.images?.[0]?.url}`
          )
        : getImage(obj?.images?.[0]?.url),
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 0.7,
  },
  {
    Header: "Product Name",
    id: "key",
    accessor: (productData: any) => productData?.key,
    default: true,
    disableSortBy: true,
    addToColumnSelector: true,
    columnWidthMultiplier: 3,
  },
  {
    Header: "Price",
    accessor: (obj: any) => obj?.price?.formattedValue,
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
const categoryColumns = [
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
    Header: "Category Name",
    id: "name",
    accessor: "name",
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
  },
  {
    Header: "Custom URL",
    accessor: (obj: any) => obj?.custom_url?.url || obj?.url,
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

const gridViewDropdown = [
  {
    label: (
      <span className="select-view">
        <Icon icon="Thumbnail" size="original" />
        <div>{localeTexts.gridViewDropdown.Thumbnail}</div>
      </span>
    ),
    value: "card",
    default: true,
  },
  {
    label: (
      <span className="select-view">
        <Icon icon="List" />
        <div>{localeTexts.gridViewDropdown.List}</div>
      </span>
    ),
    value: "list",
  },
];

const removeHTMLTags = (description: string) =>
  description ? description.replace(/(<([^>]+)>)/gi, " ") : "";

const getTypeLabel = (type: string, length: number) => {
  if (type === "category") {
    if (length > 1) return "Categories";
    return "Category";
  }
  if (length > 1) return "Products";
  return "Product";
};

const getRowsStatus = (len: number, loading: boolean = true) => ({
  ...[...Array(len)]?.map(() => (loading ? "loading" : "loaded")),
});
const EmptyObjForSearchCase: any = {
  heading: (
    <h4 style={{ color: "#222222" }}>{localeTexts.EmptyObj.NoResults}</h4>
  ),
  description: <p>{localeTexts.EmptyObj.changeQuery}</p>,
  actions: (
    <div>
      <p>
        {localeTexts.EmptyObj.visitCS}{" "}
        <Link
          fontColor="link"
          fontSize="medium"
          fontWeight="regular"
          href="https://contentstack.com"
          iconName="NewTab"
          target="_blank"
          testId="cs-link"
          underline={false}
        >
          {localeTexts.EmptyObj.help}
        </Link>
      </p>
    </div>
  ),
  moduleIcon: "Search",
};

const getItemStatusMap = (
  itemStatusMap: any,
  status: string,
  start: number,
  limit: number
) => {
  const itemStatusMapTemp: any = { ...itemStatusMap };
  for (let index = start; index < limit; index += 1) {
    itemStatusMapTemp[index] = status;
  }
  return itemStatusMapTemp;
};

const arrangeSelectedIds = (sortedIdsArray: any[], dataArray: any[]) => {
  const data: any[] = [];

  sortedIdsArray?.forEach((mItem: any) => {
    dataArray?.forEach((sItem: any) => {
      if (sItem.toString() === mItem.toString()) {
        data.push(sItem);
      }
    });
  });
  data.push(...dataArray.filter((x: any) => !data.includes(x)));
  return data;
};

const categorizeConfigFields = (configFields: any) => {
  const isMultiConfigAndSaveInServerConfig: any = {};
  const isMultiConfigAndSaveInConfig: any = {};
  const isNotMultiConfigAndSaveInConfig: any = {};
  const isNotMultiConfigAndSaveInServerConfig: any = {};

  Object.keys(configFields).forEach((key) => {
    const field = configFields?.[key];
    if (field?.isMultiConfig) {
      if (field?.saveInServerConfig) {
        isMultiConfigAndSaveInServerConfig[key] = "";
      }
      if (field?.saveInConfig) {
        isMultiConfigAndSaveInConfig[key] = "";
      }
    } else {
      if (field?.saveInConfig) {
        isNotMultiConfigAndSaveInConfig[key] = "";
      }
      if (field?.saveInServerConfig) {
        isNotMultiConfigAndSaveInServerConfig[key] = "";
      }
    }
  });

  return {
    isMultiConfigAndSaveInServerConfig,
    isMultiConfigAndSaveInConfig,
    isNotMultiConfigAndSaveInConfig,
    isNotMultiConfigAndSaveInServerConfig,
  };
};

const extractFieldsByConfigType = (configScreen: any) => {
  const multiConfigFields: string[] = [];
  const singleConfigFields: string[] = [];

  Object.entries(configScreen).forEach(([key, value]: any) => {
    if (value?.isMultiConfig) {
      multiConfigFields.push(key);
    } else {
      singleConfigFields.push(key);
    }
  });

  return { multiConfigFields, singleConfigFields };
};
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
  return data;
};

export {
  isEmpty,
  popupWindow,
  filterFetchedArray,
  mergeObjects,
  productColumns,
  categoryColumns,
  gridViewDropdown,
  wrapWithDiv,
  getTypeLabel,
  getCurrencySymbol,
  findProduct,
  findProductIndex,
  getImage,
  getRowsStatus,
  EmptyObjForSearchCase,
  arrangeSelectedIds,
  getItemStatusMap,
  removeHTMLTags,
  categorizeConfigFields,
  extractFieldsByConfigType,
  arrangeList,
};
