import React from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import {
  Icon,
  Tooltip,
  Link,
  Notification,
} from "@contentstack/venus-components";
import { TypePopupWindowDetails } from "../types";
import localeTexts from "../locale/en-us/index";
import NoImg from "../../assets/NoImg.svg";
import rootConfig from "../../root_config";

const isEmpty = (val: any): boolean =>
  val === undefined
  || val === null
  || (typeof val === "object" && !Object.keys(val)?.length)
  || (typeof val === "string" && !val?.trim()?.length);

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

const isObject = (obj: any) =>
  obj && typeof obj === "object" && !Array.isArray(obj);

const mergeObjects = (target = {}, source = {}) => {
  if (!isObject(target) || !isObject(source)) return target;

  if (!Object.keys(source)?.length) return target;

  const targetCopy = JSON.parse(JSON.stringify(target));
  const sourceCopy = JSON.parse(JSON.stringify(source));
  const result: any = {};

  (Object.keys(sourceCopy) || []).forEach((key) => {
    result[key] =      key in targetCopy
      && isObject(sourceCopy[key])
      && isObject(targetCopy[key])
        ? mergeObjects(targetCopy[key], sourceCopy[key])
        : sourceCopy[key];
  });
  return {
    ...targetCopy,
    ...result,
  };
};

const getSanitizedHTML = (content: any) => parse(DOMPurify.sanitize(content));

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

const wrapWithDiv = (description: string) =>
  description ? (
    <div className="product-desc">
      {getSanitizedHTML(removeHTMLTags(description))}
    </div>
  ) : (
    ""
  );

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
      if (sItem?.toString() === mItem?.toString()) {
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

  Object.entries(configScreen)?.forEach(([key, value]: any) => {
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
      if (sItem && sItem?.[uniqueKey] === mItem) {
        data.push(sItem);
      }
    });
  });
  return data;
};

const extractKeysForCustomApiValidation = (config: Record<string, any>) =>
  Object.entries(config)?.reduce(
    (acc, [key, value]) => {
      if (value?.isApiValidationEnabled) {
        if (value?.isMultiConfig) {
          acc?.multiConfigTrueAndApiValidationEnabled?.push(key);
        } else {
          acc?.multiConfigFalseAndApiValidationEnabled?.push(key);
        }
      }
      return acc;
    },
    {
      multiConfigTrueAndApiValidationEnabled: [] as string[],
      multiConfigFalseAndApiValidationEnabled: [] as string[],
    }
  );
const toastMessage = ({ type, text }: any) => {
  const message = text.replace("$", rootConfig.ecommerceEnv.APP_ENG_NAME);
  Notification({
    notificationContent: {
      text: message,
    },
    notifyProps: {
      hideProgressBar: false,
      className: "modal_toast_message",
      autoClose: true,
    },
    type,
  });
};

const convertStringAndMergeToObject = (
  inputString: string,
  value: any,
  existingObject: any
) => {
  const properties = inputString?.split(".");
  let temp = existingObject;

  for (let i = 0; i < properties?.length; i += 1) {
    const property = properties?.[i];
    const matchArrayIndex = property?.match(/(\w+)\[(\d+)\]/);
    // eslint-disable-next-line
    const isLastProperty = i === properties?.length - 1;

    if (matchArrayIndex) {
      const arrayName = matchArrayIndex?.[1];
      const index = parseInt(matchArrayIndex?.[2], 10);

      if (!temp?.[arrayName]) {
        temp[arrayName] = [];
      }

      if (!temp?.[arrayName]?.[index]) {
        temp[arrayName][index] = isLastProperty ? value : {};
      }

      temp = temp?.[arrayName]?.[index];
    } else {
      if (!temp?.[property]) {
        temp[property] = isLastProperty ? value : {};
      }

      temp = temp[property] ?? {};
    }
  }

  const removeEmptyFromArray = (arr: any) =>
    arr?.filter((item: any) => item !== undefined);
  const cleanUpArrays: any = (obj: any) => {
    if (Array.isArray(obj)) {
      return removeEmptyFromArray(obj?.map((item: any) => cleanUpArrays(item)));
    }
    if (typeof obj === "object" && obj !== null) {
      const newObj: any = {};
      Object.keys(obj)?.forEach((key) => {
        newObj[key] = cleanUpArrays(obj?.[key]);
      });
      return newObj;
    }
    return obj;
  };

  return cleanUpArrays(existingObject);
};

const navigateObject = (obj: any, findkeys: string[]) => {
  let currentObj = obj;
  let isKeyPresent = true;
  findkeys?.forEach((keyvalue: string) => {
    const regex = /\[.*\]/;
    if (regex?.test(keyvalue)) {
      const newKey = keyvalue?.replace(/\]/g, "");
      const subKeyArr = newKey?.split("[");
      // eslint-disable-next-line
      if (currentObj?.hasOwnProperty(subKeyArr?.[0])) {
        currentObj = currentObj?.[subKeyArr?.[0]]?.[subKeyArr?.[1]];
      } else {
        isKeyPresent = false;
      }
      // eslint-disable-next-line
    } else if (currentObj?.hasOwnProperty(keyvalue)) {
      currentObj = currentObj?.[keyvalue] ?? {};
    } else {
      isKeyPresent = false;
      currentObj = undefined;
    }
  });
  return { currentObj, isKeyPresent };
};

const getFilteredAssets = (assets: any[], keyArray: string[]) =>
  assets?.map((asset: any) => {
    let returnObj: any = {};

    keyArray?.forEach((key: string) => {
      const result = navigateObject(asset, key?.split("."));
      if (result?.isKeyPresent) {
        if (key?.includes(".") || key?.includes("[")) {
          const response = convertStringAndMergeToObject(
            key,
            result?.currentObj,
            returnObj
          );
          returnObj = response;
        } else {
          returnObj[key] = result?.currentObj;
        }
      }
    });
    return returnObj;
  });

export {
  getFilteredAssets,
  toastMessage,
  extractKeysForCustomApiValidation,
  isEmpty,
  popupWindow,
  filterFetchedArray,
  mergeObjects,
  gridViewDropdown,
  getSanitizedHTML,
  wrapWithDiv,
  getTypeLabel,
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
