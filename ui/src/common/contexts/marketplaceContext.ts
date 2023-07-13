import React from "react";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { KeyValueObj } from "../types/type";

export type MarketplaceAppContextType = {
  appSdk: Extension | null;
  appConfig: KeyValueObj | null;
};

export const MarketplaceAppContext = React.createContext<MarketplaceAppContextType>({
  appSdk: null,
  appConfig: null,
});
