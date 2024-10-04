/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useContext, useEffect, useState } from "react";

/* Import other node modules */
// import ContentstackAppSdk from "@contentstack/app-sdk";
import {
  AsyncLoader,
  Select,
  SkeletonTile,
  FieldLabel,
} from "@contentstack/venus-components";

import ProductDescription from "./ProductDescription";
import WarningMessage from "../../components/WarningMessage";
import localeTexts from "../../common/locale/en-us";
import constants from "../../common/constants";
import { getSelectedIDs } from "../../services";
import rootConfig from "../../root_config";
import { EntrySidebarExtensionContext } from "../../common/contexts/entrySidebarExtensionContext";
import useAppConfig from "../../common/hooks/useAppConfig";

const SidebarWidget: React.FC = function () {
  const {
    entryData,
    contentTypeSchema,
    isInvalidCredentials,
    setIsInvalidCredentials,
    appSdkInitialized,
  } = useContext(EntrySidebarExtensionContext);
  const appConfig = useAppConfig();
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [productList, setProductList] = useState<any>([]);
  const [fieldList, setFieldList] = useState<any>([]);
  const [productDropdown, setProductDropdown] = useState<any>([]);
  const [isProduct, setIsProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedDropdownProduct, setselectedDropdownProduct] =    useState<any>("");
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [selectedField, setSelectedField] = useState<any>("");
  const [isOldUser, setIsOldUser] = useState<any>(false);

  useEffect(() => {
    if (!appSdkInitialized) return;
    const eCommerceProductsField = Object.keys(entryData)?.filter(
      (i: any) =>
        entryData?.[i]?.type
        === `${rootConfig.ecommerceEnv.REACT_APP_NAME}_product`
    );
    const fieldListTemp: any = [];
    eCommerceProductsField?.forEach((field: string) => {
      contentTypeSchema?.forEach((schemaField: any) => {
        if (schemaField?.uid === field)
          fieldListTemp.push({
            label: schemaField?.display_name,
            value: schemaField?.uid,
          });
      });
    });
    setFieldList(fieldListTemp);
  }, [entryData, appConfig, appSdkInitialized]);

  const getCurrentFieldData = async (field: any) => {
    let isMultiConfigEnabled: Boolean =      rootConfig.ecommerceEnv.ENABLE_MULTI_CONFIG;
    if (appConfig) {
      const ISOLDUSER = !Object.keys(appConfig ?? {}).includes(
        "multi_config_keys"
      );

      if (isMultiConfigEnabled) {
        if (isMultiConfigEnabled && ISOLDUSER) {
          isMultiConfigEnabled = false;
          setIsOldUser(true);
        }
      } else {
        setIsOldUser(false);
      }
    }
    if (entryData?.[field?.value]?.data?.length) {
      let sideBarData = entryData?.[field?.value]?.data;
      if (isMultiConfigEnabled === true) {
        sideBarData = sideBarData?.map((fieldDataSet: any) => ({
          ...fieldDataSet,
          cs_metadata: fieldDataSet?.cs_metadata
            ? fieldDataSet?.cs_metadata
            : {
                multiConfigName: "legacy_config",
                isConfigDeleted: false,
              },
        }));
      }
      setProductList(sideBarData);
    } else {
      setProductList([]);
    }
  };

  useEffect(() => {
    if (fieldList?.length) setSelectedField(fieldList[0]);
    getCurrentFieldData(fieldList?.[0]);
  }, [fieldList]);

  useEffect(() => {
    if (isInvalidCredentials.error)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isInvalidCredentials?.data;
  }, [isInvalidCredentials]);

  useEffect(() => {
    if (!appSdkInitialized) return;
    setProductDropdown(
      productList?.map((i: any) => ({
        label: i?.name,
        value: i?.[rootConfig.ecommerceEnv.UNIQUE_KEY.product],
      })) || []
    );
  }, [productList]);

  useEffect(() => {
    if (!appSdkInitialized) return;
    if (!productList?.length) {
      setLoading(false);
      setIsProduct(false);
      return;
    }
    setIsProduct(true);
    if (!isInvalidCredentials.error) {
      setselectedDropdownProduct({
        label: productList?.[0]?.name,
        value: productList?.[0]?.[rootConfig.ecommerceEnv.UNIQUE_KEY.product],
        searchLabel: productList?.[0]?.name,
      });
    }
  }, [productDropdown]);

  useEffect(() => {
    if (!loading && !selectedDropdownProduct) setIsFieldEmpty(true);
  }, [selectedDropdownProduct]);

  const fetchSelectedIdData = async (data: any, isOldUserLocal: boolean) => {
    const productID = typeof data === "object" ? data : [data];
    const product = await getSelectedIDs(
      appConfig,
      "product",
      productID,
      isOldUserLocal
    ); 
    if (product?.error) {
      setIsInvalidCredentials(product);
    } else {
      return product?.data?.items?.[0];
    }

    return null;
  };
  useEffect(() => {
    const setInitialProductDropdown = async () => {
      let isMultiConfigEnabled = rootConfig.ecommerceEnv.ENABLE_MULTI_CONFIG;
      let isolduser = false;
      if (appConfig) {
        const ISOLDUSER = !Object.keys(appConfig ?? {}).includes(
          "multi_config_keys"
        );

        if (isMultiConfigEnabled) {
          if (ISOLDUSER) {
            isMultiConfigEnabled = false;
            isolduser = true;
          }
        } else {
          // eslint-disable-next-line
          if (ISOLDUSER) {
            isMultiConfigEnabled = false;
            isolduser = true;
          } else {
            isolduser = false;
          }
        }
      }
      let ids;
      if (!isMultiConfigEnabled) {
        ids = selectedDropdownProduct?.value;
      } else {
        const product = productList.find(
          (p: any) => p?.id === selectedDropdownProduct?.value
        );
        const formattedData: any = rootConfig.mapProductIdsByMultiConfig(
          [product],
          "product"
        );
        ids = formattedData;
      }
      const selectProduct = await fetchSelectedIdData(ids, isolduser); 

      if (selectProduct) {
        setSelectedProduct(selectProduct);
      }
    };

    if (selectedDropdownProduct) {
      setInitialProductDropdown();
      setLoading(false);
      setProductLoading(true);
    }
  }, [selectedDropdownProduct]);

  useEffect(() => {
    if (selectedProduct !== "") setProductLoading(false);
  }, [selectedProduct]);

  const handleDropDownChange = useCallback(
    async (event: any) => {
      getCurrentFieldData(event);
      setSelectedField(event);
    },
    [selectedField]
  );

  const handleProductChange = useCallback(
    async (event: any) => {
      setselectedDropdownProduct(event);
    },
    [selectedDropdownProduct]
  );

  const renderProduct = () => {
    if ((productLoading || !selectedProduct) && isProduct)
      return <AsyncLoader color={constants.loaderColor} />;
    if (!isProduct)
      return (
        <div className="noProducts">{localeTexts.sidebarWidget.noProducts}</div>
      );
    return <ProductDescription product={selectedProduct} config={appConfig} />;
  };

  const getNoOptionsMessage = useCallback(
    () => localeTexts.sidebarWidget.select.noOptions,
    []
  );

  const renderSidebarContent = () => {
    if (isInvalidCredentials?.error)
      return <WarningMessage content={isInvalidCredentials?.data} />;
    if (loading)
      return (
        <div className="sidebar-center">
          <SkeletonTile
            numberOfTiles={1}
            tileBottomSpace={20}
            tileHeight={20}
            tileRadius={10}
            tileTopSpace={20}
            tileWidth={200}
            tileleftSpace={0}
          />
          <SkeletonTile
            numberOfTiles={3}
            tileBottomSpace={20}
            tileHeight={10}
            tileRadius={10}
            tileTopSpace={0}
            tileWidth={200}
            tileleftSpace={0}
          />
        </div>
      );
    if (isFieldEmpty)
      return (
        <div className="noProducts">{localeTexts.sidebarWidget.noProducts}</div>
      );
    return (
      <>
        {fieldList?.length > 1 ? (
          <>
            <FieldLabel htmlFor="fieldSelect">
              {localeTexts.sidebarWidget.dropdownLabels.products}
            </FieldLabel>
            <Select
              options={fieldList}
              onChange={handleDropDownChange}
              value={selectedField}
              updateOption={handleDropDownChange}
              placeholder={localeTexts.sidebarWidget.select.field}
              width="250px"
            />
          </>
        ) : (
          ""
        )}

        {productDropdown?.length > 1 ? (
          <>
            <FieldLabel htmlFor="productSelect">
              {localeTexts.sidebarWidget.dropdownLabels.products}
            </FieldLabel>
            <Select
              options={productDropdown}
              onChange={handleProductChange}
              updateOption={handleProductChange}
              value={selectedDropdownProduct}
              placeholder={localeTexts.sidebarWidget.select.products}
              noOptionsMessage={getNoOptionsMessage}
              width="250px"
              isSearchable
            />
          </>
        ) : (
          ""
        )}
        {renderProduct()}
      </>
    );
  };
  return <div className="sidebar">{renderSidebarContent()}</div>;
};

export default SidebarWidget;
