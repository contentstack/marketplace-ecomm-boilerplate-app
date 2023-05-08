import React from "react";
import currency from "currency.js";
import { Icon, Link, Tooltip } from "@contentstack/venus-components";
import { TypePopupWindowDetails } from "../types";
import localeTexts from "../locale/en-us";
// eslint-disable-next-line import/no-cycle
import rootConfig from "../../root_config";

const isEmpty = (val: any) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val).length) ||
  (typeof val === "string" && !val.trim().length);

const removeArrayObjectsById = (id: any, state: any, setState: any) => {
  setState(state?.filter((item: any) => item?.id !== id));
};

const popupWindow = (windowDetails: TypePopupWindowDetails) =>
  window.open(
    windowDetails.url,
    windowDetails.title,
    "toolbar=no, location=no, directories=no, " +
      "status=no, menubar=no, scrollbars=no, resizable=no, " +
      `copyhistory=no, width=${windowDetails.w}, ` +
      `height=${windowDetails.h}, ` +
      `top=${window.screen.height / 2 - windowDetails.h / 2}, left=${
        window.screen.width / 2 - windowDetails.w / 2
      }`
  );

const mergeObjects = (target: any, source: any) => {
  // Iterate through `source` properties and if an `Object` then
  // set property to merge of `target` and `source` properties
  Object.keys(source)?.forEach((key) => {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeObjects(target[key], source[key]));
    }
  });

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};

const getImage = (url: string) =>
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
        <Icon icon="RedAlert" />
      </Tooltip>
    </div>
  );

const removeHTMLTags = (description: string) =>
  description ? description.replace(/(<([^>]+)>)/gi, " ") : "";

// eslint-disable-next-line
/* eslint-disable @typescript-eslint/naming-convention */
const wrapWithDiv = (description: string) =>
  description ? (
    <div
      className="product-desc"
      dangerouslySetInnerHTML={{ __html: removeHTMLTags(description) }}
    />
  ) : (
    ""
  );

const listViewColumns = [
  {
    Header: "ID",
    id: "id",
    accessor: "id",
    default: true,
    addToColumnSelector: true,
  },
  {
    Header: "Product Name",
    id: "name",
    accessor: "name",
    default: false,
    addToColumnSelector: true,
  },
  {
    Header: "Price",
    id: "price",
    accessor: (obj: any) => `$${currency(obj?.price)}`,
    default: false,
    addToColumnSelector: true,
  },
];

const gridViewDropdown = [
  {
    label: (
      <span className="select-view">
        <Icon icon="Thumbnail" size="original" />
        <div>Thumbnail</div>
      </span>
    ),
    value: "card",
    default: true,
  },
  {
    label: (
      <span className="select-view">
        <Icon icon="List" />
        <div>List</div>
      </span>
    ),
    value: "list",
  },
];

const getTypeLabel = (type: string, length: number) => {
  if (type === "category") {
    return length > 1 ? "Categories" : "Category";
  }
  return length > 1 ? "Products" : "Product";
};

const EmptyObjForSearchCase: any = {
  heading: <h4 style={{ color: "#222222" }}>No matching results found!</h4>,
  description: (
    <p>
      Try changing the search query or filters to find what you are looking for.
    </p>
  ),
  actions: (
    <div>
      <p>
        Not sure where to start? Visit our{" "}
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
          help center
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
  mergeObjects,
  removeArrayObjectsById,
  listViewColumns,
  gridViewDropdown,
  getTypeLabel,
  EmptyObjForSearchCase,
  arrangeList,
  arrangeSelectedIds,
  removeHTMLTags,
  wrapWithDiv,
  getImage
};
