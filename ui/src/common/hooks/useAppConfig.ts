import { useContext } from "react";
import {
  MarketplaceAppContext,
  MarketplaceAppContextType,
} from "../contexts/marketplaceContext";

/**
 * Getter and setter hook for App config
 * @returns appConfig;
 *
 * Eg:
 * const appConfig = useAppConfig();
 */
const useAppConfig = () => {
  const { appConfig } = useContext<MarketplaceAppContextType>(
    MarketplaceAppContext
  );

  return appConfig;
};

export default useAppConfig;
