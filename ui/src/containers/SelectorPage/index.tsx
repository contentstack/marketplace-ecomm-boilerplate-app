/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import {
  AsyncSelect,
  Button,
  ButtonGroup,
  Icon,
  InfiniteScrollTable,
  Select,
} from "@contentstack/venus-components";
import {
  isEmpty,
  arrangeSelectedIds,
  EmptyObjForSearchCase,
  getItemStatusMap,
} from "../../common/utils";
import localeTexts from "../../common/locale/en-us";
import { TypeWarningtext } from "../../common/types";
import {
  request,
  filter,
  search,
} from "../../services/index";
import "./styles.scss";
import WarningMessage from "../../components/WarningMessage";
import rootConfig from "../../root_config/index";

const SelectorPage: React.FC = function () {

  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any>({});
  const [selectedData, setSelectedData] = useState<any>({});
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [totalCounts, setTotalCounts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemStatus, setItemStatus] = useState({});
  const [config, setConfig] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<any>([]);
  const [categoryActive, setCategoriesActive] = useState<any>(false);
  const [searchActive, setSearchActive] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState<any>(config?.type === "category" ? [] : ["id"])
  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<TypeWarningtext>({
      error: false,
      data: localeTexts.warnings.invalidCredentials,
    });

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

  const fetchInitialData = async (searchTextParam: any) => {

    try {
      if (!isEmpty(config) ) {
        setItemStatus({
          ...getItemStatusMap(
            {},
            "loading",
            0,
            Number(config?.page_count)
          ),
        });
        const response = searchTextParam
          ? await search(config, searchTextParam, 1, config?.page_count)
          : await request(config, config?.type, currentPage + 1);
        if (searchText) {
          setSearchActive(true);
          setSearchCurrentPage(1);
        }
        if (!response?.error) {
          setList(response?.data?.items);
          if(config?.type === "category")  
           setTotalCounts(response?.data?.items?.length)
          else 
           setTotalCounts(response?.data?.meta?.total);
          const responseDataLength = response?.data?.items?.length;
          setItemStatus({
            ...getItemStatusMap(
              { ...itemStatus },
              "loaded",
              0,
              responseDataLength
            ),
          });
          // if (config?.type === "product") setDropdown(true);
          // setTotalCounts(response?.data?.meta?.total);
          setLoading(false);
          setCurrentPage(response?.data?.meta?.current_page);
          searchText
            ? setSearchCurrentPage(response?.data?.meta?.current_page)
            : setCurrentPage(response?.data?.meta?.current_page);
          
        } else {
          setIsInvalidCredentials(response);
        }
      }
    } catch (error) {
      console.error('error fetching initial data', error)
    }
  };

  const createCategoriesDropdownList = (categoriesData: any) => {
    const categoryDropdownObj: any[] = [];
    if (categoriesData?.length) {
      categoriesData?.forEach((category: any) => {
        const obj = {
          label: category?.name,
          value: category?.id,
        };
        categoryDropdownObj.push(obj);
      });
      return categoryDropdownObj;
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchInitialData(searchText);

  }, [config]);

  useEffect(() => {

    if (isEmpty(config) || !categoryActive) return;
    const fetchCategoryData = async () => {

      const categoryIds: any[] = [];
      selectedCategory?.forEach((category: any) =>
        categoryIds.push(category?.value)
      );
      try {
        const response = searchText
          ? await search(
              config,
              searchText,
              1,
              config?.page_count,
              selectedCategory
            )
          : await filter(config, "product", categoryIds);
        if (!response?.error) {
          const responseDataLength = response?.data?.items?.length;
          setItemStatus({
            ...getItemStatusMap({}, "loaded", 0, responseDataLength),
          });
          setList(response?.data?.items);
          setTotalCounts(response?.data?.meta?.total);
          if (searchText) {
            setSearchActive(true);
            setSearchCurrentPage(1);
          }
        } else {
          setIsInvalidCredentials(response);
        }
      } catch (err) {
        console.error('error fetching category data',err);
      }
    };

    if (selectedCategory?.length) {
      setSearchActive(true);
      fetchCategoryData();
    } else {
      setSearchActive(false);
      setCategoriesActive(false);
      fetchInitialData(searchText);
    } 
  }, [categoryActive, selectedCategory]);

  const fetchData = async (meta: any) => {
    try {

      if (meta?.searchText && !isEmpty(config)) {
        setSearchActive(true);
        setSearchText(meta?.searchText);
        const response = await search(
          config,
          meta?.searchText,
          1,
          config?.page_count,
          selectedCategory
        );
        if (!response?.error) {
          setList(response?.data?.items);
          setLoading(false);
          setTotalCounts(response?.data?.meta?.total);
          setSearchCurrentPage(response?.data?.meta?.current_page);
          const responseDataLength = response?.data?.items?.length;
          setItemStatus({
            ...getItemStatusMap({}, "loaded", 0, responseDataLength),
          });
        } else {
          setIsInvalidCredentials(response);
        }
      } else {
        setSearchActive(false);
        setSearchText("");
        fetchInitialData("");
      }
    } catch (err) {
      console.error('error fetching table data',err);
    }
  };

  const loadMoreItems = async (meta: any) => {
    if (searchActive && !isEmpty(config)) {
      try {
        setItemStatus({
          ...getItemStatusMap(
            { ...itemStatus },
            "loading",
            meta?.startIndex,
            meta?.startIndex + Number(config?.page_count)
          ),
        });
        const response = await request(
          config,
          config?.type,
          currentPage + 1,
        );
        if (!response?.error) {
          setCurrentPage(response?.data?.meta?.current_page);
          setList((prev: any) => [...prev, ...(response?.data?.items || [])]);
          setLoading(false);
          setItemStatus({
            ...getItemStatusMap(
              { ...itemStatus },
              "loaded",
              meta?.startIndex,
              meta?.startIndex + Number(config?.page_count)
            ),
          });
        } else {
          setIsInvalidCredentials(response);
        }
      } catch (err) {
        console.error('error loading more channel data',err);
      }
    } else {
      try {
        setItemStatus({
          ...getItemStatusMap(
            { ...itemStatus },
            "loading",
            meta?.startIndex,
            meta?.startIndex + Number(config?.page_count)
          ),
        });
        const response = await search(
          config,
          meta?.searchText,
          searchCurrentPage + 1,
          config?.page_count
        );
        if (!response?.error) {
          setSearchCurrentPage(response?.data?.meta?.current_page);
          setList([...list, ...response?.data?.items]);
          setItemStatus({
            ...getItemStatusMap(
              { ...itemStatus },
              "loaded",
              meta?.startIndex,
              meta?.startIndex + Number(config?.page_count)
            ),
          });
        } else {
          setIsInvalidCredentials(response);
        }
      } catch (err) {
        console.error(localeTexts.selectorPage.errHandling ,err);
      }
    }
  };

  const getSelectedRow = (singleSelectedRowIds: any, selected: any) => {
    const selectedObj: any = [];
    singleSelectedRowIds?.forEach((assetUid: any) => {
      selectedObj[assetUid] = true;
    });
    setSelectedRows({ ...selectedObj });
    setSelectedData(selected);
    setCheckedIds(singleSelectedRowIds);
  };

  useEffect(() => {
    setSelectedIds(arrangeSelectedIds(selectedIds, checkedIds));
  }, [checkedIds]);

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

  const handleDropDown = (event: any) => {
    setSelectedCategory(event);
    setCategoriesActive(true);
  };

  const onToggleColumnSelector = (event: any) => {
    let hiddenColumnsTemp: any = []
    Object.keys(event)?.forEach((key: string) => {
        if(!event[key] && !hiddenColumnsTemp.includes(key))
            hiddenColumnsTemp.push(key);
        if(event[key] && hiddenColumnsTemp.includes(key)){
            const index = hiddenColumnsTemp.indexOf(key)
            hiddenColumnsTemp = hiddenColumnsTemp.splice(index, 1);
        }
    })
    setHiddenColumns(hiddenColumnsTemp)
  }
  
    const renderSelectorPage = () => {
      
    if (isInvalidCredentials?.error)
      return (
        <div className="invalid-cred-selector">
          <WarningMessage content={isInvalidCredentials?.data} />
        </div>
      );
    return (
      <>
        <InfiniteScrollTable
          uniqueKey={rootConfig.ecommerceEnv.UNIQUE_KEY[config?.type]}
          hiddenColumns={hiddenColumns}
          onToggleColumnSelector={onToggleColumnSelector}
          isRowSelect
          fullRowSelect
          viewSelector
          canRefresh
          canSearch
          data={
            list?.length
              ? list.map((listData) => ({ ...listData, 
                [rootConfig.ecommerceEnv.UNIQUE_KEY[config?.type]]: `${
                listData[rootConfig.ecommerceEnv.UNIQUE_KEY[config?.type]]
              }`, }))
              : []
          }
          columns={
            config?.type === "category" ?  rootConfig.categorySelectorColumns(config)
            : rootConfig.getProductSelectorColumns(config)
          }
          loading={loading}
          initialSelectedRowIds={selectedRows}
          getSelectedRow={getSelectedRow}
          itemStatusMap={itemStatus}
          fetchTableData={fetchData}
          totalCounts={totalCounts}
          loadMoreItems={loadMoreItems}
          fixedlistRef={tableRef}
          minBatchSizeToFetch={config?.page_count || rootConfig.ecommerceEnv.FETCH_PER_PAGE}
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
              selectedIds?.length.toString()
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
          <img src={rootConfig.ecommerceEnv.SELECTOR_PAGE_LOGO} 
          alt={`${rootConfig.ecommerceEnv.APP_ENG_NAME} Logo`} />
        </div>
        <div className="header">{localeTexts.selectorPage.heading.replace(
                  "$",
                  rootConfig.ecommerceEnv.APP_ENG_NAME
                )}</div>
      </div>
      {renderSelectorPage()}
    </div>
  );
};

export default SelectorPage;
