import React from "react";
import { TypeWarningtext } from "../types";

export type EntrySidebarExtensionContextType = {
  entryData: { [key: string]: any };
  contentTypeSchema: any;
  isInvalidCredentials: TypeWarningtext,
  setIsInvalidCredentials: any,
  appSdkInitialized: boolean,
};

export const EntrySidebarExtensionContext =
  React.createContext<EntrySidebarExtensionContextType>({
    entryData: {},
    contentTypeSchema: {},
    isInvalidCredentials: {
      error: false,
      data: "",
    },
    setIsInvalidCredentials: () => {},
    appSdkInitialized: false,
  });
