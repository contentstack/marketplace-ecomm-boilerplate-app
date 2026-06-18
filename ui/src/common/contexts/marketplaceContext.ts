import React from "react";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { KeyValueObj, TypeWarningtext } from "../types";
import localeTexts from "../locale/en-us";
import rootConfig from "../../root_config";

export type MarketplaceAppContextType = {
  appSdk: UiLocation | null;
  appConfig: KeyValueObj | null;
  isInvalidCredentials: TypeWarningtext;
  setIsInvalidCredentials: (data: any) => void;
};

export const MarketplaceAppContext =  React.createContext<MarketplaceAppContextType>({
    appSdk: null,
    appConfig: null,
    isInvalidCredentials: {
      error: false,
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    },
    setIsInvalidCredentials: () => {},
  });
