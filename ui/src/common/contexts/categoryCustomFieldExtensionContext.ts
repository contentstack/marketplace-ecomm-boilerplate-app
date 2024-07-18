import React from "react";

export type CategoryCustomFieldExtensionContextType = {
  categoryCustomField: unknown;
  setFieldData: (data: unknown) => void;
  loading: boolean;
};

export const CategoryCustomFieldExtensionContext =  React.createContext<CategoryCustomFieldExtensionContextType>({
    categoryCustomField: null,
    setFieldData: () => {},
    loading: false,
  });
