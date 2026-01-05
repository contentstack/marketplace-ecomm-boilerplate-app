import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import useAppLocation from "../hooks/useAppLocation";
import { ProductCustomFieldExtensionContext } from "../contexts/productCustomFieldExtensionContext";

const ProductCustomFieldExtensionProvider: React.FC = function ({
  children,
}: any) {
  const [productCustomField, setProductCustomField] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();
  useEffect(() => {
    (async () => {
      // check if the data was loaded earlier or not
      if (isEmpty(productCustomField)) {
        setLoading(true);
        const fieldData = await location?.field?.getData();
        setProductCustomField(fieldData);
        setLoading(false);
      }
    })();
  }, [setLoading, setProductCustomField, location, productCustomField]);

  const setFieldData = useCallback(
    async (data: unknown) => {
      setLoading(true);
      await location?.field?.setData(data);
      setProductCustomField(data);
      setLoading(false);
    },
    [location, setLoading, setProductCustomField]
  );

  const installInfo = useMemo(
    () => ({
      productCustomField,
      setFieldData,
      loading,
    }),
    [productCustomField, setFieldData, loading]
  );

  return (
    <ProductCustomFieldExtensionContext.Provider value={installInfo}>
      {children}
    </ProductCustomFieldExtensionContext.Provider>
  );
};
export default ProductCustomFieldExtensionProvider;
