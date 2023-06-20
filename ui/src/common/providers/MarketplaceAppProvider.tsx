/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { isNull } from "lodash";
import { KeyValueObj } from "../types/type";
// import AppFailed from "../../components/AppFailed";
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
      .then(async (appSdk) => {
        setAppSdk(appSdk);
        const appConfig = await appSdk.getConfig();
        console.info("IN MARKETPLACE PROVIDER", appConfig)
        setConfig(appConfig);
        setFailed(false)
      })
      .catch(() => {
        setFailed(true);
      });
  }, []);
  // const installInfo = useMemo(() => ({
  //   appSdk, appConfig
  // }), [  appSdk, appConfig]);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk.
  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }

  // if (failed) {
  //   return <AppFailed />;
  // }


  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <MarketplaceAppContext.Provider value={{ appSdk, appConfig }}>{children}</MarketplaceAppContext.Provider>;
};
export default MarketplaceAppProvider;