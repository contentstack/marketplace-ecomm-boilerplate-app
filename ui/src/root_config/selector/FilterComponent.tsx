/* eslint-disable @typescript-eslint/no-unused-vars */
import { AsyncSelect, Select } from "@contentstack/venus-components";
import React, { useEffect, useState } from "react";
import { getProductsByCategory, search } from "../../services";

function FilterComponent({
  config,
  meta,
  updateList,
  category,
  setCategory,
  setLoading,
  tableRef,
  fetchData,
  oldUser,
  selectedMultiConfigValue,
}: any) {
  const options = [
    {
      label: "Option 1",
      value: "option1",
    },
    {
      label: "Option 2",
      value: "option2",
    },
    {
      label: "Option 3",
      value: "option3",
    },
  ];
  const [value, setValue] = useState(null);
  const handleValueUpdate = (data: any) => {
    setValue(data);
  };

  const loadProductsByCategory = async () => {
    const response: any = await getProductsByCategory(
      config,
      oldUser,
      selectedMultiConfigValue,
      meta?.skip,
      meta?.limit,
      category?.value
    );

    updateList(response);
  };

  const loadMoreOptions: any = async ({
    skip,
    limit,
  }: {
    skip: number;
    limit: number;
  }) => {
    const response: any = await getProductsByCategory(
      config,
      oldUser,
      selectedMultiConfigValue,
      skip,
      limit,
      "category",
    );

    const options = response?.data?.items?.map((tempCategory: any) => {
      const nameKeys = Object.keys(tempCategory?.name || {});
      const name = tempCategory?.name?.[nameKeys?.[0]];
      return {
        id: tempCategory?.id,
        label: name,
        value: tempCategory?.id,
      }}) || [];

    return { options , hasMore: response?.data?.meta?.total > skip + limit }
  };

  const loadProductsBySearch = async () => {
    const response = await search(
      config,
      meta?.searchText,
      meta?.skip,
      meta?.limit,
      oldUser,
      selectedMultiConfigValue,
      category?.value
    );

    updateList(response);
  };

  useEffect(() => {}, [config, meta]);

  useEffect(() => {
    updateList(value);
  }, [value]);

  useEffect(() => {
    if (config?.type !== "product") return;
    // eslint-disable-next-line no-param-reassign
    meta = {
      skip: 0,
      limit: meta?.limit || 30,
      startIndex: 0,
      stopIndex: meta?.limit || 30,
      searchText: meta?.searchText || "",
    };

    if (meta?.searchText && category?.value) {
      setLoading(true);
      loadProductsBySearch();
    } else if (category?.value) {
      setLoading(true);
      loadProductsByCategory();
    } else {
      fetchData(meta);
    }

    tableRef?.current?.setTablePage(1);
  }, [category]);

  return (
    <>
      <Select
        options={options}
        value={value}
        onChange={handleValueUpdate}
        placeholder="Select a filter"
        isClearable
        version="v2"
      />
      <AsyncSelect
        value={category}
        onChange={setCategory}
        placeholder="Select Category"
        loadMoreOptions={loadMoreOptions}
        limit={20}
        width="200px"
        version="v2"
        isClearable
      />
    </>
  );
}

export default FilterComponent;
