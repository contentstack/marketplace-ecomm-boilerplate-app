import React from "react";

interface CustomComponentProps {
  configurationObject: { [key: string]: any };
  serverConfigurationObject: { [key: string]: any };
  customComponentOnChange: (
    event: any,
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void;
  multiConfigurationDataID: any;
  componentConfigOptions: any;
}
// eslint-disable-next-line
const MultiConfigCustomComponent: React.FC<CustomComponentProps> = function ({
  configurationObject,
  serverConfigurationObject,
  customComponentOnChange,
  multiConfigurationDataID,
  componentConfigOptions: any,
}) {
  return <p>MultiConfigCustomComponent</p>;
};

export default MultiConfigCustomComponent;
