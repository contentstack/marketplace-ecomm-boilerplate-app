import React, { useEffect, useMemo, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { isNull } from "lodash";
import { KeyValueObj } from "../types/type";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";


/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
const MarketplaceAppProvider: React.FC = function ({ children }: any) {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<Extension | null>(null);
  const [appConfig, setConfig] = useState<KeyValueObj | null>(null);

  // Initialize the SDK and track analytics event
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSdkinit) => {
        setAppSdk(appSdkinit);
        const appConfiguration = await appSdkinit?.getConfig();
        setConfig(appConfiguration);
        setFailed(false)
      })
      .catch(() => {
        setFailed(true);
      });
  }, []);

  const memoizedValue = useMemo(() => ({
    appSdk,
    appConfig
  }), [appSdk, appConfig]);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk.
  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }
  
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return (
    <MarketplaceAppContext.Provider value={memoizedValue}>
      {children}
    </MarketplaceAppContext.Provider>
  );
};
export default MarketplaceAppProvider;