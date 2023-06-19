/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Icon,
  InfiniteScrollTable,
  Select,
} from "@contentstack/venus-components";
import {
  isEmpty,
  arrangeSelectedIds,
  EmptyObjForSearchCase
} from "../../common/utils";
import localeTexts from "../../common/locale/en-us";
import { TypeWarningtext } from "../../common/types";
import {
  request,
  requestCategories,
  filter,
  search,
} from "../../services";
import "./styles.scss";
import WarningMessage from "../../components/WarningMessage";
import rootConfig from "../../root_config";

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
  const [categories, setCategories] = useState<any>({});
  const [dropdown, setDropdown] = useState(false);
  const [categoryDropdownList, setCategoryDropdownList] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>([]);
  const [searchActive, setSearchActive] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<TypeWarningtext>({
      error: false,
      data: localeTexts.warnings.invalidCredentials.replace("$", rootConfig.ecommerceEnv.APP_ENG_NAME),
    });

    useEffect(() => {
      const { opener: windowOpener } = window;
      if (windowOpener) {
        window.addEventListener("message", handleMessage, false);
        windowOpener.postMessage("openedReady", "*");
        window.addEventListener("beforeunload", () => {
          windowOpener.postMessage({ message: "close" }, "*");
        });
      }
    }, []);
    
    useEffect(() => {
      const categoryDropdownObj: any[] = [];
      if (categories?.length) {
        categories.forEach((category: any) => {
          const obj = {
            label: rootConfig.returnFormattedCategory(category)?.name,
            value: rootConfig.returnFormattedCategory(category)?.id,
          };
          categoryDropdownObj.push(obj);
        });
        setCategoryDropdownList([...categoryDropdownObj]);
        setDropdown(true);
      }
    }, [categories]);
  
    useEffect(() => {
      setLoading(true);
      fetchInitialData();
    }, [config]);
  
    useEffect(() => {
      if (isEmpty(config)) return;
      const fetchCategoryData = async () => {
        const categoryIds: any[] = [];
        selectedCategory?.forEach((category: any) =>
          categoryIds.push(category?.value)
        );
        const response = await filter(config, "product", categoryIds);
        if (!response?.error) {
          const itemStatusMap: any = {};
          const responseDataLength = response?.data?.items?.length;
          for (let index = 0; index < responseDataLength; index += 1) {
            itemStatusMap[index] = "loaded";
          }
          setItemStatus({ ...itemStatusMap });
          setList(response?.data?.items);
          setTotalCounts(response?.data?.meta?.total);
        } else {
          setIsInvalidCredentials(response);
        }
      };
  
      if (selectedCategory?.length) {
        setSearchActive(true);
        fetchCategoryData();
      } else {
        setSearchActive(false);
        fetchInitialData();
      }
    }, [selectedCategory]);
  
    useEffect(() => {
      setSelectedIds(arrangeSelectedIds(selectedIds, checkedIds));
    }, [checkedIds]);
  
  const getSelectedData = async (_type: any, data = []) => {
    if (data?.length) {
      data.forEach((id) => {
        selectedRows[id] = true;
      });
    }
    setSelectedRows({ ...selectedRows });
    setSelectedIds(data);
    return selectedRows;
  };

  const handleMessage = (event: any) => {
    const { data } = event;
      if (data?.message === "init") {
        getSelectedData(data?.type, data?.selectedItems);
        setConfig({ ...data?.config, type: data?.type });
      }
  };

  const fetchInitialData = async () => {
    if (!isEmpty(config)) {
      const itemStatusMap: any = {};
      for (let index = 0; index < Number(rootConfig.ecommerceEnv.FETCH_PER_PAGE || 20); index += 1) {
        itemStatusMap[index] = "loading";
      }
      setItemStatus({ ...itemStatusMap });

      const response = await request(config);
      if (!response?.error) {
        setList(response?.data?.items);
        if (config.type === "product") {
          const categoriesData = await requestCategories(config);
          if (!categoriesData?.error) {
            setCategories(categoriesData?.data?.items);
          } else {
            setIsInvalidCredentials(categoriesData);
          }
        }

        setTotalCounts(response?.data?.meta?.total);
        setLoading(false);
        setCurrentPage(response?.data?.meta?.current_page);
        const updatedItemStatusMap: any = {};
        const responseDataLength = response?.data?.items?.length;
        for (let index = 0; index < responseDataLength; index += 1) {
          updatedItemStatusMap[index] = "loaded";
        }
        setItemStatus({ ...updatedItemStatusMap });
      } else {
        setIsInvalidCredentials(response);
      }
    }
  };

  const fetchData = async (meta: any) => {
    try {
      if (meta?.searchText && !isEmpty(config)) {
        setSearchActive(true);
        const response = await search(config, meta.searchText);
        if (!response?.error) {
          setList(response?.data?.items);
          setLoading(false);
          setTotalCounts(response?.data?.meta?.total);
          const itemStatusMap: any = {};
          const responseDataLength = response?.data?.items?.length;
          for (let index = 0; index < responseDataLength; index += 1) {
            itemStatusMap[index] = "loaded";
          }
          setItemStatus({ ...itemStatusMap });
        } else {
          setIsInvalidCredentials(response);
        }
      } else {
        setSearchActive(false);
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadMoreItems = async (meta: any) => {
    if (!searchActive && !isEmpty(config)) {
      try {
        const itemStateMap: any = { ...itemStatus };
        for (
          let index = meta?.startIndex;
          index < meta?.startIndex + Number(rootConfig.ecommerceEnv.FETCH_PER_PAGE || 20);
          index += 1
        ) {
          itemStateMap[index] = "loading";
        }
        setItemStatus({ ...itemStateMap });
        setLoading(true);
        const response = await request(config, currentPage + 1);
        if (!response?.error) {
          setCurrentPage(response?.data?.meta?.current_page);
          const updatedItemStateMap: any = { ...itemStatus };

          for (
            let index = meta?.startIndex;
            index < meta?.startIndex + Number(rootConfig.ecommerceEnv.FETCH_PER_PAGE || 20);
            index += 1
          ) {
            updatedItemStateMap[index] = "loaded";
          }
          setList([...list, ...response?.data?.items]);
          setItemStatus({ ...updatedItemStateMap });
          setLoading(false);
        } else {
          setIsInvalidCredentials(response);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  // eslint-disable-next-line
  const getSelectedRow = (singleSelectedRowIds: any, selected: any) => {
    const selectedObj: any = [];
    singleSelectedRowIds?.forEach((assetUid: any) => {
      selectedObj[assetUid] = true;
    });
    setSelectedRows({ ...selectedObj });
    setSelectedData(selected);
    setCheckedIds(singleSelectedRowIds);
  };

  const returnSelectedData = () => {
    const dataArr = JSON.parse(JSON.stringify(selectedData));
    const dataIds = JSON.parse(JSON.stringify(selectedIds));
    if (window.opener) {
      window.opener.postMessage({ message: "add", dataArr, dataIds }, "*");
      window.close();
    }
  };

  const handleDropDown = (event: any) => {
    setSelectedCategory(event);
  };

  const renderSelectorPage = () => {
    if (isInvalidCredentials.error)
      return (
        <div className="invalid-cred-selector">
          <WarningMessage content={isInvalidCredentials.data} />
        </div>
      );
    return (
      <>
        {dropdown ? (
          <div className="filterDropdown">
            <Select
              onChange={handleDropDown}
              value={selectedCategory}
              isMulti
              multiDisplayLimit={3}
              placeholder={localeTexts.selectorPage.selectCategory.placeHolder}
              options={categoryDropdownList}
              updateOption={handleDropDown}
            />
          </div>
        ) : (
          ""
        )}

        <InfiniteScrollTable
          uniqueKey= {rootConfig.ecommerceEnv.UNIQUE_KEY}
          hiddenColumns={config?.type === "category" ? [] : [rootConfig.ecommerceEnv.UNIQUE_KEY?.[config?.type]]}
          isRowSelect
          fullRowSelect
          viewSelector
          canRefresh
          canSearch
          data={
            list?.length
              ? list.map((listData) => ({ ...listData, [rootConfig.ecommerceEnv.UNIQUE_KEY?.[config?.type]]: `${listData[rootConfig.ecommerceEnv.UNIQUE_KEY?.[config?.type]]}` }))
              : []
          }
          columns={
            config?.type === "category" ? rootConfig.categorySelectorColumns : rootConfig.productSelectorColumns
          }
          loading={loading}
          initialSelectedRowIds={selectedRows}
          getSelectedRow={getSelectedRow}
          itemStatusMap={itemStatus}
          fetchTableData={fetchData}
          totalCounts={totalCounts}
          loadMoreItems={loadMoreItems}
          minBatchSizeToFetch={rootConfig.ecommerceEnv.FETCH_PER_PAGE || 20}
          name={
            config?.type === "category"
              ? {
                  singular: localeTexts.selectorPage.searchPlaceholder.category,
                  plural: localeTexts.selectorPage.searchPlaceholder.categories,
                }
              : {
                  singular: localeTexts.selectorPage.searchPlaceholder.product,
                  plural: localeTexts.selectorPage.searchPlaceholder.products,
                }
          }
          searchPlaceholder={`${localeTexts.selectorPage.searchPlaceholder.caption} ${
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
                    data={localeTexts.selectorPage.hoverActions.replace("$", rootConfig.ecommerceEnv.APP_ENG_NAME)}
                  />
                </div>
              ),
              action: (_e: any, data: any) => {
                window.open(
                  rootConfig.getOpenerLink(data[rootConfig.ecommerceEnv.UNIQUE_KEY?.[config?.type]], config, config?.type),
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
            {localeTexts.selectorPage.add.replace("#", selectedIds?.length.toString())}
            {" "}
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
          <img src={rootConfig.ecommerceEnv.SELECTOR_PAGE_LOGO} alt={`${rootConfig.ecommerceEnv.APP_ENG_NAME} Logo`} />
        </div>
        <div className="header">{localeTexts.selectorPage.heading.replace("$", rootConfig.ecommerceEnv.APP_ENG_NAME)}</div>
      </div>
      {renderSelectorPage()}
    </div>
  );
};

export default SelectorPage;
