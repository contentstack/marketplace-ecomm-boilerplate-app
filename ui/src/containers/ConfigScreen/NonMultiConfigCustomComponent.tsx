import React from "react";

interface CustomComponentProps {
  configurationObject: { [key: string]: any };
  serverConfigurationObject: { [key: string]: any };
  customComponentOnChange: (
    event: any,
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void;
}

// eslint-disable-next-line
const NonMultiConfigCustomComponent: React.FC<CustomComponentProps> =
  function ({
    configurationObject,
    serverConfigurationObject,
    customComponentOnChange,
  }) {
    // eslint-disable-next-line
    const onSelectChange = (event: any) => {
      const e: any = {};
      e.target = {
        name: "",
        value: event?.id,
      };
      customComponentOnChange(e, "", false);
    };
    return <p>NonMultiConfigCustomComponent</p>;
  };

export default NonMultiConfigCustomComponent;
