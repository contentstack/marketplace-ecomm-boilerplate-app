import React from "react";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { KeyValueObj, TypeWarningtext } from "../types";
import localeTexts from "../locale/en-us";
import rootConfig from "../../root_config";

export type MarketplaceAppContextType = {
  appSdk: UiLocation | null;
  sdkError: string | null;
  appConfig: any;
  isInvalidCredentials: TypeWarningtext;
  setIsInvalidCredentials: (data: any) => void;
  setSdkError: any;
};

export const MarketplaceAppContext =  React.createContext<MarketplaceAppContextType>({
    appSdk: null,
    sdkError: "",
    appConfig: "",
    isInvalidCredentials: {
      error: false,
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    },
    setIsInvalidCredentials: () => {},
    setSdkError: () => {},
  });
