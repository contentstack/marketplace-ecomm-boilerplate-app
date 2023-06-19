import { useContext } from "react";
import { CustomFieldExtensionContext, CustomFieldExtensionContextType } from "../contexts/customFieldExtensionContext";

/**
 * Getter and setter hook for custom field data
 * @returns an object { customField, setFieldData, loading };
 *
 * Eg:
 * const { customField, setFieldData, loading } = useCustomField();
 */
const useCustomField = () => {
  const { customField, setFieldData, loading } = useContext(
    CustomFieldExtensionContext
  ) as CustomFieldExtensionContextType;

  return { customField, setFieldData, loading };
};
export default useCustomField;