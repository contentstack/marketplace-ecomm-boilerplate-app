interface CustomComponentProps {
  configurationObject: { [key: string]: any };
  serverConfigurationObject: { [key: string]: any };
  customComponentOnChange: (
    event: any,
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void;
}

/*eslint-disable */
const NonMultiConfigCustomComponent: React.FC<CustomComponentProps> =
  function ({
    configurationObject,
    serverConfigurationObject,
    customComponentOnChange,
  }) {
    return <p>NonMultiConfigCustomComponent</p>;
  };

export default NonMultiConfigCustomComponent;
