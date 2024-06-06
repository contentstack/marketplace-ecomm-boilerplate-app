import React from "react";

export type ProductCustomFieldExtensionContextType = {
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
};

export const ProductCustomFieldExtensionContext =
  React.createContext<ProductCustomFieldExtensionContextType>({
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
  });
