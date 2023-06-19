import { useContext } from "react";
import {
    SelectorExtensionContext,
    SelectorExtensionContextType,
} from "../contexts/selectorExtensionContext";

/**
 * Getter and setter hook for entry data
 * @returns an Object { entryData, loading };
 *
 * Eg:
 * const { entryData, loading } = useEntry();
 */
const useEntry = () => {
  const { listData, loading } = useContext(SelectorExtensionContext) as SelectorExtensionContextType;

  return { listData, loading };
};
export default useEntry;