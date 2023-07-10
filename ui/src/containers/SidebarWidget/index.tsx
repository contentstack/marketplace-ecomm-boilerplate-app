import React, { useEffect, useState } from "react";

/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import {
  AsyncLoader,
  Dropdown,
  Field,
  FieldLabel,
  SkeletonTile,
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
  const [fieldList, setFieldList] = useState<any>([]);
  const [productDropdown, setProductDropdown] = useState<any>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>([]);
  const [entryData, setEntryData] = useState<any>([]);
  const [selectedDropdownProduct, setselectedDropdownProduct] =
    useState<any>("");
  const [selectedField, setSelectedField] = useState("");

  const setInvalidConfig = () => {
    setIsInvalidCredentials({
      error: true,
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    });
  };
  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const config = await appSdk?.getConfig();
        setEntryData(appSdk?.location?.SidebarWidget?.entry?.getData());
        setState({
          config,
          location: appSdk?.location,
          appSdkInitialized: true,
        });
      })
      .catch((error) => {
        console.error("appSdk initialization error", error);
        setInvalidConfig();
      });
  }, []);

  const fetchSelectedIdData = async (data: any) => {
    const product = await getSelectedIDs(state?.config, "product", [data]);
    if (product?.error) {
      setIsInvalidCredentials(product);
    } else return product?.data?.items?.[0];

    return null;
  };

  const getCurrentFieldData = async (field: any) => {
    if (!state?.appSdkInitialized) return;
    const prodList = entryData?.[field?.value]?.data?.length ?
      entryData?.[field?.value]?.data
      : [];
    setLoading(false);
    if (prodList?.length) {
      setselectedDropdownProduct({
        label: prodList[0]?.name,
        value: prodList[0]?.id,
      });
      const prods =
        prodList?.map((i: any) => ({
          label: i?.name,
          value: i?.id,
        })) || [];
      prods[0] = { ...prods[0], default: true };
      setProductDropdown(prods);
    }
  };

  useEffect(() => {
    if (!state?.appSdkInitialized) return;
    const tempFieldList: any[] =
      (
        Object.keys(entryData)?.filter(
          (i: any) => entryData?.[i]?.type === "sfcc_product"
        ) || []
      )?.map((i: any) => ({ label: i?.replace(/_/g, " "), value: i })) || [];

    if (!tempFieldList?.length) {
      setLoading(false);
      return;
    }

    tempFieldList[0] = { ...tempFieldList[0], default: true };
    setFieldList(tempFieldList);
    setSelectedField(tempFieldList[0]?.value);
    getCurrentFieldData(tempFieldList[0]);
  }, [entryData, state?.appSdkInitialized]);

  useEffect(() => {
    const setInitialProductDropdown = async () => {
      const selectProduct = (
        await fetchSelectedIdData(selectedDropdownProduct?.value)
      )?.[0];
      if (selectProduct) {
        setSelectedProduct(selectProduct);
        if (selectProduct !== "") setProductLoading(false);
      }
    };
    if (selectedDropdownProduct) {
      setInitialProductDropdown();
      setLoading(false);
      setProductLoading(true);
    }
  }, [selectedDropdownProduct]);

  const handleDropDownChange = async (event: any) => {
    if (selectedField !== event?.value) {
      setSelectedField(event?.value);
      setselectedDropdownProduct(null);
      setProductDropdown([]);
      getCurrentFieldData(event);
    }
  };

  const handleProductChange = async (event: any) => {
    if (selectedDropdownProduct?.value !== event?.value)
      setselectedDropdownProduct(event);
  };

  const renderProduct = () =>
    productDropdown?.length >= 1 ? (
      <ProductDescription product={selectedProduct} />
    ) : (
      <div className="no__inner_products">
        {localeTexts.sidebarWidget.noProducts}
      </div>
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
    if (!fieldList?.length) {
      return (
        <div className="noProducts">{localeTexts.sidebarWidget.noProducts}</div>
      );
    }

    return (
      <>
        {fieldList?.length >= 1 ? (
          <Field>
            <FieldLabel htmlFor="field_list">
              {" "}
              {localeTexts.sidebarWidget.dropdownLabels.fields}
            </FieldLabel>
            <br />
            <Dropdown
              withSearch
              maxWidth={250}
              className="sidebar_dropdowns"
              type="select"
              withArrow
              dropDownPosition="bottom"
              closeAfterSelect
              highlightActive
              list={fieldList}
              onChange={handleDropDownChange}
            />
          </Field>
        ) : (
          ""
        )}

        {productDropdown?.length >= 1 ? (
          <Field>
            <FieldLabel htmlFor="field_list">
              {" "}
              {localeTexts.sidebarWidget.dropdownLabels.products}
            </FieldLabel>
            <br />
            <Dropdown
              withSearch
              maxWidth={250}
              className="sidebar_dropdowns"
              type="select"
              withArrow
              dropDownPosition="bottom"
              closeAfterSelect
              highlightActive
              list={productDropdown}
              onChange={handleProductChange}
            />
          </Field>
        ) : (
          ""
        )}
        {productLoading ? (
          <AsyncLoader color={constants.loaderColor} />
        ) : (
          renderProduct()
        )}
      </>
    );
  };
  return <div className="sidebar">{renderSidebarContent()}</div>;
};

export default SidebarWidget;
