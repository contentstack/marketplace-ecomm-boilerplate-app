import { useContext } from "react";
import { CategoryCustomFieldExtensionContext, CategoryCustomFieldExtensionContextType } from "../contexts/categoryCustomFieldExtensionContext";

/**
 * Getter and setter hook for custom field data
 * @returns an object { customField, setFieldData, loading };
 *
 * Eg:
 * const { customField, setFieldData, loading } = useCustomField();
 */
const useCategoryCustomField = () => {
  const {
    categoryCustomField,
    setFieldData,
    loading
  } = useContext<CategoryCustomFieldExtensionContextType>(CategoryCustomFieldExtensionContext);

  return { categoryCustomField, setFieldData, loading };
};
export default useCategoryCustomField;