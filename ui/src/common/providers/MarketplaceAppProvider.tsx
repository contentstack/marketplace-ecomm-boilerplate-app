import React, { useEffect, useMemo, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { isNull } from "lodash";
import { KeyValueObj, TypeWarningtext } from "../types";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import localeTexts from "../locale/en-us";
import rootConfig from "../../root_config";

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
const MarketplaceAppProvider: React.FC = function ({ children }: any) {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<UiLocation | null>(null);
  const [appConfig, setConfig] = useState<KeyValueObj | null>(null);
  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<TypeWarningtext>({
      error: false,
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    });

  // Initialize the SDK and track analytics event
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSdkinit) => {
        setAppSdk(appSdkinit);
        const appConfiguration = await appSdkinit?.getConfig();
        console.info("app configuration", appConfiguration);
        setConfig(appConfiguration);
        setFailed(false);
      })
      .catch(() => {
        setFailed(true);
      });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      appSdk,
      appConfig,
      isInvalidCredentials,
      setIsInvalidCredentials,
    }),
    [appSdk, appConfig]
  );

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
