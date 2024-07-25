/* eslint-disable */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import { isEmpty } from "lodash";
import useAppLocation from "../hooks/useAppLocation";
import { CustomFieldExtensionContext } from "../contexts/customFieldExtensionContext";
import rootConfig from "../../root_config";
import useError from "../hooks/useError";
import { getCustomCategoryData, getSelectedIDs } from "../../services";
import useAppConfig from "../hooks/useAppConfig";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import localeTexts from "../locale/en-us";
import categoryConfig from "../../root_config/categories";
import { arrangeList } from "../utils";
const CustomFieldExtensionProvider: React.FC<any> = function ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "product" | "category";
}) {
  const { appSdk } = useContext(MarketplaceAppContext);
  const appConfig = useAppConfig();
  const { location } = useAppLocation();
  const uniqueKey: any = rootConfig.ecommerceEnv.UNIQUE_KEY[type];
  const [stackApiKey, setStackApiKey] = useState<any>("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [entryIds, setEntryIds] = useState<any[]>([]);
  const { isInvalidCredentials, setIsInvalidCredentials } = useError();
  const [appSdkInitialized, setAppSdkInitialized] = useState<boolean>(false);

  const initialLoad = async () => {
    if (location) {
      const { api_key } = appSdk?.stack?._data ?? {};
      setStackApiKey(api_key);
      window.iframeRef = null;
      window.postRobot = appSdk?.postRobot;
      location?.frame?.enableAutoResizing();
      const fieldData = await location?.field?.getData();
      if (fieldData?.data?.length) {
        if (
          categoryConfig.customCategoryStructure === true &&
          type === "category"
        ) {
          console.log(
            categoryConfig.generateCustomCategoryData(fieldData),
            "custom category data"
          );
          setEntryIds(categoryConfig.generateCustomCategoryData(fieldData));
        } else setEntryIds(fieldData?.data?.map((i: any) => i?.[uniqueKey]));
      }
      setAppSdkInitialized(true);
    }
  };

  useEffect(() => {
    if (!isEmpty(appConfig)) {
      setSelectedIds(entryIds);
    }
  }, [appConfig, entryIds]);

  useEffect(() => {
    initialLoad();
  }, [location, appConfig]);

  useEffect(() => {
    // if (!state.appSdkInitialized) return;
    setIsInvalidCredentials({
      error: Object.values(appConfig ?? {}).includes(""),
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    });
  }, [appConfig]);

  const setFieldData = useCallback(
    async (data) => {
      // console.info("data from set field data", data);
      setLoading(true);
      await location?.field?.setData(data);
      setLoading(false);
    },
    [location, setLoading]
  );

  const fetchData = async (selectedIdsArray: any) => {
    if (
      Array.isArray(selectedIdsArray) &&
      !isEmpty(appConfig) &&
      selectedIdsArray.length &&
      !isInvalidCredentials.error
    ) {
      let res;
      if (
        categoryConfig.customCategoryStructure === true &&
        type === "category"
      ) {
        res = await getCustomCategoryData(appConfig, type, selectedIdsArray);
        if (res?.error) {
          setIsInvalidCredentials(res);
        } else setSelectedItems(res?.data?.items);
      } else {
        res = await getSelectedIDs(appConfig, type, selectedIdsArray);
        if (res?.error) {
          setIsInvalidCredentials(res);
        } else
          setSelectedItems(
            arrangeList(
              selectedIdsArray,
              res?.data?.data || res?.data?.items,
              uniqueKey
            )
          );
      }
    }
  };

  const removeIdFromField = (removeId: any) => {
    if (typeof rootConfig.removeItemsFromCustomField === "function") {
      const selectedIDs = rootConfig.removeItemsFromCustomField(
        removeId,
        selectedIds,
        type,
        uniqueKey
      );
      setSelectedIds(selectedIDs);
    } else {
      setSelectedIds(
        selectedIds?.filter((data: any) => data.toString() !== removeId.toString) // remove Number typecast
      );
    }
  };

  useEffect(() => {
    if (selectedIds.length) fetchData(selectedIds);
    else setSelectedItems([]);
  }, [selectedIds]);

  const handleDragEvent = (sortedItems: any) => {
    setSelectedItems([...sortedItems]);
  };

  const installInfo = useMemo(
    () => ({
      setFieldData,
      selectedIds,
      selectedItems,
      setSelectedIds,
      setSelectedItems,
      removeIdFromField,
      handleDragEvent,
      loading,
      stackApiKey,
      isInvalidCredentials,
      appSdkInitialized
    }),
    [
      setFieldData,
      loading,
      selectedIds,
      selectedItems,
      setSelectedIds,
      setSelectedItems,
      removeIdFromField,
      handleDragEvent,
      stackApiKey,
      isInvalidCredentials,
      appSdkInitialized
    ]
  );

  return (
    <CustomFieldExtensionContext.Provider value={installInfo}>
      {children}
    </CustomFieldExtensionContext.Provider>
  );
};
export default CustomFieldExtensionProvider;
