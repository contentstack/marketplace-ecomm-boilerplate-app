import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  ButtonGroup,
  Icon,
  InfiniteScrollTable,
  Dropdown,
} from "@contentstack/venus-components";
import {
  isEmpty,
  EmptyObjForSearchCase,
  getItemStatusMap,
} from "../../common/utils";
import localeTexts from "../../common/locale/en-us";
import { TypeWarningtext } from "../../common/types";
import { getProductandCategory, search } from "../../services/index";
import "./styles.scss";
import WarningMessage from "../../components/WarningMessage";
import rootConfig from "../../root_config/index";
import FilterComponent from "../../root_config/selector/FilterComponent";

const SelectorPage: React.FC = function () {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any>({});
  const [selectedData, setSelectedData] = useState<any>({});
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [totalCounts, setTotalCounts] = useState(null);
  const [itemStatus, setItemStatus] = useState({});
  const [config, setConfig] = useState<any>({});
  const [checkedIds, setCheckedIds] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState<any>(
    config?.type === "category" ? [] : ["id"]
  );
  const [metaState, setMetaState] = useState<any>({});
  const [isInvalidCredentials, setIsInvalidCredentials] =    useState<TypeWarningtext>({
      error: false,
      data: localeTexts.warnings.invalidCredentials,
    });
  const [multiConfigDropDown, setMultiConfigDropDown] = useState<any>([]);
  const [selectedMultiConfigValue, setSelectedMultiConfigValue] =    useState<any>();
  const [oldUser, setOldUser] = useState<any>(false);

  const tableRef: any = useRef(null);

  const getSelectedData = async (_type: any, data = []) => {
    if (data?.length) {
      data?.forEach((id: any) => {
        selectedRows[id] = true;
      });
    }
    setSelectedRows({ ...selectedRows });
    setSelectedIds(data);
    return selectedRows;
  };

  const handleMessage = (event: any) => {
    const { data } = event;
    if (data) {
      if (data?.message === "init") {
        getSelectedData(data?.type, data?.selectedItems);
        setConfig({ ...data?.config, type: data?.type });
        setOldUser(data?.isOldUser);
        setSelectedIds(data?.selectedIds);
        if (data?.isOldUser === false && data?.config) {
          if (data?.advancedConfig?.length) {
            const multiConfigKeys: any = [];
            data?.advancedConfig?.forEach((keys: any) => {
              const obj = {
                label: keys,
                value: keys,
                default: keys === data?.advancedConfig?.[0],
              };
              multiConfigKeys.push(obj);
              setMultiConfigDropDown([...multiConfigKeys]);
              if (multiConfigKeys.length) {
                multiConfigKeys[0].default = true;
                setSelectedMultiConfigValue(multiConfigKeys[0]);
              }
            });
          } else if (data?.config?.multi_config_keys) {
            const multiConfigKeys: any = [];
            Object.keys(data?.config?.multi_config_keys)?.forEach(
              (keys: any) => {
                const obj = {
                  label: keys,
                  value: keys,
                  default: true,
                };
                multiConfigKeys.push(obj);
                const defaultObject = multiConfigKeys?.filter(
                  (objkey: any) =>
                    objkey?.value === data?.config?.default_multi_config_key
                );
                if (defaultObject?.length) {
                  setMultiConfigDropDown(defaultObject);
                  setSelectedMultiConfigValue(defaultObject[0]);
                }
              }
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    const { opener: windowOpener } = window;
    if (windowOpener) {
      window.addEventListener("message", handleMessage, false);
      windowOpener.postMessage("openedReady", window.location.origin);
      window.addEventListener("beforeunload", () => {
        windowOpener.postMessage({ message: "close" }, window.location.origin);
      });
    }
  }, []);

  const fetchInitialData = async (meta: any) => {
    try {
      if (!isEmpty(config)) {
        setItemStatus({
          ...getItemStatusMap({}, "loading", meta?.startIndex, meta?.stopIndex),
        });
        const response = await getProductandCategory(
          config,
          config?.type,
          meta?.skip,
          meta?.limit,
          oldUser,
          selectedMultiConfigValue
        );
        if (!response?.error) {
          setList(response?.data?.items);
          if (config?.type === "category")
            setTotalCounts(response?.data?.items?.length);
          else setTotalCounts(response?.data?.meta?.total);
          const responseDataLength = response?.data?.items?.length;
          setItemStatus({
            ...getItemStatusMap(
              { ...itemStatus },
              "loaded",
              0,
              responseDataLength
            ),
          });
          setLoading(false);
        } else {
          setIsInvalidCredentials(response);
        }
      }
    } catch (error) {
      console.error(localeTexts.selectorPage.initialErr, error);
    }
  };

  const fetchData = async (meta: any) => {
    setMetaState(meta);
    try {
      if (meta?.searchText && !isEmpty(config)) {
        setSearchText(meta?.searchText);
        const response = await search(
          config,
          meta?.searchText,
          meta?.skip,
          meta?.limit
        );
        if (!response?.error) {
          setList(response?.data?.items);
          setLoading(false);
          setTotalCounts(response?.data?.meta?.total);
          const responseDataLength = response?.data?.items?.length;
          setItemStatus({
            ...getItemStatusMap({}, "loaded", 0, responseDataLength),
          });
        } else {
          setIsInvalidCredentials(response);
        }
      } else {
        setLoading(true);
        setSearchText("");
        fetchInitialData(meta);
      }
    } catch (err) {
      console.error(localeTexts.selectorPage.tableFetchError, err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData({ searchText, skip: 0, limit: 30 });
  }, [config]);

  const getSelectedRow = (singleSelectedRowIds: any, selected: any) => {
    const selectedObj: any = [];
    singleSelectedRowIds?.forEach((assetUid: any) => {
      selectedObj[assetUid] = true;
    });
    if (oldUser === false) {
      const cpyOfSelectedIDS = { ...selectedIds };
      const multiConfigFormatIDS =        rootConfig.returnFormattedProductIDSForMultiConfig(selected);
      const updatedSelectedIDS = {
        ...cpyOfSelectedIDS,
        ...multiConfigFormatIDS,
      };
      setSelectedIds(updatedSelectedIDS);
    }

    setSelectedRows({ ...selectedObj });
    setSelectedData(selected);
    setCheckedIds(singleSelectedRowIds);
  };

  const returnSelectedData = () => {
    const dataArr = JSON.parse(JSON.stringify(selectedData));
    const dataIds = JSON.parse(JSON.stringify(selectedIds));

    if (window?.opener) {
      window.opener.postMessage(
        { message: "add", dataArr, dataIds },
        window.location.origin
      );
      window.close();
    }
  };

  const onToggleColumnSelector = (event: any) => {
    let hiddenColumnsTemp: any = [];
    Object.keys(event)?.forEach((key: string) => {
      if (!event[key] && !hiddenColumnsTemp.includes(key))
        hiddenColumnsTemp.push(key);
      if (event[key] && hiddenColumnsTemp.includes(key)) {
        const index = hiddenColumnsTemp.indexOf(key);
        hiddenColumnsTemp = hiddenColumnsTemp.splice(index, 1);
      }
    });
    setHiddenColumns(hiddenColumnsTemp);
  };
  useEffect(() => {
    if (isEmpty(config)) return;
    const fetchShopifyData = async () => {
      fetchData({ searchText, skip: 0, limit: 30 });
    };
    if (selectedMultiConfigValue?.value) {
      fetchShopifyData();
    }
  }, [selectedMultiConfigValue]);

  const updateList = (filteredList: any) => {
    console.info("filteredList", filteredList);
  };

  const handleMultiConfigData = (event: any) => {
    if (event !== selectedMultiConfigValue) {
      setList([]);
    }
    setIsInvalidCredentials("" as any);
    setSelectedMultiConfigValue(event);
  };

  const renderSelectorPage = () => {
    if (isInvalidCredentials?.error)
      return (
        <div className="invalid-cred-selector">
          <WarningMessage content={isInvalidCredentials?.data} />
        </div>
      );
    return (
      <>
        <FilterComponent
          config={config}
          meta={metaState}
          updateList={updateList}
        />
        {oldUser === false ? (
          <div className="filterDropdown multistoredropown">
            <Dropdown
              type="select"
              dropDownPosition="bottom"
              list={multiConfigDropDown}
              onChange={handleMultiConfigData}
              withArrow
              withSearch
              closeAfterSelect
              highlightActive
            />
          </div>
        ) : (
          ""
        )}

        <InfiniteScrollTable
          uniqueKey={rootConfig.ecommerceEnv.UNIQUE_KEY[config?.type]}
          hiddenColumns={hiddenColumns}
          onToggleColumnSelector={onToggleColumnSelector}
          isRowSelect
          fullRowSelect
          viewSelector
          canRefresh
          canSearch={config?.type !== "category"}
          v2Features={{
            pagination: true,
          }}
          data={
            list?.length
              ? list.map((listData) => ({
                  ...listData,
                  [rootConfig.ecommerceEnv.UNIQUE_KEY[config?.type]]: `${
                    listData[rootConfig.ecommerceEnv.UNIQUE_KEY[config?.type]]
                  }`,
                }))
              : []
          }
          columns={
            config?.type === "category"
              ? rootConfig.categorySelectorColumns(config)
              : rootConfig.getProductSelectorColumns(config)
          }
          loading={loading}
          initialSelectedRowIds={selectedRows}
          getSelectedRow={getSelectedRow}
          itemStatusMap={itemStatus}
          fetchTableData={fetchData}
          totalCounts={totalCounts}
          // loadMoreItems={loadMoreItems}
          fixedlistRef={tableRef}
          minBatchSizeToFetch={30}
          name={
            config.type === "category"
              ? {
                  singular: localeTexts.selectorPage.searchPlaceholder.category,
                  plural: localeTexts.selectorPage.searchPlaceholder.categories,
                }
              : {
                  singular: localeTexts.selectorPage.searchPlaceholder.product,
                  plural: localeTexts.selectorPage.searchPlaceholder.products,
                }
          }
          searchPlaceholder={`${
            localeTexts.selectorPage.searchPlaceholder.caption
          } ${
            config?.type === "category"
              ? localeTexts.selectorPage.searchPlaceholder.categories
              : localeTexts.selectorPage.searchPlaceholder.products
          }`}
          emptyObj={EmptyObjForSearchCase}
          onHoverActionList={[
            {
              label: (
                <div className="Table_hoverActions">
                  <Icon
                    icon="NewTab"
                    data={localeTexts.selectorPage.hoverActions.replace(
                      "$",
                      rootConfig.ecommerceEnv.APP_ENG_NAME
                    )}
                  />
                </div>
              ),
              action: (_e: any, data: any) => {
                window.open(
                  rootConfig.getOpenerLink(data?.id, config, config?.type),
                  "_blank"
                );
              },
            },
          ]}
        />
        <ButtonGroup className="buttonGroup">
          <Button onClick={window.close} buttonType="light">
            {localeTexts.buttonLabels.close}
          </Button>
          <Button onClick={returnSelectedData} buttonType="primary">
            <Icon icon="AddPlus" />
            {localeTexts.selectorPage.add.replace(
              "#",
              oldUser === false
                ? checkedIds?.length?.toString()
                : selectedIds?.length?.toString()
            )}{" "}
            {config?.type === "category"
              ? `${localeTexts.buttonLabels.category}`
              : `${localeTexts.buttonLabels.product}`}
          </Button>
        </ButtonGroup>
      </>
    );
  };

  return (
    <div className="selector-page-wrapper">
      <div className="selector-page-header">
        <div className="avatar">
          <img
            src={rootConfig.ecommerceEnv.SELECTOR_PAGE_LOGO}
            alt={`${rootConfig.ecommerceEnv.APP_ENG_NAME} Logo`}
          />
        </div>
        <div className="header">
          {localeTexts.selectorPage.heading.replace(
            "$",
            rootConfig.ecommerceEnv.APP_ENG_NAME
          )}
        </div>
      </div>
      {renderSelectorPage()}
    </div>
  );
};

export default SelectorPage;
