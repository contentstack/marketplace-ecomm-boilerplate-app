/**
 * useAppSdk
 * @return the appSdk instance after initialization
 */
import { useContext } from "react";
import {
  MarketplaceAppContext,
  MarketplaceAppContextType,
} from "../contexts/marketplaceContext";

/**
 * Getter and setter for appSdk instance.
 * To be used during Sdk initialisation
 * @returns appSdk;
 *
 * Eg:
 * const appSdk = useAppSdk();
 */
const useError = () => {
  const { isInvalidCredentials, setIsInvalidCredentials } =    useContext<MarketplaceAppContextType>(MarketplaceAppContext);
  return { isInvalidCredentials, setIsInvalidCredentials };
};
export default useError;
