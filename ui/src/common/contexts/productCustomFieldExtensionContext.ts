import React from "react";

export type ProductCustomFieldExtensionContextType = {
  productCustomField: unknown;
  setFieldData: (data: unknown) => void;
  loading: boolean;
};

export const ProductCustomFieldExtensionContext = React.createContext<ProductCustomFieldExtensionContextType>({
  productCustomField: null,
  setFieldData: () => {},
  loading: false,
});
