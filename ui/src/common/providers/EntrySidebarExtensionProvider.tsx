import React, { useEffect, useMemo, useState } from "react";
import { isEmpty, isNull } from "lodash";
import useAppLocation from "../hooks/useAppLocation";
import { EntrySidebarExtensionContext } from "../contexts/entrySidebarExtensionContext";

const EntrySidebarExtensionProvider: React.FC = function ({ children }: any) {
  const [entryData, setEntry] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();

  useEffect(() => {
    (async () => {
      if (!isEmpty(entryData) || isNull(location)) return;
      setLoading(true);
      const entry: { [key: string]: any } = await location?.entry?.getData();
      setEntry(entry);
      setLoading(false);
    })();
  }, [entryData, location, setLoading, setEntry]);

  const memoizedValue = useMemo(
    () => ({
      entryData,
      loading,
    }),
    [entryData, loading]
  );

  return (
    <EntrySidebarExtensionContext.Provider value={memoizedValue}>
      {children}
    </EntrySidebarExtensionContext.Provider>
  );
};
export default EntrySidebarExtensionProvider;
