import { Checkbox, Radio } from "@contentstack/venus-components";

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

export const RadioInputField: React.FC<CustomComponentProps> = function ({
    configurationObject,
    serverConfigurationObject,
    customComponentOnChange,
    multiConfigurationDataID,
    componentConfigOptions,
  }) {
    const { objKey, objValue } = componentConfigOptions;
    return (
        objValue?.options.map((option: any) => {
            return (
                <Radio
                  id={option?.label}
                  name={objKey}
                  checked={configurationObject?.multi_config_keys?.[multiConfigurationDataID]?.[objKey] === option?.label}
                  label={option?.label}
                  value
                  onClick={(e: any) => {
                    customComponentOnChange(
                      e,
                      multiConfigurationDataID,
                      objValue?.isMultiConfig
                    );
                  }}
                />
            );
        }
    ))
}

export const CheckboxInputField: React.FC<CustomComponentProps> = function ({
    configurationObject,
    serverConfigurationObject,
    customComponentOnChange,
    multiConfigurationDataID,
    componentConfigOptions,
  }) {
    const { objKey, objValue } = componentConfigOptions;
    return (
        objValue?.options.map((option: any) => {
            return (
                <Checkbox
                  id={option?.label}
                  name={objKey}
                  checked={(configurationObject?.multi_config_keys?.[multiConfigurationDataID]?.[objKey]).includes(option?.label)}
                  label={option?.label}
                  value
                  onClick={(e: any) => {
                    customComponentOnChange(
                      e,
                      multiConfigurationDataID,
                      objValue?.isMultiConfig
                    );
                  }}
                />
            );
        }
    ))
}