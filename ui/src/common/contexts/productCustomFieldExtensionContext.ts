import React from "react";

export type ProductCustomFieldExtensionContextType = {
  setFieldData: (data: any) => void;
  selectedIds: any[];
  selectedItems: any[];
  setSelectedIds: (data: any) => void;
  setSelectedItems: (data: any) => void;
  removeIdFromField: (data: any, multiConfigName: any) => void;
  handleDragEvent: (data: any) => void;
  loading: boolean;
  stackApiKey: string;
  advancedConfig: any[];
  isOldUser: Boolean;
};

export const ProductCustomFieldExtensionContext =  React.createContext<ProductCustomFieldExtensionContextType>({
    setFieldData: () => {},
    loading: false,
    stackApiKey: "",
    selectedIds: [],
    selectedItems: [],
    setSelectedIds: () => {},
    setSelectedItems: () => {},
    handleDragEvent: () => {},
    removeIdFromField: () => {},
    advancedConfig: [],
    isOldUser: false,
  });
