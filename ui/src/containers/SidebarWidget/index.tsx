import React, { useEffect, useState } from "react";

/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import {
  AsyncLoader,
  Select,
  SkeletonTile,
} from "@contentstack/venus-components";

import ProductDescription from "./ProductDescription";
import WarningMessage from "../../components/WarningMessage";
import { TypeSDKData, TypeWarningtext } from "../../common/types";
import { getSelectedIDs } from "../../services";
import localeTexts from "../../common/locale/en-us";
import constants from "../../common/constants";
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
      data: localeTexts.warnings.invalidCredentials.replace("$", rootConfig.ecommerceEnv.APP_ENG_NAME),
    });
  const [entryData, setEntryData] = useState<any>({});
  const [productList, setProductList] = useState<any>([]);
  const [fieldList, setFieldList] = useState<any>([]);
  const [productDropdown, setProductDropdown] = useState<any>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedDropdownProduct, setselectedDropdownProduct] =
    useState<any>("");
  const [selectedField, setSelectedField] = useState("");

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {

        const config = await appSdk?.getConfig();
        const data = appSdk?.location?.SidebarWidget?.entry?.getData();
        setEntryData(data);
        setState({
          config,
          location: appSdk?.location,
          appSdkInitialized: true,
        });
      })
      .catch((error) => {
        console.error("appSdk initialization error", error);
      });
  }, []);
  
  useEffect(() => {
    if (!state.appSdkInitialized) return;
    setIsInvalidCredentials({
      error: Object.values(state.config || {}).includes(""),
      data: localeTexts.warnings.invalidCredentials.replace("$", rootConfig.ecommerceEnv.APP_ENG_NAME),
    });
  }, [state.config]);

  useEffect(() => {
    if (!state.appSdkInitialized) return;
    setFieldList(
      (
        Object.keys(entryData)?.filter(
          (i: any) => entryData[i]?.type === `${rootConfig.ecommerceEnv.REACT_APP_NAME}_product`
        ) || []
      )?.map((i: any) => ({ label: i.replace(/_/g, " "), value: i })) || []
    );
  }, [entryData, state.appSdkInitialized]);


  useEffect(() => {
    if (fieldList?.length) setSelectedField(fieldList[0]);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getCurrentFieldData(fieldList[0]);
  }, [fieldList]);

  useEffect(() => {
    if (!state.appSdkInitialized) return;
    setProductDropdown(
      productList?.map((i: any) => ({ label: i?.name, value: i?.id })) || []
    );
  }, [productList]);

  useEffect(() => {
    if (!productList?.length) {
      setLoading(false);
      return;
    }
    if (!isInvalidCredentials.error) {
      setselectedDropdownProduct({
        label: productList[0]?.name,
        value: productList[0]?.id,
      });
    }
  }, [productDropdown]);


  useEffect(() => {
    const setInitialProductDropdown = async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const selectProduct = await fetchSelectedIdData(
        selectedDropdownProduct.value
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

  const getCurrentFieldData = async (field: any) => {
    if (!state.appSdkInitialized) return;
    if (entryData[field.value]?.data?.length) {
      setProductList(entryData[field.value].data);
    } else {
      setProductList([]);
    }
  };

    const fetchSelectedIdData = async (id: any) => {
    const product = await getSelectedIDs(state?.config, "product", [id]);
    if (product?.error) {
      setIsInvalidCredentials(product);
    } else return product?.data?.items[0];

    return null;
  };


  const handleDropDownChange = async (event: any) => {
    getCurrentFieldData(event);
    setSelectedField(event);
  };

  const handleProductChange = async (event: any) => {
    setselectedDropdownProduct(event);
  };

  const renderSidebarContent = () => {
    if (isInvalidCredentials.error)
      return <WarningMessage content={isInvalidCredentials.data} />;
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
    if (!productDropdown?.length)
      return (
        <div className="noProducts">{localeTexts.sidebarWidget.noProducts}</div>
      );
    return (
      <>
        {fieldList?.length > 1 ? (
          <Select
            options={fieldList}
            onChange={handleDropDownChange}
            value={selectedField}
            updateOption={handleDropDownChange}
            placeholder={localeTexts.sidebarWidget.select.field}
            width="250px"
          />
        ) : (
          ""
        )}

        {productDropdown?.length > 1 ? (
          <Select
            options={productDropdown}
            onChange={handleProductChange}
            updateOption={handleProductChange}
            value={selectedDropdownProduct}
            placeholder={localeTexts.sidebarWidget.select.products}
            noOptionsMessage={() => localeTexts.sidebarWidget.select.noOptions}
            width="250px"
          />
        ) : (
          ""
        )}

        {productLoading ? (
          <AsyncLoader color={constants.loaderColor} />
        ) : (
          <ProductDescription product={selectedProduct} config={state.config} />
        )}
      </>
    );
  };
  return <div className="sidebar">{renderSidebarContent()}</div>;
};

export default SidebarWidget;
