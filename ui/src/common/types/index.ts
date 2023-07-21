import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";

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

declare global {
  export interface Window {
    iframeRef: any;
    postRobot: any;
  }
}

export type Props = {
  [key: string]: any;
};
export type TypeWarningtext = {
  error: boolean;
  data: any;
};
