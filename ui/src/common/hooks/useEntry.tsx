import { useContext } from "react";
import {
  EntrySidebarExtensionContext,
  EntrySidebarExtensionContextType,
} from "../contexts/entrySidebarExtensionContext";

/**
 * Getter and setter hook for entry data
 * @returns an Object { entryData, loading };
 *
 * Eg:
 * const { entryData, loading } = useEntry();
 */
const useEntry = () => {
  const { entryData, loading } = useContext(EntrySidebarExtensionContext) as EntrySidebarExtensionContextType;

  return { entryData, loading };
};
export default useEntry;