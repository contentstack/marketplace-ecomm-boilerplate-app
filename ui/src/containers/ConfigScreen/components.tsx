import { Checkbox, Field, FieldLabel, Radio, Select } from "@contentstack/venus-components";
import { useEffect, useState } from "react";

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
        objValue?.options?.map((option: any) => {
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

  const [selectedValues, setSelectedValues] = useState<any[]>([]);

  useEffect(() => {
    const configValues = configurationObject?.multi_config_keys?.[multiConfigurationDataID]?.[objKey] || [];
    setSelectedValues(configValues);
  }, [configurationObject, multiConfigurationDataID, objKey]);

  const handleOnChange = (e: any) => {
    const selectedOption = objValue.options.find((key: any) => key.label === e.target.name);

    let updatedValues;
    if (selectedValues.some((item: any) => item.label === selectedOption.label)) {
      updatedValues = selectedValues.filter((item: any) => item.label !== selectedOption.label);
    } else {
      updatedValues = [...selectedValues, selectedOption];
    }

    setSelectedValues(updatedValues);
    const event: any = { target: { name: objKey, value: updatedValues } };
    customComponentOnChange(event, multiConfigurationDataID, objValue?.isMultiConfig);
  };

  return objValue?.options?.map((option: any) => (
    <Checkbox
      key={option.label}
      id={option.label}
      name={option.label}
      checked={selectedValues.some((item: any) => item.label === option.label)}
      label={option.label}
      onClick={handleOnChange}
    />
  ));
}

export const SelectInputField: React.FC<CustomComponentProps> = function ({
    configurationObject,
    serverConfigurationObject,
    customComponentOnChange,
    multiConfigurationDataID,
    componentConfigOptions
}) {
  const { objKey, objValue } = componentConfigOptions;
  const selectedValues = configurationObject?.multi_config_keys?.[multiConfigurationDataID]?.[objKey] || [];

  const handleOnChange = (selectedOptions: any) => {
    const event: any = {
      target: { name: objKey, value: selectedOptions }
    };
    customComponentOnChange(event, multiConfigurationDataID, objValue?.isMultiConfig);
  };

  return (
    <Field>
      <FieldLabel
        required
        htmlFor={`${objKey}_options`}
        data-testid="select_label"
      >
        {objValue?.labelText}
      </FieldLabel>
      <Select
        options={objValue?.options}
        onChange={handleOnChange}
        value={selectedValues}
        isMulti
        hasAddOption
        version="v2"
      />
    </Field>
  );
}