import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import useAppLocation from "../hooks/useAppLocation";
import { CustomFieldExtensionContext } from "../contexts/customFieldExtensionContext";

const CustomFieldExtensionProvider: React.FC = function ({ children }: any) {
  const [customField, setCustomField] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();

  useEffect(() => {
    (async () => {
      // check if the data was loaded earlier or not
      if (isEmpty(customField)) {
        setLoading(true);
        const fieldData = await location?.field?.getData();
        setCustomField(fieldData);
        setLoading(false);
      }
    })();
  }, [setLoading, setCustomField, location, customField]);

  const setFieldData = useCallback(
    async (data: unknown) => {
      setLoading(true);
      await location?.field?.setData(data);
      setCustomField(data);
      setLoading(false);
    },
    [location, setLoading, setCustomField]
  );

  const installInfo = useMemo(
    () => ({
      customField,
      setFieldData,
      loading,
    }),
    [customField, setFieldData, loading]
  );

  return (
    <CustomFieldExtensionContext.Provider value={installInfo}>
      {children}
    </CustomFieldExtensionContext.Provider>
  );
};
export default CustomFieldExtensionProvider;
