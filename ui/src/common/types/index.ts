/* eslint-disable @typescript-eslint/naming-convention */

import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";

declare global {
  export interface Window {
    iframeRef: any;
    postRobot: any;
  }
}

export interface TypePopupWindowDetails {
  url: string;
  title: string;
  w: number;
  h: number;
}

export interface TypeAppSdkConfigState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}

export interface TypeSDKData {
  config: any;
  location: any;
  appSdkInitialized: boolean;
}

export type Props = {
  [key: string]: any;
};

export interface TypeOption {
  label: string;
  value: string;
}

export interface TypeConfigComponent {
  objKey: string;
  objValue: any;
  currentValue: any;
  updateConfig: Function;
}

export type TypeWarningtext = {
  error: boolean;
  data: any;
};

export interface TypeRadioOption {
  fieldName: string;
  mode: TypeOption;
  index: number;
  radioOption: TypeOption;
  updateRadioOptions: Function;
}

export declare type ColumnsProp = {
  Header: string;
  accessor: string | Function;
  default?: boolean;
  disableSortBy?: boolean;
  Cell?: (props: any) => React.ReactNode;
  addToColumnSelector?: boolean;
  id?: string;
  cssClass?: string;
  columnWidthMultiplier?: number;
};

export interface KeyValueObj {
  [key: string]: any;
}

export type Result = {
  [key: string]: {
    multiConfiguniqueKey: (string | object)[];
  };
};

// Define the state type
export type EntryIdsType = {} | any[];
export interface CustomFieldType {
  type: "product" | "category" | "";
}

export interface EcommerceEnv {
  REACT_APP_NAME: string;
  SELECTOR_PAGE_LOGO: string;
  APP_ENG_NAME: string;
  UNIQUE_KEY: UniqueKeyOptions | any;
}

export interface UniqueKeyOptions {
  product: string | any;
  category: string | any;
}

export interface KeyOption {
  label: string;
  value: string;
  searchLabel: string;
  isDisabled?: boolean;
}

interface ConfigInfo {
  label: string;
  help?: string;
  placeholder?: string;
  instruction: string;
  name: string;
  isSensitive?: boolean;
}

export interface FormattedRespose {
  items: any[];
  meta: {
    total: number;
    current_page: number;
  };
}

export interface ConfigFields {
  [key: string]: ConfigInfo;
}

export interface TypeProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  sku?: string;
  isProductDeleted:Boolean
  
}

export interface TypeCategory {
  id: string;
  name: string;
  customUrl?: string;
  description: string;
  isCategoryDeleted:Boolean;

}

export interface SidebarDataObj {
  title: string;
  value: string;
}

export interface APIResponseType {
  error: boolean;
  data: FormattedRespose | string;
}
