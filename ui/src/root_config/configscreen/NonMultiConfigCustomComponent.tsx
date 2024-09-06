interface CustomComponentProps {
  configurationObject: { [key: string]: any };
  serverConfigurationObject: { [key: string]: any };
  customComponentOnChange: (
    event: any,
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void;
  componentConfigOptions: any;
}

/*eslint-disable */
const NonMultiConfigCustomComponent: React.FC<CustomComponentProps> =
  function ({
    configurationObject,
    serverConfigurationObject,
    customComponentOnChange,
    componentConfigOptions: any,
  }) {
    return <p>NonMultiConfigCustomComponent</p>;
  };

export default NonMultiConfigCustomComponent;
