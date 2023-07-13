import React from "react";

export type SelectorExtensionContextType = {
  listData: { [key: string]: any };
  loading: boolean;
};

export const SelectorExtensionContext = React.createContext<SelectorExtensionContextType>({
  listData: {},
  loading: false,
});
