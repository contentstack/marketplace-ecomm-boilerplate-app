import React from "react";

export type EntrySidebarExtensionContextType = {
  entryData: { [key: string]: any };
  loading: boolean;
};

export const EntrySidebarExtensionContext = React.createContext<EntrySidebarExtensionContextType>({
  entryData: {},
  loading: false,
});
