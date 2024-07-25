import { useContext } from "react";
import {
  CustomFieldExtensionContext,
  CustomFieldExtensionContextType,
} from "../contexts/customFieldExtensionContext";

/**
 * Getter and setter hook for custom field data
 * @returns an object { customField, setFieldData, loading };
 *
 * Eg:
 * const { customField, setFieldData, loading } = useCustomField();
 */
const useCustomField = () => {
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
    isInvalidCredentials,
    appSdkInitialized
  } = useContext<CustomFieldExtensionContextType>(
    CustomFieldExtensionContext
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
    isInvalidCredentials,
    appSdkInitialized
  };
};
export default useCustomField;
