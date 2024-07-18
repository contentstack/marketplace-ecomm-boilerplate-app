import React from "react";

export type CustomFieldExtensionContextType = {
  customField: unknown;
  setFieldData: (data: unknown) => void;
  loading: boolean;
  handleClick?: (data: unknown) => void;
};

export const CustomFieldExtensionContext =  React.createContext<CustomFieldExtensionContextType>({
    customField: null,
    setFieldData: () => {},
    loading: false,
    handleClick: () => {},
  });
