import { useContext } from "react";
import {
  ProductCustomFieldExtensionContext,
  ProductCustomFieldExtensionContextType,
} from "../contexts/productCustomFieldExtensionContext";

/**
 * Getter and setter hook for custom field data
 * @returns an object { customField, setFieldData, loading };
 *
 * Eg:
 * const { customField, setFieldData, loading } = useCustomField();
 */
const useProductCustomField = () => {
  const { productCustomField, setFieldData, loading } =
    useContext<ProductCustomFieldExtensionContextType>(
      ProductCustomFieldExtensionContext
    );

  return { productCustomField, setFieldData, loading };
};
export default useProductCustomField;
