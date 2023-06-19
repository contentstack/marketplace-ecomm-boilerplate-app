import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty } from "lodash";
import useAppLocation  from "../hooks/useAppLocation";
import { CategoryCustomFieldExtensionContext } from "../contexts/categoryCustomFieldExtensionContext";

const CategoryCustomFieldExtensionProvider: React.FC = function ({ children }: any){
  const [categoryCustomField, setCategoryCustomField] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();

  useEffect(() => {
    (async () => {
      // check if the data was loaded earlier or not
      if (isEmpty(categoryCustomField)) {
        setLoading(true);
        const fieldData = await location.field.getData();
        setCategoryCustomField(fieldData);
        setLoading(false);
      }
    })();
  }, [setLoading, setCategoryCustomField, location, categoryCustomField]);

  const setFieldData = useCallback(
    async (data: unknown) => {
      setLoading(true);
      await location.field.setData(data);
      setCategoryCustomField(data);
      setLoading(false);
    },
    [location, setLoading, setCategoryCustomField]
  );

  const installInfo = useMemo(() => ({
    categoryCustomField, setFieldData, loading
  }), [ categoryCustomField, setFieldData, loading]);
  
  return (
    <CategoryCustomFieldExtensionContext.Provider value={installInfo}>
      {children}
    </CategoryCustomFieldExtensionContext.Provider>
  );
};
export default CategoryCustomFieldExtensionProvider;