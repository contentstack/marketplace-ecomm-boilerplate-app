/* eslint-disable @typescript-eslint/naming-convention */
/* Import React modules */
import React, { useCallback, useEffect, useState } from "react";
/* ContentStack Modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import {
  Line,
  Field,
  FieldLabel,
  Help,
  Radio,
  InstructionText,
  Select,
  TextInput,
  Form,
  Accordion,
  Tooltip,
  Dropdown,
  Icon,
  Checkbox,
  Button,
  cbModal,
} from "@contentstack/venus-components";

/* Import our modules */
import rootConfig from "../../root_config";
import { mergeObjects } from "../../common/utils";
import { TypeAppSdkConfigState } from "../../common/types";
import AddMultiConfigurationModal from "./AddMultiConfigNameModal";
import { DeleteModalConfig } from "./DeleteModal";
/* Import our CSS */
import "./styles.scss";
import localeTexts from "../../common/locale/en-us";

const ConfigScreen: React.FC = function () {
  // entire configuration object  returned from configureConfigScreen
  const configInputFields = rootConfig?.configureConfigScreen?.();
  // config objs to be saved in configuration
  const saveInConfig: any = {};
  // config objs to be saved in serverConfiguration
  const saveInServerConfig: any = {};

  Object.keys(configInputFields)?.forEach((field: any) => {
    if (configInputFields?.[field]?.saveInConfig)
      saveInConfig[field] = configInputFields?.[field];
  });

  Object.keys(configInputFields)?.forEach((field: any) => {
    if (configInputFields?.[field]?.saveInServerConfig)
      saveInServerConfig[field] = configInputFields?.[field];
  });
  // state for configuration
  const [isCustom, setIsCustom] = useState(false);
  const [customKeys, setCustomKeys] = useState<any[]>(rootConfig.customKeys);
  const [state, setState] = React.useState<TypeAppSdkConfigState>({
    installationData: {
      configuration: {
        /* Add all your config fields here */
        /* The key defined here should match with the name attribute
        given in the DOM that is being returned at last in this component */
        ...Object.keys(saveInConfig)?.reduce((acc, value) => {
          if (saveInConfig?.[value]?.type === "textInputFields")
            return { ...acc, [value]: "" };
          return {
            ...acc,
            [value]: saveInConfig?.[value]?.defaultSelectedOption || "",
          };
        }, {}),
        page_count: "",
        is_custom_json: false,
        custom_keys: rootConfig.customKeys,
        multi_config_keys: {},
        default_multi_config_key: "",
      },
      /* Use ServerConfiguration Only When Webhook is Enbaled */
      serverConfiguration: {
        ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
          if (saveInServerConfig?.[value]?.type === "textInputFields")
            return { ...acc, [value]: "" };
          return {
            ...acc,
            [value]: saveInServerConfig?.[value]?.defaultSelectedOption || "",
          };
        }, {}),
        multi_config_keys: {},
      },
    },
    setInstallationData: (): any => {},
    appSdkInitialized: false,
  });
  const [sdkConfigDataState, setSdkConfigDataState] = useState<any>("");
  const [isModalOpen, setModalOpen] = useState(false);

  const categorizeConfigFields = (configFields: any) => {
    const isMultiConfigAndSaveInServerConfig: any = {};
    const isMultiConfigAndSaveInConfig: any = {};
    const isNotMultiConfigAndSaveInConfig: any = {};
    const isNotMultiConfigAndSaveInServerConfig: any = {};

    Object.keys(configFields).forEach((key) => {
      const field = configFields[key];
      if (field?.isMultiConfig) {
        if (field?.saveInServerConfig) {
          isMultiConfigAndSaveInServerConfig[key] = "";
        }
        if (field?.saveInConfig) {
          isMultiConfigAndSaveInConfig[key] = "";
        }
      } else {
        if (field?.saveInConfig) {
          isNotMultiConfigAndSaveInConfig[key] = "";
        }
        if (field?.saveInServerConfig) {
          isNotMultiConfigAndSaveInServerConfig[key] = "";
        }
      }
    });

    return {
      isMultiConfigAndSaveInServerConfig,
      isMultiConfigAndSaveInConfig,
      isNotMultiConfigAndSaveInConfig,
      isNotMultiConfigAndSaveInServerConfig,
    };
  };

  const addMultiConfig = async (inputValue: any) => {
    const accordionId = inputValue;
    const result = categorizeConfigFields(configInputFields);
    setState((prevState: any) => ({
      ...prevState,
      installationData: {
        ...prevState?.installationData,
        configuration: {
          ...prevState?.installationData?.configuration,
          multi_config_keys: {
            ...prevState?.installationData?.configuration?.multi_config_keys,
            [accordionId]: {
              ...result.isMultiConfigAndSaveInConfig,
            },
          },
        },
        serverConfiguration: {
          ...prevState?.installationData?.serverConfiguration,
          multi_config_keys: {
            ...prevState?.installationData?.serverConfiguration
              ?.multi_config_keys,
            [accordionId]: {
              ...result.isMultiConfigAndSaveInServerConfig,
            },
          },
        },
      },
    }));

    state.setInstallationData({
      ...state?.installationData,
      configuration: {
        ...state?.installationData?.configuration,
        multi_config_keys: {
          ...state?.installationData?.configuration?.multi_config_keys,
          [accordionId]: {
            ...result.isMultiConfigAndSaveInConfig,
          },
        },
      },
      serverConfiguration: {
        ...state?.installationData?.serverConfiguration,
        multi_config_keys: {
          ...state?.installationData?.serverConfiguration?.multi_config_keys,
          [accordionId]: {
            ...result.isMultiConfigAndSaveInServerConfig,
          },
        },
      },
    });
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  // Function to extract fields based on isMultiConfig
  const extractFieldsByConfigType = (configScreen: any) => {
    const multiConfigFields: string[] = [];
    const singleConfigFields: string[] = [];

    Object.entries(configScreen).forEach(([key, value]: any) => {
      if (value?.isMultiConfig) {
        multiConfigFields.push(key);
      } else {
        singleConfigFields.push(key);
      }
    });

    return { multiConfigFields, singleConfigFields };
  };
  const checkValidity = (configurationData: any, serverConfiguration: any) => {
    const checkMultiConfigKeys = (multiConfigKeys: any) => {
      const invalidKeys: { [key: string]: string[] } = {};

      Object.entries(multiConfigKeys || {}).forEach(([configKey, config]) => {
        Object.entries(config || {}).forEach(([key, value]) => {
          if (typeof value === "string" && value.trim() === "") {
            if (!invalidKeys[configKey]) {
              invalidKeys[configKey] = [];
            }
            invalidKeys[configKey].push(key);
          }
        });
      });

      return invalidKeys;
    };

    const configInvalidKeys = checkMultiConfigKeys(
      configurationData?.multi_config_keys
    );
    const serverInvalidKeys = checkMultiConfigKeys(
      serverConfiguration?.multi_config_keys
    );

    const invalidKeys: { source: string; keys: string[] }[] = [
      ...Object.entries(configInvalidKeys)
        .filter(([keys]) => keys.length > 0)
        .map(([source, keys]) => ({ source, keys })),
      ...Object.entries(serverInvalidKeys)
        .filter(([keys]) => keys.length > 0)
        .map(([source, keys]) => ({ source, keys })),
    ];

    const isValid = invalidKeys.length === 0;

    return { isValid, invalidKeys };
  };

  const checkIsDefaultInitial = (configurationData: any) => {
    const { default_multi_config_key } = configurationData;
    if (default_multi_config_key === "") {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    // console.info("state?.installation?.Data",state?.installationData)
    if (sdkConfigDataState) {
      const isValid = checkValidity(
        state?.installationData?.configuration,
        state?.installationData?.serverConfiguration
      );
      // console.info("isValid", isValid)
      const isDefaultKeyExist = checkIsDefaultInitial(
        state?.installationData?.configuration
      );
      const isMultiConfigKeysEmpty =        Object.keys(state?.installationData?.configuration.multi_config_keys)
          .length === 0;

      if (isMultiConfigKeysEmpty) {
        sdkConfigDataState.setValidity(false, {
          message:
            localeTexts.configPage.multiConfig.ErrorMessage.validInputMsg,
        });
      } else if (isDefaultKeyExist === true) {
        sdkConfigDataState.setValidity(false, {
          message:
            localeTexts.configPage.multiConfig.ErrorMessage.oneDefaultMsg,
        });
      } else if (!isValid.isValid) {
        // Extract invalid keys and ensure uniqueness using a Set
        const invalidKeys = Array.from(
          new Set(isValid.invalidKeys.map(({ source }) => source))
        );

        sdkConfigDataState.setValidity(false, {
          message: `${
            localeTexts.configPage.multiConfig.ErrorMessage.emptyConfigNotifyMsg
          }: ${invalidKeys.join(", ")}`,
        });
      } else {
        sdkConfigDataState.setValidity(true);
      }
    }
  }, [state?.installationData?.configuration, sdkConfigDataState]);

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk: any) => {
        console.info("appskd", appSdk);
        const result = categorizeConfigFields(configInputFields);
        const sdkConfigData = appSdk?.location?.AppConfigWidget?.installation;
        setSdkConfigDataState(sdkConfigData);
        if (sdkConfigData) {
          const installationDataFromSDK =            await sdkConfigData?.getInstallationData();
          //  console.info("installationDataFromSDK",installationDataFromSDK)
          // Existing User
          // console.info("defaultMultiConfigKey",defaultMultiConfigKey)
          const keysToIncludeOrExclude = [
            "custom_keys",
            "multi_config_keys",
            "default_multi_config_key",
            "is_custom_json",
            "page_count",
          ];
          const newConfigurationObject: any = {
            legacy_config: {},
          };
          const newServerConfigurationObject: any = {
            legacy_config: {},
          };
          const combinedConfigurationKeys = [
            ...keysToIncludeOrExclude,
            ...Object.keys(result.isNotMultiConfigAndSaveInConfig),
          ];
          const combinedServerConfigurationKeys = [
            ...Object.keys(result.isNotMultiConfigAndSaveInServerConfig),
          ];

          let updatedConfigurationObject: any = {};
          // console.info("installationDataFromSDK",installationDataFromSDK)
          const setInstallationDataOfSDK = sdkConfigData?.setInstallationData;

          const installationDataOfSdk = mergeObjects(
            state.installationData,
            installationDataFromSDK
          );
          // console.info("installationDataOfSdk mergeObjects",installationDataOfSdk)
          const defaultMultiConfigKey =            installationDataOfSdk.default_multi_config_key ?? "legacy_config";
          if (defaultMultiConfigKey === "legacy_config") {
            // console.info("defaultMultiConfigKey",defaultMultiConfigKey)
            Object.keys(installationDataOfSdk.configuration).forEach((key) => {
              if (!keysToIncludeOrExclude.includes(key)) {
                if (
                  Object.prototype.hasOwnProperty.call(
                    result.isMultiConfigAndSaveInConfig,
                    key
                  )
                ) {
                  newConfigurationObject.legacy_config[key] =                    installationDataOfSdk.configuration?.multi_config_keys
                      ?.legacy_config?.[key] !== undefined
                      ? installationDataOfSdk.configuration.multi_config_keys
                          .legacy_config[key]
                      : installationDataOfSdk.configuration[key];
                }
              }
            });

            // console.info("newConfigurationObject",newConfigurationObject)

            Object.keys(installationDataOfSdk.serverConfiguration).forEach(
              (key) => {
                if (!keysToIncludeOrExclude.includes(key)) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      result.isMultiConfigAndSaveInServerConfig,
                      key
                    )
                  ) {
                    newServerConfigurationObject.legacy_config[key] =                      installationDataOfSdk.serverConfiguration
                        ?.multi_config_keys?.legacy_config?.[key] !== undefined
                        ? installationDataOfSdk.serverConfiguration
                            .multi_config_keys.legacy_config[key]
                        : installationDataOfSdk.serverConfiguration[key];
                  }
                }
              }
            );
            // console.info("newServerConfigurationObject",newServerConfigurationObject)

            // Filter configuration
            const filteredConfiguration: any = combinedConfigurationKeys.reduce(
              (acc: any, key: any) => {
                if (
                  Object.prototype.hasOwnProperty.call(
                    installationDataOfSdk.configuration,
                    key
                  )
                ) {
                  acc[key] = installationDataOfSdk.configuration[key];
                }
                return acc;
              },
              {}
            );

            // Filter server configuration
            const filteredServerConfiguration: any =              combinedServerConfigurationKeys.reduce((acc: any, key: any) => {
                if (
                  Object.prototype.hasOwnProperty.call(
                    installationDataOfSdk.serverConfiguration,
                    key
                  )
                ) {
                  acc[key] = installationDataOfSdk.serverConfiguration[key];
                }
                return acc;
              }, {});

            const updatedMultiConfigKeys = {
              ...installationDataOfSdk.configuration.multi_config_keys,
              ...newConfigurationObject,
            };
            const updatedMultiConfigServerKeys = {
              ...installationDataOfSdk.serverConfiguration.multi_config_keys,
              ...newServerConfigurationObject,
            };
            updatedConfigurationObject = {
              configuration: filteredConfiguration,
              serverConfiguration: filteredServerConfiguration,
              webhooks: installationDataOfSdk.webhooks,
              uiLocations: installationDataOfSdk.uiLocations,
            };
            updatedConfigurationObject.configuration.multi_config_keys =              updatedMultiConfigKeys;
            updatedConfigurationObject.serverConfiguration.multi_config_keys =              updatedMultiConfigServerKeys;
          }
          // Remove legacy_config if all keys inside are empty
          if (
            Object.keys(
              updatedConfigurationObject.configuration.multi_config_keys
                .legacy_config
            ).every((key) => {
              const value =                updatedConfigurationObject.configuration.multi_config_keys
                  .legacy_config[key];
              return value === undefined || value === null || value === "";
            })
          ) {
            delete updatedConfigurationObject.configuration.multi_config_keys
              .legacy_config;
          }

          if (
            Object.keys(
              updatedConfigurationObject.serverConfiguration.multi_config_keys
                .legacy_config
            ).every((key) => {
              const value =                updatedConfigurationObject.serverConfiguration.multi_config_keys
                  .legacy_config[key];
              return value === undefined || value === null || value === "";
            })
          ) {
            delete updatedConfigurationObject.serverConfiguration
              .multi_config_keys.legacy_config;
          }

          //  console.info("updatedConfigurationObject",updatedConfigurationObject)
          //  console.info("installationDataOfSdk",installationDataOfSdk)
          setState({
            ...state,
            installationData: Object.keys(updatedConfigurationObject)?.length
              ? updatedConfigurationObject
              : installationDataOfSdk,
            setInstallationData: setInstallationDataOfSDK,
            appSdkInitialized: true,
          });
          setIsCustom(state?.installationData?.configuration?.is_custom_json);
          setCustomKeys(state?.installationData?.configuration?.custom_keys);
        }
      })
      .catch(() => {
        console.error(localeTexts.configPage.errorInADK);
      });
  }, []);

  /** updateConfig - Function where you should update the State variable
   * Call this function whenever any field value is changed in the DOM
   * */
  const updateConfig = useCallback(
    async (e: any, multiConfigID: any, isMultiConfig: any) => {
      // console.info("e",e)
      const { name: fieldName, value } = e?.target || {};
      let configuration = state?.installationData?.configuration || {};
      let serverConfiguration =        state?.installationData?.serverConfiguration || {};
      const fieldValue = typeof value === "string" ? value.trim() : value;

      if (isMultiConfig) {
        if (configInputFields[fieldName]?.saveInConfig) {
          configuration = {
            ...configuration,
            multi_config_keys: {
              ...configuration.multi_config_keys,
              [multiConfigID]: {
                ...(configuration.multi_config_keys?.[multiConfigID] || {}),
                [fieldName]: fieldValue,
              },
            },
          };
        } else {
          serverConfiguration = {
            ...serverConfiguration,
            multi_config_keys: {
              ...serverConfiguration.multi_config_keys,
              [multiConfigID]: {
                ...(serverConfiguration.multi_config_keys?.[multiConfigID]
                  || {}),
                [fieldName]: fieldValue,
              },
            },
          };
          // console.info("serverConfiguration",serverConfiguration)
        }
      } else {
        if (fieldName === "is_custom_json") {
          configuration = {
            ...configuration,
            [fieldName]: fieldValue,
          };
        }
        if (configInputFields?.[fieldName]?.saveInConfig) {
          configuration = {
            ...configuration,
            [fieldName]: fieldValue,
          };
        }
        if (configInputFields?.[fieldName]?.saveInServerConfig) {
          serverConfiguration = {
            ...serverConfiguration,
            [fieldName]: fieldValue,
          };
        }
      }

      // Update the state with the new configuration and server configuration
      if (state?.setInstallationData) {
        await state.setInstallationData({
          ...state?.installationData,
          configuration,
          serverConfiguration,
        });

        setState({
          ...state,
          installationData: {
            configuration: {
              ...state?.installationData?.configuration,
              ...configuration,
            },
            serverConfiguration: {
              ...state?.installationData?.serverConfiguration,
              ...serverConfiguration,
            },
          },
        });
      }

      return true;
    },
    [state.setInstallationData, state.installationData]
  );

  const updateTypeObj = useCallback(
    async (list: any[]) => {
      const customKeysTemp: any[] = [];
      list?.forEach((key: any) => customKeysTemp.push(key?.value));
      setCustomKeys(list);
      const e: any = {};
      e.target = { name: "custom_keys", value: list };
      updateConfig(e, "", false);
    },
    [updateConfig]
  );

  const updateCustomJSON = useCallback((e: any) => {
    setIsCustom(e?.target?.id !== "wholeJSON");
  }, []);

  const setAsDefaultAccordion = (accordionId: any) => {
    setState((prevState: any) => {
      const newDefaultMultiConfig = accordionId;
      state.setInstallationData({
        ...state?.installationData,
        configuration: {
          ...state?.installationData?.configuration,
          default_multi_config_key: newDefaultMultiConfig,
        },
      });
      return {
        ...prevState,
        installationData: {
          ...prevState?.installationData,
          configuration: {
            ...prevState?.installationData?.configuration,
            default_multi_config_key: newDefaultMultiConfig,
          },
        },
      };
    });
  };

  useEffect(() => {
    const e: any = {};
    e.target = { name: "is_custom_json", value: isCustom };
    updateConfig(e, "", false);
  }, [isCustom]);

  const unsetAsDefaultAccordion = () => {
    setState((prevState: any) => {
      state.setInstallationData({
        ...state?.installationData,
        configuration: {
          ...state?.installationData?.configuration,
          default_multi_config_key: "",
        },
      });
      return {
        ...prevState,
        installationData: {
          ...prevState?.installationData,
          configuration: {
            ...prevState?.installationData?.configuration,
            default_multi_config_key: "",
          },
        },
      };
    });
  };

  const handleCheckboxChange = (e: any, multiConfigurationID: any) => {
    const isChecked = e?.target?.checked;

    if (isChecked) {
      setAsDefaultAccordion(multiConfigurationID);
    } else {
      unsetAsDefaultAccordion();
    }
  };
  const removeAccordion = (id: number) => {
    let updatedConfigAccordions: any;
    let updatedServerConfigAccordions: any;

    setState((prevState: any) => {
      // Create copies of multi_config_keys to update
      updatedConfigAccordions = {
        ...prevState?.installationData?.configuration?.multi_config_keys,
      };
      updatedServerConfigAccordions = {
        ...prevState?.installationData?.serverConfiguration?.multi_config_keys,
      };

      // Remove the specified id from both configuration and serverConfiguration
      delete updatedConfigAccordions[id];
      delete updatedServerConfigAccordions[id];

      // Update the state
      return {
        ...prevState,
        installationData: {
          ...prevState?.installationData,
          configuration: {
            ...prevState?.installationData?.configuration,
            multi_config_keys: updatedConfigAccordions,
            default_multi_config_key: "", // Reset default_multi_config_key if needed
          },
          serverConfiguration: {
            ...prevState?.installationData?.serverConfiguration,
            multi_config_keys: updatedServerConfigAccordions,
          },
        },
      };
    });

    // Update state using setInstallationData
    state.setInstallationData({
      ...state?.installationData,
      configuration: {
        ...state?.installationData?.configuration,
        multi_config_keys: updatedConfigAccordions,
        default_multi_config_key: "", // Reset default_multi_config_key if needed
      },
      serverConfiguration: {
        ...state?.installationData?.serverConfiguration,
        multi_config_keys: updatedServerConfigAccordions,
      },
    });
  };

  const handleClickDeleteModal = (multiConfigurationID: any) => {
    cbModal({
      // eslint-disable-next-line react/no-unstable-nested-components
      component: (props: any) => (
        <DeleteModalConfig
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          removeAccordion={() => removeAccordion(multiConfigurationID)}
          multiConfigLabelName={multiConfigurationID}
        />
      ),
      testId: "cs-modal-storybook",
    });
  };
  const renderConfig = () => {
    const configScreen = rootConfig.configureConfigScreen();
    const { multiConfigFields, singleConfigFields } =      extractFieldsByConfigType(configScreen);
    return (
      <>
        {multiConfigFields?.length > 0 && (
          <>
            <div className="multi-config-wrapper">
              <Accordion
                version="v2"
                title={localeTexts.configPage.multiConfig.accordionLabel}
                renderExpanded
                accordionDataCount={
                  Object.keys(
                    state?.installationData?.configuration?.multi_config_keys
                      || {}
                  ).length
                }
              >
                <p className="multi-config-wrapper__sublabel">
                  {localeTexts.configPage.multiConfig.accordionSubLabel}
                </p>
                {Object.keys(
                  state.installationData.configuration.multi_config_keys
                )?.length > 0 ? (
                  <div className="multi-config-wrapper__subcontainer">
                    {Object.entries(
                      state.installationData.configuration.multi_config_keys
                    ).map(
                      ([multiConfigurationID, multiConfigurationData]: any) => (
                        <div
                          className="multi-config-wrapper__configblock"
                          key={multiConfigurationID}
                        >
                          <Accordion
                            dashedLineVisibility="hover"
                            errorMessage=""
                            renderExpanded
                            isContainerization
                            version="v2"
                            title={
                              <Tooltip
                                content={multiConfigurationID}
                                position="right"
                              >
                                <div>
                                  {multiConfigurationID?.length > 35
                                    ? `${multiConfigurationID?.substring(
                                        0,
                                        35
                                      )}...`
                                    : multiConfigurationID}
                                  {state?.installationData?.configuration
                                    ?.default_multi_config_key
                                    === multiConfigurationID && (
                                    <span className="default-label">
                                      Default
                                    </span>
                                  )}
                                </div>
                              </Tooltip>
                            }
                            actions={[
                              {
                                actionClassName: "font-color-tertiary",
                                component: (
                                  <div className="Dropdown-wrapper">
                                    <Dropdown
                                      list={[
                                        {
                                          label: (
                                            <>
                                              <Icon
                                                icon="Delete"
                                                size="extraSmall"
                                              />
                                              <div>
                                                {
                                                  localeTexts.configPage
                                                    .multiConfig
                                                    .deleteButtonText
                                                }
                                              </div>
                                            </>
                                          ),
                                          action: () =>
                                            handleClickDeleteModal(
                                              multiConfigurationID
                                            ),
                                        },
                                        {
                                          label: (
                                            <>
                                              <Icon
                                                icon="CheckCircleDark"
                                                size="extraSmall"
                                                version="v2"
                                              />
                                              <div>
                                                {
                                                  localeTexts.configPage
                                                    .multiConfig.setDefaultText
                                                }
                                              </div>
                                            </>
                                          ),
                                          action: () =>
                                            setAsDefaultAccordion(
                                              multiConfigurationID
                                            ),
                                        },
                                      ]}
                                      type="click"
                                      withIcon
                                    >
                                      <Icon
                                        icon="DotsThreeLargeVertical"
                                        size="medium"
                                        version="v2"
                                      />
                                    </Dropdown>
                                  </div>
                                ),
                                onClick: () => {},
                                // setDropdownVisible(!isDropdownVisible),
                              },
                            ]}
                          >
                            {Object.entries(configInputFields)?.map(
                              ([objKey, objValue, index]: any) => {
                                if (
                                  objValue?.isMultiConfig
                                  && objValue?.type === "textInputFields"
                                ) {
                                  return (
                                    <div key={`${objKey}_${index}`}>
                                      <Field>
                                        <FieldLabel
                                          required
                                          htmlFor={`${objKey}-id`}
                                          data-testid="text_label"
                                          className="multi-config-wrapper__FieldLabel"
                                        >
                                          {" "}
                                          {objValue?.labelText}
                                        </FieldLabel>
                                        {objValue?.helpText && (
                                          <Help
                                            text={objValue?.helpText}
                                            data-testid="text_help"
                                          />
                                        )}
                                        <TextInput
                                          id={`${objKey}-id`}
                                          type={
                                            objValue?.isSensitive === true
                                              ? "password"
                                              : undefined
                                          }
                                          required
                                          value={
                                            objValue?.isMultiConfig
                                              ? objValue?.saveInConfig
                                                ? multiConfigurationData[objKey]
                                                : state?.installationData
                                                    ?.serverConfiguration
                                                    ?.multi_config_keys?.[
                                                    multiConfigurationID
                                                  ]?.[objKey]
                                              : ""
                                          }
                                          placeholder={
                                            objValue?.placeholderText
                                          }
                                          name={objKey}
                                          onChange={(e: any) =>
                                            updateConfig(
                                              e,
                                              multiConfigurationID,
                                              objValue.isMultiConfig
                                            )
                                          }
                                          data-testid="text_input"
                                          version="v2"
                                        />
                                        <InstructionText data-testid="text_instruction">
                                          {objValue?.instructionText}
                                        </InstructionText>
                                      </Field>
                                    </div>
                                  );
                                }
                                return null;
                              }
                            )}

                            <div className="multi-config-wrapper__configblock__checkbox">
                              <Field>
                                <Checkbox
                                  label={
                                    localeTexts.configPage.multiConfig
                                      .multiConfigCheckBoxLabel
                                  }
                                  checked={
                                    state?.installationData?.configuration
                                      ?.default_multi_config_key
                                    === multiConfigurationID
                                  }
                                  onClick={(e: any) =>
                                    handleCheckboxChange(
                                      e,
                                      multiConfigurationID
                                    )
                                  }
                                />
                              </Field>
                            </div>
                          </Accordion>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p>No multi config keys available</p>
                )}
              </Accordion>
              <Button
                className="multi-config-button"
                buttonType="secondary"
                icon="AddPlusBold"
                size="medium"
                onClick={openModal}
              >
                {localeTexts.configPage.multiConfig.buttonLabel}
              </Button>
            </div>
            <AddMultiConfigurationModal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              addMultiConfiguration={addMultiConfig}
              addMultiConfigurationData={
                state?.installationData?.configuration?.multi_config_keys
              }
            />
          </>
        )}

        {singleConfigFields?.length > 0 && ""}
      </>
    );
  };

  /* If need to get any data from API then use,
  getDataFromAPI({queryParams, headers, method, body}) function.
  Refer services/index.ts for more details and update the API
  call there as per requirement. */

  return (
    <div className="layout-container">
      <div className="page-wrapper">
        <Form className="config-wrapper" data-testid="config-wrapper">
          {renderConfig()}

          <Field className="json-field">
            <div className="flex">
              <FieldLabel required htmlFor="is_custom_json">
                {" "}
                {/* Change the label caption as per your requirement */}
                {localeTexts.configPage.saveInEntry.label}
              </FieldLabel>
              {/* Change the help caption as per your requirement */}
              <Help
                text={localeTexts.configPage.saveInEntry.help.replace(
                  "$",
                  rootConfig.ecommerceEnv.APP_ENG_NAME
                )}
              />
            </div>
            <div className="Radio-wrapper">
              <Radio
                id="wholeJSON"
                checked={!isCustom}
                required
                label={localeTexts.configPage.saveInEntry.wholeJson}
                name={localeTexts.configPage.saveInEntry.customJson}
                value={false}
                onChange={updateCustomJSON}
              />
              <Radio
                className="custom-styles"
                id="customJSON"
                checked={isCustom}
                required
                label={localeTexts.configPage.saveInEntry.customJson}
                name={localeTexts.configPage.saveInEntry.customJson}
                value
                onChange={updateCustomJSON}
              />
            </div>
            <InstructionText>
              {localeTexts.configPage.saveInEntry.instruction1}
              <a
                href={localeTexts.configPage.saveInEntry.url}
                target="_blank"
                rel="noreferrer"
              >
                {localeTexts.configPage.saveInEntry.link}
              </a>
              {localeTexts.configPage.saveInEntry.instruction2}
            </InstructionText>

            {isCustom ? (
              <Field className="custom-keys">
                <div className="flex">
                  <FieldLabel required htmlFor="custom_keys">
                    {" "}
                    {/* Change the label caption as per your requirement */}
                    {localeTexts.configPage.customKeys.label.replace(
                      "$",
                      rootConfig.ecommerceEnv.APP_ENG_NAME
                    )}
                  </FieldLabel>
                  {/* Change the help caption as per your requirement */}
                  <Help text={localeTexts.configPage.customKeys.help} />
                </div>
                <Select
                  options={rootConfig.getCustomKeys()}
                  onChange={updateTypeObj}
                  value={customKeys}
                  isMulti
                  isSearchable
                />
              </Field>
            ) : (
              ""
            )}
          </Field>

          <Line type="dashed" />

          <Field className="page_count">
            <FieldLabel required htmlFor="page_count">
              {" "}
              {/* Change the label caption as per your requirement */}
              {localeTexts.configPage.pageCount.label}
            </FieldLabel>
            {/* Change the help caption as per your requirement */}
            <TextInput
              required
              value={state?.installationData?.configuration?.page_count}
              placeholder={localeTexts.configPage.pageCount.placeholder}
              name={localeTexts.configPage.pageCount.name}
              data-testid="page_count-input"
              onChange={updateConfig}
            />
            <InstructionText>
              {localeTexts.configPage.pageCount.instruction}
            </InstructionText>
          </Field>
        </Form>
      </div>
    </div>
  );
};

export default ConfigScreen;
