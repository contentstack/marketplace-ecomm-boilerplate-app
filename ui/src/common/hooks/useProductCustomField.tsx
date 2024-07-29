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
  const {
    setFieldData,
    selectedIds,
    selectedItems,
    setSelectedIds,
    setSelectedItems,
    removeIdFromField,
    handleDragEvent,
    loading,
    stackApiKey,
    advancedConfig,
    isOldUser,
  } = useContext<ProductCustomFieldExtensionContextType>(
    ProductCustomFieldExtensionContext
  );

  return {
    setFieldData,
    selectedIds,
    selectedItems,
    setSelectedIds,
    setSelectedItems,
    removeIdFromField,
    handleDragEvent,
    loading,
    stackApiKey,
    advancedConfig,
    isOldUser,
  };
};
export default useProductCustomField;
