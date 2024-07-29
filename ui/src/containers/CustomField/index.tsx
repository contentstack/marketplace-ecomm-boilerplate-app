/* Import React modules */
import React, { useCallback, useEffect, useState } from "react";
/* Import other node modules */
import {
  Button,
  Dropdown,
  Icon,
  SkeletonTile,
  Tooltip,
} from "@contentstack/venus-components";
import { Props, TypeWarningtext } from "../../common/types";
/* Import our modules */
import RenderList from "./RenderList";
import WarningMessage from "../../components/WarningMessage";
import {
  popupWindow,
  getTypeLabel,
  gridViewDropdown,
  isEmpty,
} from "../../common/utils";

/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";
import localeTexts from "../../common/locale/en-us";
import rootConfig from "../../root_config";
import useProductCustomField from "../../common/hooks/useProductCustomField";
import useAppConfig from "../../common/hooks/useAppConfig";
import categoryConfig from "../../root_config/categories";

/* To add any labels / captions for fields or any inputs, use common/local/en-us/index.ts */

const CustomField: React.FC<Props> = function ({ type }) {
  /* eslint-disable */
  let {
    selectedIds,
    selectedItems,
    setSelectedIds,
    setFieldData,
    stackApiKey,
    advancedConfig,
    isOldUser,
  }: any = useProductCustomField();
  /* eslint-enable */

  const appName = rootConfig.ecommerceEnv.REACT_APP_NAME;
  const uniqueKey: any = rootConfig.ecommerceEnv.UNIQUE_KEY[type];
  let childWindow: any;
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<any>({ value: "card" });
  // eslint-disable-next-line
  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<TypeWarningtext>({
      error: false,
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    });
  const config = useAppConfig();

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (childWindow) childWindow.close();
      childWindow = undefined;
    });
  }, []);

  useEffect(() => {
    if (selectedItems?.length) {
      if (type === "category") {
        setFieldData({
          data: selectedItems,
          type: `${appName}_${type}`,
        });
      } else {
        // eslint-disable-next-line
        if (!config?.is_custom_json)
          setFieldData({
            data: selectedItems,
            type: `${appName}_${type}`,
          });
        else {
          const data: any[] = [];
          const keys = config?.custom_keys?.map((i: any) => i?.value);
          if (selectedItems?.length) {
            selectedItems.forEach((item: any) => {
              const obj1: any = {};
              keys?.forEach((key: any) => {
                obj1[key] = item[key];
              });
              data.push(obj1);
            });
          }
          setFieldData({
            data,
            type: `${appName}_${type}`,
          });
        }
      }
    }
    setLoading(false);
  }, [selectedItems, config]);

  const handleMessage = (event: any) => {
    const { data } = event;
    if (childWindow) {
      if (data === "openedReady" && !isEmpty(config)) {
        const dataArr = JSON.parse(
          JSON.stringify(selectedItems?.map((i: any) => i?.[uniqueKey]))
        );
        childWindow.postMessage(
          {
            message: "init",
            config,
            advancedConfig,
            selectedItems: dataArr,
            selectedIds,
            type,
            stackApiKey,
            isOldUser,
          },
          window.location.origin
        );
      } else if (data.message === "add") {
        if (
          type === "category"
          && categoryConfig.customCategoryStructure === true
        )
          setSelectedIds(data?.dataIds); // FIXME remove this logic
        else setSelectedIds(data?.dataIds);
      } else if (data.message === "close") {
        childWindow = undefined;
      }
    }
  };
  const handleClick = () => {
    if (!childWindow) {
      childWindow = popupWindow({
        url: `${process.env.REACT_APP_UI_URL}/selector-page`,
        title: `${rootConfig.ecommerceEnv.APP_ENG_NAME}Client`,
        w: 1440,
        h: 844,
      });
      window.addEventListener("message", handleMessage, false);
    } else childWindow.focus();
  };

  const handleToggle = useCallback((event: any) => {
    setView(event);
  }, []);

  const renderCustomField = () => {
    if (isInvalidCredentials.error)
      return <WarningMessage content={isInvalidCredentials?.data} />;
    if (loading) {
      return (
        <SkeletonTile
          numberOfTiles={2}
          tileHeight={10}
          tileWidth={300}
          tileBottomSpace={20}
          tileTopSpace={10}
          tileleftSpace={10}
          tileRadius={10}
        />
      );
    }
    if (selectedItems?.length) {
      return (
        <div className="extension-content">
          <div className="box-header">
            <span className="left-header">
              {selectedItems.length} {getTypeLabel(type, selectedItems.length)}
            </span>
            <div className="viewToggler">
              <Dropdown
                list={gridViewDropdown}
                dropDownType="primary"
                type="click"
                viewAs="label"
                onChange={handleToggle}
                withArrow
                withIcon
                dropDownPosition="bottom"
                closeAfterSelect
                highlightActive={false}
              >
                <Tooltip
                  content={localeTexts.customField.toolTip.content}
                  position="top"
                >
                  <Icon
                    icon={
                      view.value === "card"
                        ? localeTexts.customField.toolTip.thumbnail
                        : localeTexts.customField.toolTip.list
                    }
                    size="original"
                  />
                </Tooltip>
              </Dropdown>
            </div>
          </div>
          <RenderList
            type={type}
            view={view?.value}
            childWindow={childWindow}
          />
        </div>
      );
    }
    return (
      <div className="no-selected-items">
        {localeTexts.customField.noItems.replace("$", getTypeLabel(type, 2))}
      </div>
    );
  };

  /* Handle your UI as per requirement. State variable will hold
        the configuration details from the appSdk. */
  return (
    <div className="layout-container">
      <div className="field-extension-wrapper">
        {renderCustomField()}
        <Button
          onClick={handleClick}
          className="add-product-btn"
          buttonType="control"
          disabled={isInvalidCredentials.error || loading}
        >
          {localeTexts.customField.addHere}{" "}
          {type === "category"
            ? localeTexts.customField.buttonText.category
            : localeTexts.customField.buttonText.product}
        </Button>
      </div>
    </div>
  );
};

export default CustomField;
