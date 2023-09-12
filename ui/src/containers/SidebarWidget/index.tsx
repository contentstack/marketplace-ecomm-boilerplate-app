import React, { useCallback, useEffect, useState } from "react";

/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import {
  AsyncLoader,
  Select,
  SkeletonTile,
  FieldLabel,
} from "@contentstack/venus-components";

import ProductDescription from "./ProductDescription";
import WarningMessage from "../../components/WarningMessage";
import { TypeSDKData, TypeWarningtext } from "../../common/types";
import localeTexts from "../../common/locale/en-us";
import constants from "../../common/constants";
import { getSelectedIDs } from "../../services";
import rootConfig from "../../root_config";

const SidebarWidget: React.FC = function () {
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<TypeWarningtext>({
      error: false,
      data: localeTexts?.warnings?.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    });
  const [entryData, setEntryData] = useState<any>({});
  const [contentTypeSchema, setContentTypeSchema] = useState<any>({});
  const [productList, setProductList] = useState<any>([]);
  const [fieldList, setFieldList] = useState<any>([]);
  const [productDropdown, setProductDropdown] = useState<any>([]);
  const [isProduct, setIsProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedDropdownProduct, setselectedDropdownProduct] =
    useState<any>("");
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [selectedField, setSelectedField] = useState<any>("");
  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const config = await appSdk?.getConfig();
        if (!config?.is_custom_baseUrl) delete config?.api_route;
        const contentTypeUid =
          appSdk?.location?.SidebarWidget?.entry?.content_type?.uid;
        const data = appSdk?.location?.SidebarWidget?.entry?.getData();
        const contentTypeDetails = await appSdk?.stack?.getContentType(
          contentTypeUid
        );
        setEntryData(data);
        setContentTypeSchema(contentTypeDetails?.content_type?.schema);
        setState({
          config,
          location: appSdk?.location,
          appSdkInitialized: true,
        });
      })
      .catch((error) => {
        console.error(localeTexts.sidebarWidget.appSdkErr, error);
      });
  }, []);
  useEffect(() => {
    if (!state.appSdkInitialized) return;
    setIsInvalidCredentials({
      error: Object.values(state?.config || {}).includes(""),
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    });
  }, [state.config]);

  const fetchSelectedIdData = async (data: any) => {
    const product = await getSelectedIDs(state?.config, "product", [data]);
    if (product?.error) {
      setIsInvalidCredentials(product);
    } else return product?.data?.items?.[0];

    return null;
  };

  const getCurrentFieldData = async (field: any) => {
    if (!state.appSdkInitialized) return;
    if (entryData?.[field?.value]?.data?.length) {
      setProductList(entryData?.[field?.value]?.data);
    } else {
      setProductList([]);
    }
  };

  useEffect(() => {
    if (isInvalidCredentials.error)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isInvalidCredentials?.data;
  }, [isInvalidCredentials]);

  useEffect(() => {
    if (!state.appSdkInitialized) return;
    const sapProductsField = Object.keys(entryData)?.filter(
      (i: any) =>
        entryData?.[i]?.type ===
        `${rootConfig.ecommerceEnv.REACT_APP_NAME}_product`
    );
    const fieldListTemp: any = [];
    sapProductsField?.forEach((field: string) => {
      contentTypeSchema?.forEach((schemaField: any) => {
        if (schemaField?.uid === field)
          fieldListTemp.push({
            label: schemaField?.display_name,
            value: schemaField?.uid,
          });
      });
    });
    setFieldList(fieldListTemp);
  }, [entryData, state.appSdkInitialized]);
  useEffect(() => {
    if (fieldList?.length) setSelectedField(fieldList[0]);
    getCurrentFieldData(fieldList?.[0]);
  }, [fieldList]);

  useEffect(() => {
    if (!state.appSdkInitialized) return;
    setProductDropdown(
      productList?.map((i: any) => ({
        label: i?.name,
        value: i?.[rootConfig.ecommerceEnv.UNIQUE_KEY.product],
      })) || []
    );
  }, [productList]);

  useEffect(() => {
    if (!state.appSdkInitialized) return;
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

  useEffect(() => {
    const setInitialProductDropdown = async () => {
      const selectProduct = await fetchSelectedIdData(
        selectedDropdownProduct?.value
      );
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
    return (
      <ProductDescription product={selectedProduct} config={state?.config} />
    );
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
