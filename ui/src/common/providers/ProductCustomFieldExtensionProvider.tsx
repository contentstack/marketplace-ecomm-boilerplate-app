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
import { filter, getSelectedIDs, getProductById } from "../../services";
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
  const uniqueKey: any = rootConfig.ecommerceEnv.UNIQUE_KEY;
  const [stackApiKey, setStackApiKey] = useState<any>("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { isInvalidCredentials, setIsInvalidCredentials } = useError();
  const [oldData, setOldData] = useState<any>([]);
  const config = useAppConfig();

  let cs_metadata: any = {
    multi_config_name: "",
    isconfigdeleted: "",
  };
  const getFieldConfigValue = (
    currentLocale: any,
    fieldConfigData: any,
    config: any
  ) => {
    const findMatchingKeys = (keys: any) =>
      keys?.filter((key: any) => config?.multi_config_keys?.[key]);

    if (fieldConfigData?.locale?.[currentLocale]?.config_label?.length) {
      const localeConfigLabels =
        fieldConfigData?.locale?.[currentLocale]?.config_label;
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

  const hasCsMetadataKeys = (obj: any) => {
    return Object.keys(cs_metadata).every((key) => obj.hasOwnProperty(key));
  };

  const initialLoad = async () => {
    if (location) {
      const { api_key } = appSdk?.stack?._data ?? {};
      setStackApiKey(api_key);
      window.iframeRef = null;
      window.postRobot = appSdk?.postRobot;
      location?.frame?.enableAutoResizing();
      const fieldData = await location?.field?.getData();
      let transformedData: any = {};
      const retrievedAdvancedFieldConfigs = await location?.fieldConfig;
      const currentLocale = await location?.entry?.locale;
      console.info("currentLocale", currentLocale);
      const data = getFieldConfigValue(
        currentLocale,
        retrievedAdvancedFieldConfigs,
        config
      );

      const hasCsMetadataInfieldData = fieldData?.data?.some((obj: any) =>
        hasCsMetadataKeys(obj)
      );
      if (hasCsMetadataInfieldData) {
      } else {
        fieldData?.data?.forEach(
          (product: { cs_metadata: { multi_config_name: any } }) => {
            const configName = product?.cs_metadata?.multi_config_name ?? "";
            if (!transformedData[configName]) {
              transformedData[configName] = [];
            }
            transformedData[configName].push(product);
          }
        );
      }
      setOldData(fieldData?.data);
      if (fieldData?.data?.length) {
        if (
          rootConfig.ecomCustomFieldCategoryData &&
          rootConfig.ecomCustomFieldCategoryData === true &&
          type === "category"
        ) {
          setSelectedIds(
            fieldData?.data?.map((i: any) => ({
              [uniqueKey]: i?.[uniqueKey],
              //   catalogId: i?.catalogId,
              //   catalogVersionId: i?.catalogVersionId,
            }))
          );
        } else {
          // console.info("filed data",fieldData?.data)

          // console.info("newUpda tedFieldData",newUpdatedFieldData,"type",type)
          // Loop over the array using reduce to accumulate data
          transformedData = fieldData?.data?.reduce(
            (
              result: { [x: string]: { id: any[] } },
              product: { id: any; cs_metadata?: any }
            ) => {
              const { id, cs_metadata } = product;

              // Check if cs_metadata is defined and has multi_config_name
              if (
                cs_metadata &&
                cs_metadata.multi_config_name !== undefined &&
                cs_metadata.multi_config_name !== null
              ) {
                const { multi_config_name } = cs_metadata;

                // Check if multi_config_name already exists in result, if not initialize it
                if (!result[multi_config_name]) {
                  result[multi_config_name] = { id: [] };
                }

                // Push the id into the array under multi_config_name
                result[multi_config_name].id.push(id);
              } else {
                // Handle the case where cs_metadata or multi_config_name is undefined or null
                console.warn(
                  `cs_metadata or multi_config_name is undefined or null for product id: ${id}`
                );
                // Optionally, you could skip processing or set a default value
                // Example: result['default'] = { id: [] };
              }

              return result;
            },
            {}
          );

          // console.info("transformedData at lastttttt",transformedData)
          // console.info("fieldData?.data",fieldData?.data)
          // const returnIDS=fieldData?.data?.map((i:any)=>{
          //     // console.info("unique",i)
          //     return i?.id
          // })
          // console.info("returnIDS",returnIDS)
          setSelectedIds(transformedData);
        }
      }
    }
  };

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
      setLoading(true);
      await location?.field?.setData(data);
      // setProductCustomField(data);
      setLoading(false);
    },
    [location, setLoading]
  );

  const fetchData = async (selectedIdsArray: any) => {
    console.info("selectedIdsArray fetchData", selectedIdsArray);
    if (Object.keys(selectedIdsArray)?.length && !isEmpty(appConfig)) {
      try {
        // Create an array to hold all the API call promises
        const apiCalls: any = [];

        // Loop through each key in selectedIdsArray to fetch product data
        for (const key of Object.keys(selectedIdsArray)) {
          const ids = selectedIdsArray[key].id;

          // Retrieve the configuration for the current key
          const configData = config?.multi_config_keys[key];

          // Ensure configData exists
          if (configData) {
            const { configField1: apiUrl, configField2: apiKey } = configData;

            // Prepare the API call
            ids?.forEach((id: any) => {
              const apiCall = getProductById(apiUrl, key, apiKey, id);
              apiCalls.push({ key, id, apiCall });
            });
          } else {
            console.error(`Configuration not found for key: ${key}`);
          }
        }

        // Execute all API calls in parallel
        const results = await Promise.all(
          apiCalls.map((call: { apiCall: any }) => call.apiCall)
        );
        console.info("results", results);

        // Process the results
        const aggregatedResults: any = {};
        results.forEach((res, index) => {
          const { key, id } = apiCalls[index];
          console.info("id", id);
          if (!aggregatedResults[key]) {
            aggregatedResults[key] = { id: [], data: [] };
          }
          if (res?.error) {
            // If API call resulted in an error, mark as deleted in configuration
            const oldItem = oldData.find((item: any) => item.id === id) || {
              id,
              masterData: {},
            };
            aggregatedResults[key].id.push(id);
            aggregatedResults[key].data.push({
              ...oldItem,
              cs_metadata: {
                multi_config_name: key,
                isconfigdeleted: true,
              },
            });
          } else {
            // Process successful data retrieval
            aggregatedResults[key].id.push(id);
            res.data.cs_metadata = {
              multi_config_name: key,
              isconfigdeleted: false,
            };
            aggregatedResults[key].data.push(res.data);
          }
        });

        // Combine all data arrays from aggregated results
        let combinedIds: any[] = [];
        let combinedData: any[] = [];
        Object.keys(aggregatedResults).forEach((key) => {
          combinedIds = combinedIds.concat(aggregatedResults[key].id);
          combinedData = combinedData.concat(aggregatedResults[key].data);
        });

        // Ensure all IDs from oldData and selectedIdsArray are included in aggregatedResults
        const allIds = Array.from(
          new Set([...oldData.map((item: any) => item.id), ...combinedIds])
        );
        const finalData = allIds.map((id) => {
          const foundInAggregated = combinedData.find(
            (item: any) => item.id === id
          );
          if (foundInAggregated) {
            return foundInAggregated;
          } else {
            const oldItem = oldData.find((item: any) => item.id === id) || {
              id,
              masterData: {},
            };
            return {
              ...oldItem,
              cs_metadata: {
                multi_config_name: "",
                isconfigdeleted: true,
              },
            };
          }
        });

        // Transform data to match the expected format and preserve order
        const transformedData = finalData.map((item) => ({
          id: item.id,
          masterData: item.masterData?.current || item.masterData,
          cs_metadata: item.cs_metadata,
        }));

        // Set selected items with combined results
        setSelectedItems(
          rootConfig.arrangeList(
            allIds, // Use all IDs to maintain order
            transformedData,
            uniqueKey
          )
        );
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    }
  };

  const removeIdFromField = (removeId: any, multiConfigName: any) => {
    let updatedRootConfig = { ...selectedIds };

    // if (
    //   rootConfig.ecomCustomFieldCategoryData &&
    //   rootConfig.ecomCustomFieldCategoryData === true
    // ) {
    //   rootConfig.removeItemsFromCustomField(
    //     removeId,
    //     selectedIds,
    //     setSelectedIds,
    //     type,
    //     uniqueKey
    //   );
    // } else {
    const config = selectedIds?.[multiConfigName];
    const updatedIds = config.id.filter((id: any) => id !== removeId);
    const updatedOldData = oldData?.filter(
      (data: any) => data?.id !== removeId
    );
    setOldData(updatedOldData);
    console.info("updatedOldData", updatedOldData);

    // Create a new updated object for the specific multiConfigName
    const updatedConfig = {
      ...config,
      id: updatedIds,
    };

    // Update the new rootConfig with the updated config
    updatedRootConfig = {
      ...updatedRootConfig,
      [multiConfigName]: updatedConfig,
    };
    console.info("updatedRootConfig", updatedRootConfig);
    setSelectedIds(updatedRootConfig);
    // }
    // console.info("")
    // setSelectedIds(
    //   selectedIds?.filter((data: any) => Number(data) !== removeId) // remove Number typecast
    // );
    // }
  };

  useEffect(() => {
    console.info("ids", selectedIds);
    if (Object.keys(selectedIds).length) fetchData(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    // console.info("selectedItems useEffect",selectedItems)
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
