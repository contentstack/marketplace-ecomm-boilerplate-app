import React from "react";
import { TypeWarningtext } from "../types";

export type CustomFieldExtensionContextType = {
  setFieldData: (data: any) => void;
  selectedIds: any[];
  selectedItems: any[];
  setSelectedIds: (data: any) => void;
  setSelectedItems: (data: any) => void;
  removeIdFromField: (...args: any[]) => void;
  handleDragEvent: (data: any) => void;
  loading: boolean;
  stackApiKey: string;
  isInvalidCredentials: TypeWarningtext;
  appSdkInitialized: boolean;
  advancedConfig: any[];
  isOldUser: Boolean;
};

export const CustomFieldExtensionContext =  React.createContext<CustomFieldExtensionContextType>({
    setFieldData: () => {},
    loading: false,
    stackApiKey: "",
    selectedIds: [],
    selectedItems: [],
    setSelectedIds: () => {},
    setSelectedItems: () => {},
    handleDragEvent: () => {},
    removeIdFromField: () => {},
    isInvalidCredentials: {
      error: false,
      data: "",
    },
    appSdkInitialized: false,
    advancedConfig: [],
    isOldUser: false,
  });
