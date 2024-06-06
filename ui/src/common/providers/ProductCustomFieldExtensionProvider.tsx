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
import { ProductCustomFieldExtensionContext } from "../contexts/productCustomFieldExtensionContext";
import rootConfig from "../../root_config";
import useError from "../hooks/useError";
import { filter, getSelectedIDs } from "../../services";
import useAppConfig from "../hooks/useAppConfig";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import useAppSdk from "../hooks/useAppSdk";
import localeTexts from "../../common/locale/en-us";

const ProductCustomFieldExtensionProvider: React.FC<any> = function ({
  children,
  type,
}: any) {
  const { appConfig, appSdk } = useContext(MarketplaceAppContext);
  const { location } = useAppLocation();
  const uniqueKey: any = rootConfig.ecommerceEnv.UNIQUE_KEY[type];
  const [stackApiKey, setStackApiKey] = useState<any>("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isInvalidCredentials, setIsInvalidCredentials } = useError();

  const initialLoad = async () => {
    if (location) {
      const { api_key } = appSdk?.stack?._data ?? {};
      setStackApiKey(api_key);
      window.iframeRef = null;
      window.postRobot = appSdk?.postRobot;
      location?.frame?.enableAutoResizing();
      const fieldData = await location?.field?.getData();
      console.info(fieldData, "field data");
      // console.info(config, "CONFIG FROM HOOK");
      if (fieldData?.data?.length) {
        if (
          rootConfig.ecomCustomFieldCategoryData &&
          rootConfig.ecomCustomFieldCategoryData === true &&
          type === "category"
        ) {
          setSelectedIds(
            fieldData?.data?.map((i: any) => ({
              [uniqueKey]: i?.[uniqueKey],
              catalogId: i?.catalogId,
              catalogVersionId: i?.catalogVersionId,
            }))
          );
        } else setSelectedIds(fieldData?.data?.map((i: any) => i?.[uniqueKey]));
      }
    }
  };

  useEffect(() => {
    initialLoad();
  }, [location, appConfig]);

  useEffect(() => {
    console.log(appConfig, "app config");
  }, [appConfig]);

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
      setLoading(true);
      await location?.field?.setData(data);
      // setProductCustomField(data);
      setLoading(false);
    },
    [location, setLoading]
  );

  const fetchData = async (selectedIdsArray: any) => {
    console.info(selectedIdsArray, "FETCH DATA called in provider");
    console.info(
      Array.isArray(selectedIdsArray),
      !isEmpty(appConfig),
      selectedIdsArray.length,
      !isInvalidCredentials.error
    );
    if (
      Array.isArray(selectedIdsArray) &&
      !isEmpty(appConfig) &&
      selectedIdsArray.length &&
      !isInvalidCredentials.error
    ) {
      let res;
      console.info("in fetch data");
      if (
        rootConfig.ecomCustomFieldCategoryData === true &&
        type === "category"
      ) {
        res = await filter(appConfig, type, selectedIdsArray);
        if (res?.error) {
          setIsInvalidCredentials(res);
        } else setSelectedItems(res?.data?.items);
      } else {
        res = await getSelectedIDs(appConfig, type, selectedIdsArray);
        console.info(res, "res in provider");
        if (res?.error) {
          setIsInvalidCredentials(res);
        } else
          setSelectedItems(
            rootConfig.arrangeList(
              selectedIdsArray,
              res?.data?.data || res?.data?.items,
              uniqueKey
            )
          );
      }
    }
  };

  const removeIdFromField = (removeId: any) => {
    if (
      rootConfig.ecomCustomFieldCategoryData &&
      rootConfig.ecomCustomFieldCategoryData === true
    ) {
      rootConfig.removeItemsFromCustomField(
        removeId,
        selectedIds,
        setSelectedIds,
        type,
        uniqueKey
      );
    } else {
      setSelectedIds(
        selectedIds?.filter((data: any) => Number(data) !== removeId) // remove Number typecast
      );
    }
  };

  useEffect(() => {
    console.info(selectedIds, "selectedIds in provider");
    if (selectedIds.length) fetchData(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    console.info(selectedItems, "selectedItems IN provider");
  }, [selectedItems]);

  const handleDragEvent = (sortedItems: any) => {
    setSelectedItems([...sortedItems]);
  };

  const installInfo = useMemo(
    () => ({
      // productCustomField,
      setFieldData,
      selectedIds,
      selectedItems,
      setSelectedIds,
      setSelectedItems,
      removeIdFromField,
      handleDragEvent,
      loading,
      stackApiKey,
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
    ]
  );

  return (
    <ProductCustomFieldExtensionContext.Provider value={installInfo}>
      {children}
    </ProductCustomFieldExtensionContext.Provider>
  );
};
export default ProductCustomFieldExtensionProvider;
