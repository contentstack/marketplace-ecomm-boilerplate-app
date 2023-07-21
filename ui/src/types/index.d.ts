/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

type uniqueKeyOptions = {
  [key: string]: string;
};
export interface EcommerceEnv {
  REACT_APP_NAME: string;
  SELECTOR_PAGE_LOGO: string;
  APP_ENG_NAME: string;
  UNIQUE_KEY: uniqueKeyOptions = {
    product: string,
    category: string,
  };
  FETCH_PER_PAGE?: number;
}

interface KeyOption {
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
}

export interface TypeCategory {
  id: string;
  name: string;
  customUrl?: string;
  description: string;
}

export interface SidebarDataObj {
  title: string;
  value: string;
}

export interface APIResponseType {
  error: boolean;
  data: {
    items: [];
    meta: {
      total: number;
      current_page: number;
    };
  };
}
