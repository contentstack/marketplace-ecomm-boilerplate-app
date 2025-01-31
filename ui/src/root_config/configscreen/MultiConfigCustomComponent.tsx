import {
  Field,
  FieldLabel,
  InstructionText,
  TextInput,
  ToggleSwitch,
} from "@contentstack/venus-components";
import React, { useEffect, useState } from "react";
import rootConfig from "..";

/**
 * Renders dynamic fields based on a configuration and input data.
 *
 * @param {Array} fields - An array of field names to render dynamically.
 * @param {Object} configurationObject - The configuration object containing field values.
 * @param {Object} serverConfigurationObject - The server-side sensitive configuration object containing field values.
 * @param {any} multiConfigurationDataID - An identifier used to access specific multi-configuration data.
 * @param {Function} customComponentOnChange - Callback function invoked on input field changes.
 *    - @param {Object} event - The change event from the input field.
 *    - @param {any} multiConfigID - The ID of the multi-configuration data being modified.
 *    - @param {boolean} isMultiConfig - A boolean indicating if the field is part of a multi-configuration setup.
 *
 * @returns {JSX.Element | null} - A React fragment containing rendered dynamic fields, or `null` if no fields are found.
 */
function renderDynamicFields(
  fields: any,
  configurationObject: any,
  serverConfigurationObject: any,
  multiConfigurationDataID: any,
  customComponentOnChange: (
    event: any,
    multiConfigID: any,
    isMultiConfig: boolean
  ) => void
) {
  const configInputFields = rootConfig?.configureConfigScreen?.();
  if (!configInputFields) {
    console.error("🚀 ~ renderDynamicFields ~ configInputFields is undefined!");
    return null;
  }

  const fieldsToRender = fields
    .map((fieldName: any) => configInputFields?.[fieldName])
    .filter((fieldConfig: any) => fieldConfig && fieldConfig?.isDynamic);

  return (
    <>
      {fieldsToRender.map((fieldConfig: any, index: number) => {
        const objKey = fields?.[index];
        if (!fieldConfig) return null;

        return (
          <div key={objKey} className="dynamic-field">
            <FieldLabel htmlFor={fields?.[index]}>
              {fieldConfig.labelText}
              {fieldConfig.required && <span style={{ color: "red" }}> *</span>}
            </FieldLabel>
            <TextInput
              type="text"
              name={objKey}
              id={objKey}
              placeholder={fieldConfig?.placeholderText}
              required={fieldConfig?.required}
              value={
                fieldConfig?.saveInServerConfig
                  ? serverConfigurationObject?.multi_config_keys?.[
                      multiConfigurationDataID
                    ]?.[objKey] || ""
                  : configurationObject?.multi_config_keys?.[
                      multiConfigurationDataID
                    ]?.[fields[index]] || ""
              }
              onChange={(e: any) =>
                customComponentOnChange(
                  e,
                  multiConfigurationDataID,
                  fieldConfig?.isMultiConfig
                )
              }
            />
            {fieldConfig?.instructionText && (
              <p>{fieldConfig?.instructionText}</p>
            )}
          </div>
        );
      })}
    </>
  );
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
