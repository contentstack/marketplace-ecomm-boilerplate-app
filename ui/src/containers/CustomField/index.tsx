/* eslint-disable */
/* Import React modules */
import React, { useCallback, useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import {
  Button,
  Dropdown,
  Icon,
  SkeletonTile,
  Tooltip,
} from "@contentstack/venus-components";
import { Props, TypeSDKData, TypeWarningtext } from "../../common/types";
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
import useProductCustomField from "../../common/hooks/useCustomField";
import useAppConfig from "../../common/hooks/useAppConfig";
import categoryConfig from "../../root_config/categories";

/* To add any labels / captions for fields or any inputs, use common/local/en-us/index.ts */

const CustomField: React.FC<any> = function ({
  type,
}: {
  type: "product" | "category";
}) {
  const {
    isInvalidCredentials,
    selectedItems,
    setSelectedIds,
    setFieldData,
    stackApiKey,
    appSdkInitialized,
  }: any = useProductCustomField();
  const appName = rootConfig.ecommerceEnv.REACT_APP_NAME;
  const uniqueKey: any = rootConfig.ecommerceEnv.UNIQUE_KEY[type];
  let childWindow: any;
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<any>({ value: "card" });
  const config = useAppConfig();
  // const [state, setState] = useState<TypeSDKData>({
  //   config: {},
  //   location: {},
  //   appSdkInitialized: false,
  // });

  // const fetchData = async (selectedIdsArray: any) => {
  //   if (
  //     Array.isArray(selectedIdsArray) &&
  //     !isEmpty(state?.config) &&
  //     selectedIdsArray.length &&
  //     !isInvalidCredentials.error
  //   ) {
  //     let res;
  //     if (
  //       rootConfig.ecomCustomFieldCategoryData === true &&
  //       type === "category"
  //     ) {
  //       res = await filter(state?.config, type, selectedIdsArray);
  //       if (res?.error) {
  //         setIsInvalidCredentials(res);
  //       } else setSelectedItems(res?.data?.items);
  //     } else {
  //       res = await getSelectedIDs(state?.config, type, selectedIdsArray);
  //       if (res?.error) {
  //         setIsInvalidCredentials(res);
  //       } else
  //         setSelectedItems(
  //           rootConfig.arrangeList(
  //             selectedIdsArray,
  //             res?.data?.data || res?.data?.items,
  //             uniqueKey
  //           )
  //         );
  //     }
  //   }
  // };

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (childWindow) childWindow.close();
      childWindow = undefined;
    });
  }, []);

  // useEffect(() => {
  //   ContentstackAppSdk.init()
  //     .then(async (appSdk) => {
  //       // eslint-disable-next-line no-unsafe-optional-chaining, no-underscore-dangle
  //       const { api_key } = appSdk?.stack?._data || {};
  //       setStackApiKey(api_key);

  //       const config = await appSdk?.getConfig();
  //       window.iframeRef = null;
  //       window.postRobot = appSdk?.postRobot;
  //       const entryData = appSdk?.location?.CustomField?.field?.getData();
  //       // console.info("entryData", entryData);
  //       appSdk?.location?.CustomField?.frame?.enableAutoResizing();
  //       if (entryData?.data?.length) {
  //         if (
  //           rootConfig.ecomCustomFieldCategoryData &&
  //           rootConfig.ecomCustomFieldCategoryData === true &&
  //           type === "category"
  //         ) {
  //           setEntryIds(
  //             entryData?.data?.map((i: any) => ({
  //               [uniqueKey]: i?.[uniqueKey],
  //               catalogId: i?.catalogId,
  //               catalogVersionId: i?.catalogVersionId,
  //             }))
  //           );
  //         } else setEntryIds(entryData?.data?.map((i: any) => i?.[uniqueKey]));
  //       }
  //       setState({
  //         config,
  //         location: appSdk.location,
  //         appSdkInitialized: true,
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("appSdk initialization error", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (!state.appSdkInitialized) return;
  //   setIsInvalidCredentials({
  //     error: Object.values(state.config || {}).includes(""),
  //     data: localeTexts.warnings.invalidCredentials.replace(
  //       "$",
  //       rootConfig.ecommerceEnv.APP_ENG_NAME
  //     ),
  //   });
  // }, [state.config]);

  // useEffect(() => {
  //   // if (!state.appSdkInitialized) return;
  //   // console.info(entryIds, "entryIds");
  //   setSelectedIds(entryIds);
  // }, [entryIds]);

  // useEffect(() => {
  //   // if (!state.appSdkInitialized) return;
  //   if (selectedIds.length) fetchData(selectedIds);
  //   else setSelectedItems([]);
  // }, [selectedIds]);

  useEffect(() => {
    // if (selectedItems?.length) {
    if (!appSdkInitialized) return;
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
    // }
    setLoading(false);
  }, [selectedItems]);

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
            selectedItems: dataArr,
            type,
            stackApiKey,
          },
          window.location.origin
        );
      } else if (data.message === "add") {
        if (
          type === "category" &&
          categoryConfig.customCategoryStructure === true
        )
          setSelectedIds(data?.dataArr); // FIXME remove this logic
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
      {
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
      }
    </div>
  );
};

export default CustomField;
