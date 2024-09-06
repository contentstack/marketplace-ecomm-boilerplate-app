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
import { EntryIdsType } from "../types";
import { getCustomCategoryData, getSelectedIDs } from "../../services";
import useAppConfig from "../hooks/useAppConfig";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import localeTexts from "../locale/en-us";
import categoryConfig from "../../root_config/categories";

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
  const isMultiConfigEnabled = rootConfig.ecommerceEnv.ENABLE_MULTI_CONFIG;
  const [stackApiKey, setStackApiKey] = useState<any>("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [entryIds, setEntryIds] = useState<EntryIdsType[]>([]);
  const { isInvalidCredentials, setIsInvalidCredentials } = useError();
  const [isOldUser, setIsOldUser] = useState<Boolean>(false);
  const [advancedConfig, setAdvancedConfig] = useState<any>([]);
  const [appSdkInitialized, setAppSdkInitialized] = useState<boolean>(false);

  const getFieldConfigValue = (
    currentLocale: any,
    fieldConfigData: any,
    config: any
  ) => {
    const findMatchingKeys = (keys: any) =>
      keys?.filter((key: any) => config?.multi_config_keys?.[key]);

    if (fieldConfigData?.locale?.[currentLocale]?.config_label?.length) {
      const localeConfigLabels =        fieldConfigData?.locale?.[currentLocale]?.config_label;
      const matchingLocaleKeys = findMatchingKeys(localeConfigLabels);
      if (matchingLocaleKeys?.length) {
        return matchingLocaleKeys;
      }
    }

    if (fieldConfigData?.config_label?.length) {
      const matchingDataKeys = findMatchingKeys(fieldConfigData?.config_label);
      if (matchingDataKeys?.length) {
        return matchingDataKeys;
      }
    }

    if (fieldConfigData?.config_label?.length) {
      const matchingTopLevelKeys = findMatchingKeys(
        fieldConfigData?.config_label
      );
      if (matchingTopLevelKeys?.length) {
        return matchingTopLevelKeys;
      }
    }
    return [];
  };

  const initialLoad = async () => {
    if (location) {
      // eslint-disable-next-line
      const { api_key } = appSdk?.stack?._data ?? {};
      let updatedFieldData: any = [];
      let oldUser: any = isMultiConfigEnabled === false;
      setIsOldUser(oldUser);
      setStackApiKey(api_key);
      window.iframeRef = null;
      window.postRobot = appSdk?.postRobot;
      location?.frame?.enableAutoResizing();
      const fieldData = await location?.field?.getData();
      const retrievedAdvancedFieldConfigs = await location?.fieldConfig;
      const currentLocale = await location?.entry?.locale;
      const data = getFieldConfigValue(
        currentLocale,
        retrievedAdvancedFieldConfigs,
        appConfig
      );
      if (data?.length) {
        setAdvancedConfig(data);
      }
      if (appConfig) {
        const ISOLDUSER = !Object.keys(appConfig ?? {}).includes(
          "multi_config_keys"
        );
        setIsOldUser(ISOLDUSER);

        if (ISOLDUSER) {
          oldUser = true;
        }
      }
      if (oldUser === true) {
        updatedFieldData = fieldData?.data?.map((fieldDataSet: any) => ({
          ...fieldDataSet,
          cs_metadata: {
            multiConfigName: "legacy_config",
            isConfigDeleted: false,
          },
        }));
      }
      // eslint-disable-next-line
      else {
        updatedFieldData = fieldData?.data?.map((fieldDataSet: any) => {
          if (
            !fieldDataSet?.cs_metadata
            && fieldDataSet?.cs_metadata?.multiConfigName !== "legacy_config"
            && fieldDataSet?.cs_metadata?.isConfigDeleted !== false
          ) {
            return {
              ...fieldDataSet,
              cs_metadata: {
                multiConfigName: "legacy_config",
                isConfigDeleted: false,
              },
            };
          }
          return {
            ...fieldDataSet,
          };
        });
      }

      if (updatedFieldData?.length) {
        if (
          categoryConfig.customCategoryStructure === true
          && type === "category"
        ) {
          if (oldUser === true) {
            setEntryIds(categoryConfig.generateCustomCategoryData(fieldData));
          } else {
            const returnProductFormatedData: any =              rootConfig.mapCategoryIdsByMultiConfig(updatedFieldData, type);
            setEntryIds(returnProductFormatedData);
          }
        } else {
          // eslint-disable-next-line
          if (
            type === "category"
            && categoryConfig.customCategoryStructure === false
          ) {
            if (oldUser === true) {
              setEntryIds(updatedFieldData?.map((i: any) => i?.[uniqueKey]));
            } else {
              const returnProductFormatedData: any =                rootConfig.mapProductIdsByMultiConfig(updatedFieldData, type);
              setEntryIds(returnProductFormatedData);
            }
          } else {
            // eslint-disable-next-line
            if (oldUser === true) {
              setEntryIds(updatedFieldData?.map((i: any) => i?.[uniqueKey]));
            } else {
              const returnProductFormatedData: any =                rootConfig.mapProductIdsByMultiConfig(updatedFieldData, type);
              setEntryIds(returnProductFormatedData);
            }
          }
        }
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
    if (appConfig) {
      setIsInvalidCredentials({
        error: Object?.keys(appConfig)?.length
          ? Object.values(appConfig ?? {}).includes("")
          : true,
        data: localeTexts.warnings.invalidCredentials.replace(
          "$",
          rootConfig.ecommerceEnv.APP_ENG_NAME
        ),
      });
    }
  }, [appConfig]);

  const setFieldData = useCallback(
    async (data) => {
      setLoading(true);
      await location?.field?.setData(data);
      setLoading(false);
    },
    [location, setLoading]
  );
  const fetchData = async (selectedIdsArray: any) => {
    if (isEmpty(selectedIdsArray)) {
      setSelectedItems([]);
      return; // Exit early since there's nothing to fetch
    }

    if (
      isOldUser
        ? Array.isArray(selectedIdsArray)
        : Object.keys(selectedIdsArray)?.length
          && !isEmpty(appConfig)
          && isOldUser
        ? selectedIdsArray?.length
        : Object.keys(selectedIdsArray)?.length && !isInvalidCredentials.error
    ) {
      let res;

      if (
        categoryConfig.customCategoryStructure === true
        && type === "category"
      ) {
        res = await getCustomCategoryData(
          appConfig,
          type,
          selectedIdsArray,
          isOldUser
        );
      } else if (
        categoryConfig.customCategoryStructure === false
        && type === "category"
      ) {
        res = await getCustomCategoryData(
          appConfig,
          type,
          selectedIdsArray,
          isOldUser
        );
      } else {
        res = await getSelectedIDs(
          appConfig,
          type,
          selectedIdsArray,
          isOldUser
        );
      }

      // Error handling for all cases
      if (res?.error) {
        setIsInvalidCredentials({
          error: true,
          data:
            res?.data
            ?? localeTexts.warnings.invalidCredentials.replace(
              "$",
              rootConfig.ecommerceEnv.APP_ENG_NAME
            ),
        });
      } else {
        setSelectedItems(res?.data?.items);
      }
    }
  };

  const removeIdFromField = (removeId: any, multiConfigName: any) => {
    if (typeof rootConfig.removeItemsFromCustomField === "function") {
      const selectedIDs = rootConfig.removeItemsFromCustomField(
        removeId,
        selectedIds,
        type,
        uniqueKey,
        isOldUser,
        multiConfigName
      );

      setEntryIds(selectedIDs);
      if (selectedIDs?.length === 0) {
        setSelectedItems([]);
        setSelectedIds([]);
      }
    } else {
      // eslint-disable-next-line
      if (isOldUser === true) {
        if (type === "category") {
          setEntryIds(selectedIds?.filter((data: any) => data !== removeId));
        } else {
          setEntryIds(selectedIds?.filter((data: any) => data !== removeId));
        }
      } else {
        let updatedRootConfig = { ...selectedIds };
        const config = selectedIds?.[multiConfigName];
        const updatedIds = config?.multiConfiguniqueKey?.filter(
          (id: any) => id !== removeId
        );
        const updatedConfig = {
          ...config,
          multiConfiguniqueKey: updatedIds,
        };

        updatedRootConfig = {
          ...updatedRootConfig,
          [multiConfigName]: updatedConfig,
        };
        setEntryIds(updatedRootConfig);
      }
    }

    return "";
  };

  useEffect(() => {
    const isEmptySelectedIds = isOldUser
      ? selectedIds?.length === 0
      : Object.keys(selectedIds)?.length === 0;
    if (isEmptySelectedIds) {
      setSelectedItems([]);
    } else {
      fetchData(selectedIds);
    }
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
      advancedConfig,
      isOldUser,
      isInvalidCredentials,
      appSdkInitialized,
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
      advancedConfig,
      isOldUser,
      isInvalidCredentials,
      appSdkInitialized,
    ]
  );

  return (
    <CustomFieldExtensionContext.Provider value={installInfo}>
      {children}
    </CustomFieldExtensionContext.Provider>
  );
};
export default CustomFieldExtensionProvider;
