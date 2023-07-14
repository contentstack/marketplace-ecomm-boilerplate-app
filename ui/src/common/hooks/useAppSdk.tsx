/**
 * useAppSdk
 * @return the appSdk instance after initialization
 */
import { useContext } from "react";
import { MarketplaceAppContext, MarketplaceAppContextType } from "../contexts/marketplaceContext";

/**
 * Getter and setter for appSdk instance.
 * To be used during Sdk initialisation
 * @returns appSdk;
 *
 * Eg:
 * const appSdk = useAppSdk();
 */
const useAppSdk = () => {
  const { appSdk } = useContext<MarketplaceAppContextType>(MarketplaceAppContext);
  return appSdk;
};
export default useAppSdk;
