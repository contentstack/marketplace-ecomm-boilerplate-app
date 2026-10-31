import React from "react";
import { Icon, Tooltip, Link } from "@contentstack/venus-components";
import { TypePopupWindowDetails } from "../types";
import localeTexts from "../locale/en-us/index";
import NoImg from "../../assets/NoImg.svg";

const isEmpty = (val: any): boolean =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim().length);

const popupWindow = (windowDetails: TypePopupWindowDetails) => {
  const left = window.screen.width / 2 - windowDetails.w / 2;
  const top = window.screen.height / 2 - windowDetails.h / 2;
  return window.open(
    windowDetails.url,
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

const findProduct = (products: any, id: any) =>
  products?.find((p: any) => p?.id === id) || {};

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
  mergeObjects,
  gridViewDropdown,
  wrapWithDiv,
  getTypeLabel,
  findProduct,
  getImage,
  EmptyObjForSearchCase,
  arrangeSelectedIds,
  getItemStatusMap,
  removeHTMLTags,
};
