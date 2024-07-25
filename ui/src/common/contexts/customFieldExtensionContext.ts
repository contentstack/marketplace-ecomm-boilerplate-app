import React from "react";
import { TypeWarningtext } from "../types";

export type CustomFieldExtensionContextType = {
  // productCustomField: unknown;
  setFieldData: (data: any) => void;
  selectedIds: any[];
  selectedItems: any[];
  setSelectedIds: (data: any) => void;
  setSelectedItems: (data: any) => void;
  removeIdFromField: (data: any) => void;
  handleDragEvent: (data: any) => void;
  loading: boolean;
  stackApiKey: string;
  isInvalidCredentials: TypeWarningtext;
  appSdkInitialized: boolean;
};

export const CustomFieldExtensionContext =
  React.createContext<CustomFieldExtensionContextType>({
    // productCustomField: null,
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
  });
