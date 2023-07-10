import React, { useEffect, useState } from "react";
import { isEmpty, isNull } from "lodash";
import useAppLocation from "../hooks/useAppLocation";
import { SelectorExtensionContext } from "../contexts/selectorExtensionContext";

const SelectorExtensionProvider: React.FC = function ({ children }: any){
  const [listData, setList] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();

  useEffect(() => {
    (async () => {
      if (!isEmpty(listData) || isNull(location)) return;
      setLoading(true);
      const entry: { [key: string]: any } = await location?.entry?.getData();
      setList(entry);
      setLoading(false);
    })();
  }, [listData, location, setLoading, setList]);


  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <SelectorExtensionContext.Provider value={{listData, loading}}>
      {children}
    </SelectorExtensionContext.Provider>
  );
};
export default SelectorExtensionProvider;