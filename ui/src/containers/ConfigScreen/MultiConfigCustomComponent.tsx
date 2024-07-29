import React from "react";

interface CustomComponentProps {
  configurationObject: { [key: string]: any };
  serverConfigurationObject: { [key: string]: any };
  customComponentOnChange: (
    event: any,
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void;
  multiConfigurationData: any;
}
// eslint-disable-next-line
const MultiConfigCustomComponent: React.FC<CustomComponentProps> = function ({
  configurationObject,
  serverConfigurationObject,
  customComponentOnChange,
  multiConfigurationData,
}) {
  // eslint-disable-next-line
  const onSelectChange = (event: any) => {
    const e: any = {};
    e.target = {
      name: "",
      value: event,
    };
    customComponentOnChange(e, multiConfigurationData, true);
  };
  return <p>MultiConfigCustomComponent</p>;
};

export default MultiConfigCustomComponent;
