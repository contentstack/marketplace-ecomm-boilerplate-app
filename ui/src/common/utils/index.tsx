import React from "react";
import { Icon, Tooltip, Link } from "@contentstack/venus-components";
import { TypePopupWindowDetails } from "../types";
import localeTexts from "../locale/en-us/index";
import NoImg from "../../assets/NoImg.svg";
// eslint-disable-next-line import/no-cycle
import rootConfig from "../../root_config";

const isEmpty = (val: any): boolean =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim().length);

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
    // JSON.stringify(windowDetails.title),
    windowDetails.title,
    "toolbar=no, location=no, directories=no, " +
      `status=no, menubar=no, scrollbars=no, resizable=no, ` +
      `copyhistory=no, width=${windowDetails.w}, ` +
      `height=${windowDetails.h}, ` +
      `top=${top}, left=${left}`
  );
};

const mergeObjects = (target: any, source: any) => {
  Object.keys(source)?.forEach((key) => {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeObjects(target[key], source[key]));
    }
  });
  Object.assign(target || {}, source);
  return target;
};

const setImage = (url: string) =>
  url ? (
    <div className="selector-product-image">
      <img src={url} alt="item-img" />
    </div>
  ) : (
    <div className="selector-product-image">
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
          className="selector-product-image"
        />
      </Tooltip>
    </div>
  );

const categoriesImg = (obj: any) => {
  if (obj?.c_slotBannerImage) {
    return obj?.c_slotBannerImage;
  }
  if (obj?.image) {
    return obj?.image;
  }
  if (obj?.c_headerMenuBanner) {
    // eslint-disable-next-line
    return obj?.c_headerMenuBanner
      .match(/(https?:\/\/[^ ]*)/)[1]
      .replace(/"/g, "");
  }
  return undefined;
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

const getPrice = (obj: any) =>
  `${getCurrencySymbol(obj?.currency)} ${obj?.price}`;

const productColumns = [
  {
    Header: "Product Id",
    id: "productId",
    accessor: "productId",
    default: true,
    disableSortBy: true,
    addToColumnSelector: true,
  },
  {
    Header: "Image",
    accessor: (obj: any) => setImage(obj?.image?.disBaseLink),
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
  },
  {
    Header: "Product Name",
    id: "productName",
    accessor: "productName",
    default: true,
    disableSortBy: true,
    addToColumnSelector: true,
  },
  {
    Header: "Price",
    accessor: (obj: any) => (!obj.price ? "" : getPrice(obj)),
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
  },
];
const categoryColumns = [
  {
    Header: "Id",
    id: "Id",
    accessor: "id",
    default: true,
    disableSortBy: true,
    addToColumnSelector: true,
  },
  {
    Header: "Image",
    accessor: (obj: any) => setImage(categoriesImg(obj)),
    default: false,
    disableSortBy: true,
    addToColumnSelector: true,
  },
  {
    Header: "Name",
    id: "Name",
    accessor: "name",
    default: true,
    disableSortBy: true,
    addToColumnSelector: true,
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

const wrapWithDiv = (description: string) =>
  description ? (
    <div
      className="product-desc"
      // eslint-disable-next-line react/no-danger, @typescript-eslint/no-use-before-define, @typescript-eslint/naming-convention
      dangerouslySetInnerHTML={{ __html: removeHTMLTags(description) }}
    />
  ) : (
    "Not Available"
  );

const getTypeLabel = (type: string, length: number) => {
  if (type === "category") {
    if (length > 1) return "Categories";
    return "Category";
  }
  if (length > 1) return "Products";
  return "Product";
};

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
            customField ?
              "custom-field-product-image"
              : "selector-product-image"
          }
        />
      </Tooltip>
    </div>
  );
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

const arrangeList = (sortedIdsArray: any[], dataArray: any[]) => {
  const data: any[] = [];
  sortedIdsArray?.forEach((mItem: any) => {
    dataArray?.forEach((sItem: any) => {
      if (
        Number(sItem?.[rootConfig.ecommerceEnv.UNIQUE_KEY.product]) ===
        Number(mItem)
      ) {
        data.push(sItem);
      }
    });
  });
  return data;
};

const arrangeSelectedIds = (sortedIdsArray: any[], dataArray: any[]) => {
  const data: any[] = [];

  sortedIdsArray?.forEach((mItem: any) => {
    dataArray?.forEach((sItem: any) => {
      if (Number(sItem) === Number(mItem)) {
        data.push(sItem);
      }
    });
  });
  data.push(...dataArray.filter((x: any) => !data.includes(x)));
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
  getImage,
  getRowsStatus,
  EmptyObjForSearchCase,
  arrangeList,
  arrangeSelectedIds,
  removeHTMLTags,
};
