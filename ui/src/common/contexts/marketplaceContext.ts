import React from "react";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { KeyValueObj, TypeWarningtext } from "../types";
import localeTexts from "../locale/en-us";
import rootConfig from "../../root_config";

export type MarketplaceAppContextType = {
  appSdk: Extension | null;
  appConfig: KeyValueObj | null;
  isInvalidCredentials: TypeWarningtext;
  setIsInvalidCredentials: (data: any) => void;
};

export const MarketplaceAppContext =
  React.createContext<MarketplaceAppContextType>({
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
