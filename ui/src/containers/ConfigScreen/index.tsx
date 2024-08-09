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
import CryptoJS from "crypto-js";
/* Import our modules */
import rootConfig from "../../root_config";
import {
  mergeObjects,
  categorizeConfigFields,
  extractFieldsByConfigType,
  extractKeysForCustomApiValidation,
} from "../../common/utils";
import { TypeAppSdkConfigState, ValidationResult } from "../../common/types";
import AddMultiConfigurationModal from "./AddMultiConfigNameModal";
import { DeleteModalConfig } from "./DeleteModal";
/* Import our CSS */
import "./styles.scss";
import localeTexts from "../../common/locale/en-us";

const ConfigScreen: React.FC = function () {
  /* entire configuration object returned from configureConfigScreen */
  const configInputFields = rootConfig?.configureConfigScreen?.();
  /* Configuration objects to be saved */
  const saveInConfig: any = {};
  /* Configuration objects to be saved in serverConfiguration */
  const saveInServerConfig: any = {};
  const {
    multiConfigTrueAndApiValidationEnabled,
    multiConfigFalseAndApiValidationEnabled,
  } = extractKeysForCustomApiValidation(configInputFields);
  Object.keys(configInputFields)?.forEach((field: any) => {
    if (configInputFields?.[field]?.saveInConfig)
      saveInConfig[field] = configInputFields?.[field];
  });

  Object.keys(configInputFields)?.forEach((field: any) => {
    if (configInputFields?.[field]?.saveInServerConfig)
      saveInServerConfig[field] = configInputFields?.[field];
  });
  // Function to check if any key has isMultiConfig: true
   const hasMultiConfig = (config:any) => (
   Object.values(config)?.some((field:any) => field?.isMultiConfig === true)
   )

  // Determine if at least one key has isMultiConfig: true
  const shouldIncludeMultiConfig = hasMultiConfig(configInputFields);

  /* state for configuration */
  const [isCustom, setIsCustom] = useState(false);
  const [customKeys, setCustomKeys] = useState<any[]>(rootConfig.mandatoryKeys);
  const encryptionKey: any = process.env.ENCRYPTION_KEY;
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
        is_custom_json: false,
        ...(shouldIncludeMultiConfig ? { multi_config_keys: {} } : {}),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        custom_keys: rootConfig.mandatoryKeys,
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
        ...(shouldIncludeMultiConfig ? { multi_config_keys: {} } : {}),
      },
    },
    setInstallationData: (): any => {},
    appSdkInitialized: false,
  });
  const [sdkConfigDataState, setSdkConfigDataState] = useState<any>("");
  const [isModalOpen, setModalOpen] = useState(false);

  const addMultiConfig = async (inputValue: any) => {
    const accordionId = inputValue;
    const result = categorizeConfigFields(configInputFields);

    const updateInstallationData = (prevState: any) => ({
      ...prevState,
      installationData: {
        ...prevState?.installationData,
        configuration: {
          ...prevState?.installationData?.configuration,
          multi_config_keys: {
            ...prevState?.installationData?.configuration?.multi_config_keys,
            [accordionId]: result?.isMultiConfigAndSaveInConfig,
          },
        },
        serverConfiguration: {
          ...prevState?.installationData?.serverConfiguration,
          multi_config_keys: {
            ...prevState?.installationData?.serverConfiguration
              ?.multi_config_keys,
            [accordionId]: result?.isMultiConfigAndSaveInServerConfig,
          },
        },
      },
    });

    setState(updateInstallationData);
    state.setInstallationData(updateInstallationData(state));
  };
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const checkIsDefaultInitial = (configurationData: any) => {
    const { default_multi_config_key } = configurationData;
    if (default_multi_config_key === "") {
      return true;
    }
    return false;
  };

  const checkValidity = async (
    configurationData: { [x: string]: any; multi_config_keys?: any },
    serverConfiguration: { [x: string]: any; multi_config_keys?: any },
    validateMultiConfigKeysByApi: any,
    validateOtherKeysByApi: any
  ) => {
    const isEmptyValue = (value: any) => {
      if (typeof value === "string") {
        return value?.trim() === "";
      }
      if (Array.isArray(value)) {
        return value?.length === 0;
      }
      if (typeof value === "object" && value !== null) {
        return Object.keys(value)?.length === 0;
      }
      return false;
    };
  
    const checkMultiConfigKeys = (multiConfigKeys: any) => {
      const invalidKeys: any = {};

      Object.entries(multiConfigKeys || {})?.forEach(([configKey, config]) => {
        Object.entries(config || {})?.forEach(([key, value]) => {
          if (isEmptyValue(value)) {
            if (!invalidKeys[configKey]) {
              invalidKeys[configKey] = [];
            }
            invalidKeys?.[configKey]?.push(key);
          }
        });
      });
      return invalidKeys;
    };

    const checkOtherKeys = (keys: any) => {
      const invalidKeys: string[] = [];
      Object.entries(keys || {})?.forEach(([key, value]) => {
        if (key === "default_multi_config_key"||key==="multi_config_keys") return; 
        if (isEmptyValue(value)) {
          invalidKeys?.push(key);
        }
      });
      return invalidKeys;
    };

  const hasMultiConfigKeys = (data: any) => (
     Object.values(data)?.some((field: any) => field?.isMultiConfig === true)
  )

  const multiConfigKeysPresent = hasMultiConfigKeys(rootConfig?.configureConfigScreen())

  let normalInvalidKeys = {};
  let serverNormalInvalidKeys = {};

  if (multiConfigKeysPresent && !validateMultiConfigKeysByApi) {
    normalInvalidKeys = checkMultiConfigKeys(configurationData?.multi_config_keys);
    serverNormalInvalidKeys = checkMultiConfigKeys(serverConfiguration?.multi_config_keys);
  }

    const normalInvalidKeysList = [
      ...Object.entries(normalInvalidKeys)
        .filter(([keys]) => keys?.length)
        .map(([source, keys]) => ({ source, keys })),
      ...Object.entries(serverNormalInvalidKeys)
        .filter(([keys]) => keys?.length)
        .map(([source, keys]) => ({ source, keys })),
    ];

    let otherInvalidKeysList: { source: string; keys: any[] }[] = [];
    if (!validateOtherKeysByApi) {
      const otherInvalidKeys = checkOtherKeys(configurationData);
      const serverOtherInvalidKeys = checkOtherKeys(serverConfiguration);

      otherInvalidKeysList = [
        ...otherInvalidKeys.map((key) => ({
          source: "configurationData",
          keys: [key],
        })),
        ...serverOtherInvalidKeys.map((key) => ({
          source: "serverConfiguration",
          keys: [key],
        })),
      ];
    }

    if (validateMultiConfigKeysByApi || validateOtherKeysByApi) {
      const apiValidationResults = await rootConfig.validateConfigFilesByApi(
        configurationData,
        serverConfiguration,
        multiConfigTrueAndApiValidationEnabled,
        multiConfigFalseAndApiValidationEnabled
      );
      const apiInvalidKeysList = apiValidationResults?.invalidKeys;

      const allInvalidKeys = [
        ...normalInvalidKeysList,
        ...otherInvalidKeysList,
        ...apiInvalidKeysList,
      ];

      const isValid = allInvalidKeys?.length === 0;

      return { isValid, invalidKeys: allInvalidKeys };
    }
    // eslint-disable-next-line
    else {
      const allInvalidKeys = [
        ...normalInvalidKeysList,
        ...otherInvalidKeysList,
      ];
      const isValid = allInvalidKeys?.length === 0;

      return { isValid, invalidKeys: allInvalidKeys };
    }
  };

  React.useEffect(() => {
    if (sdkConfigDataState) {
      const validateConfig = async () => {
        const configScreen = rootConfig.configureConfigScreen();
        const { multiConfigFields } = extractFieldsByConfigType(configScreen);

        const { isValid, invalidKeys } = await checkValidity(
          state?.installationData?.configuration,
          state?.installationData?.serverConfiguration,
          multiConfigTrueAndApiValidationEnabled?.length > 0,
          multiConfigFalseAndApiValidationEnabled?.length > 0
        );

        const isDefaultKeyExist = multiConfigFields?.length
          ? checkIsDefaultInitial(state?.installationData?.configuration)
          : false;
        const isMultiConfigKeysEmpty = multiConfigFields?.length
          ? Object.keys(
              state?.installationData?.configuration?.multi_config_keys
            )?.length === 0
          : false;

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
        } else if (!isValid) {
          const uniqueInvalidKeysMap = new Map<string, Set<string>>();
        
          invalidKeys.forEach(({ source, keys }: any) => {
            if (!uniqueInvalidKeysMap?.has(source)) {
              uniqueInvalidKeysMap?.set(source, new Set<string>());
            }
            keys?.forEach((key: string) => uniqueInvalidKeysMap?.get(source)?.add(key));
          });
        
          const invalidKeysMessage = Array.from(uniqueInvalidKeysMap?.entries())
            ?.map(([source, keysSet]) => `${source}: ${Array.from(keysSet).join(", ")}`)
            ?.join(" | ");
        
          sdkConfigDataState.setValidity(false, {
            message: `${localeTexts?.configPage?.multiConfig?.ErrorMessage?.emptyConfigNotifyMsg}: ${invalidKeysMessage}`,
          });
        }else {
          sdkConfigDataState.setValidity(true);
        }
      };

      validateConfig();
    }
  }, [state?.installationData?.configuration, sdkConfigDataState]);

  const encrypt = (value: string): string => {
    try {
      return (
        CryptoJS?.AES?.encrypt(value, encryptionKey ?? "").toString() ?? value
      );
    } catch (e) {
      return value;
    }
  };

  const decrypt = (value: string): string => {
    try {
      const bytes = CryptoJS?.AES?.decrypt(value, encryptionKey ?? "");

      const decryptedValue = bytes?.toString(CryptoJS.enc.Utf8) ?? value;
      return decryptedValue;
    } catch (e) {
      return value;
    }
  };

  const encryptObject = (obj: any, config: any): any => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map((item) => encryptObject(item, config));
        // eslint-disable-next-line
      } else {
        const encryptedObj: any = {};
        Object.keys(obj).forEach((key) => {
          const keyConfig = config?.[key];

          if (keyConfig?.isConfidential && keyConfig?.saveInConfig) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
              encryptedObj[key] = encrypt(JSON.stringify(obj[key]));
            } else {
              encryptedObj[key] = encrypt(obj[key]);
            }
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            encryptedObj[key] = encryptObject(obj[key], config);
          } else {
            encryptedObj[key] = obj[key];
          }
        });
        return encryptedObj;
      }
    }
    return obj;
  };

  const decryptObject = (obj: any, config: any): any => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map((item) => decryptObject(item, config));
        // eslint-disable-next-line
      } else {
        const decryptedObj: any = {};
        Object.keys(obj).forEach((key) => {
          const keyConfig = config?.[key];

          if (keyConfig?.isConfidential && keyConfig?.saveInConfig) {
            if (typeof obj[key] === "string") {
              let decryptedValue = decrypt(obj[key]);
              try {
                decryptedValue = JSON.parse(decryptedValue);
              } catch (e) {
                console.error("error in decryptObject", e);
              }
              decryptedObj[key] = decryptedValue;
            } else {
              decryptedObj[key] = decryptObject(obj[key], config);
            }
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            decryptedObj[key] = decryptObject(obj[key], config);
          } else {
            decryptedObj[key] = obj[key];
          }
        });
        return decryptedObj;
      }
    }
    return obj;
  };

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk: any) => {
        const result = categorizeConfigFields(configInputFields);
        const sdkConfigData = appSdk?.location?.AppConfigWidget?.installation;
        setSdkConfigDataState(sdkConfigData);
        if (sdkConfigData) {
          const installationDataFromSDK =            await sdkConfigData?.getInstallationData();
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
            ...Object.keys(result?.isNotMultiConfigAndSaveInConfig),
          ];
          const combinedServerConfigurationKeys = [
            ...Object.keys(result?.isNotMultiConfigAndSaveInServerConfig),
          ];

          let updatedConfigurationObject: any = {};
          const setInstallationDataOfSDK = sdkConfigData?.setInstallationData;

          const installationDataOfSdk = mergeObjects(
            state?.installationData,
            installationDataFromSDK
          );
          const defaultMultiConfigKey =            installationDataOfSdk?.default_multi_config_key ?? "legacy_config";
          if(shouldIncludeMultiConfig){
          if (defaultMultiConfigKey === "legacy_config") {
            Object.keys(installationDataOfSdk?.configuration)?.forEach(
              (key) => {
                if (!keysToIncludeOrExclude.includes(key)) {
                  if (
                    Object.hasOwn(result?.isMultiConfigAndSaveInConfig, key)
                  ) {
                    newConfigurationObject.legacy_config[key] =                      installationDataOfSdk?.configuration?.multi_config_keys
                        ?.legacy_config?.[key] !== undefined
                        ? installationDataOfSdk?.configuration
                            ?.multi_config_keys?.legacy_config?.[key]
                        : installationDataOfSdk?.configuration?.[key];
                  }
                }
              }
            );

            Object.keys(installationDataOfSdk?.serverConfiguration)?.forEach(
              (key) => {
                if (!keysToIncludeOrExclude.includes(key)) {
                  if (
                    Object.hasOwn(
                      result?.isMultiConfigAndSaveInServerConfig,
                      key
                    )
                  ) {
                    newServerConfigurationObject.legacy_config[key] =                      installationDataOfSdk?.serverConfiguration
                        ?.multi_config_keys?.legacy_config?.[key] !== undefined
                        ? installationDataOfSdk?.serverConfiguration
                            ?.multi_config_keys?.legacy_config?.[key]
                        : installationDataOfSdk?.serverConfiguration?.[key];
                  }
                }
              }
            );

            const filteredConfiguration: any =              combinedConfigurationKeys?.reduce((acc: any, key: any) => {
                if (Object.hasOwn(installationDataOfSdk?.configuration, key)) {
                  acc[key] = installationDataOfSdk?.configuration?.[key];
                }
                return acc;
              }, {});

            const filteredServerConfiguration: any =              combinedServerConfigurationKeys?.reduce((acc: any, key: any) => {
                if (
                  Object.hasOwn(installationDataOfSdk?.serverConfiguration, key)
                ) {
                  acc[key] = installationDataOfSdk?.serverConfiguration?.[key];
                }
                return acc;
              }, {});

            const updatedMultiConfigKeys = {
              ...installationDataOfSdk?.configuration?.multi_config_keys,
              ...newConfigurationObject,
            };
            const updatedMultiConfigServerKeys = {
              ...installationDataOfSdk?.serverConfiguration?.multi_config_keys,
              ...newServerConfigurationObject,
            };
            updatedConfigurationObject = {
              configuration: filteredConfiguration,
              serverConfiguration: filteredServerConfiguration,
              webhooks: installationDataOfSdk?.webhooks,
              uiLocations: installationDataOfSdk?.uiLocations,
            };
            updatedConfigurationObject.configuration.multi_config_keys =              updatedMultiConfigKeys;
            updatedConfigurationObject.serverConfiguration.multi_config_keys =              updatedMultiConfigServerKeys;
          }
          if (
            Object.keys(
              updatedConfigurationObject?.configuration?.multi_config_keys
                ?.legacy_config
            ).every((key) => {
              const value =                updatedConfigurationObject?.configuration?.multi_config_keys
                  ?.legacy_config?.[key];
              return value === undefined || value === null || value === "";
            })
          ) {
            delete updatedConfigurationObject?.configuration?.multi_config_keys
              ?.legacy_config;
          }

          if (
            Object.keys(
              updatedConfigurationObject?.serverConfiguration?.multi_config_keys
                ?.legacy_config
            ).every((key) => {
              const value =                updatedConfigurationObject?.serverConfiguration
                  ?.multi_config_keys?.legacy_config[key];
              return value === undefined || value === null || value === "";
            })
          ) {
            delete updatedConfigurationObject?.serverConfiguration
              ?.multi_config_keys?.legacy_config;
          }
          if (Object.keys(updatedConfigurationObject)?.length) {
            const decryptedConfiguration = decryptObject(
              updatedConfigurationObject?.configuration || {},
              rootConfig?.configureConfigScreen()
            );
            const decryptedServerConfiguration = decryptObject(
              updatedConfigurationObject?.serverConfiguration || {},
              rootConfig?.configureConfigScreen()
            );
            updatedConfigurationObject.configuration = decryptedConfiguration;
            updatedConfigurationObject.serverConfiguration =              decryptedServerConfiguration;
          }
        }

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
      .catch((error: any) => {
        console.error(localeTexts.configPage.errorInADK, error);
      });
  }, []);

  /**
   * Updates the configuration and server configuration based on the event input.
   *
   * @param {Object} e - The event object consisting of the name and value of the fields.
   * @param {string | number} multiConfigID - The ID for multi-config, used when `isMultiConfig` is true.
   * @param {boolean} isMultiConfig - A boolean indicating whether the field is part of multi-config.
   * @return {Promise<boolean>} - Returns a promise that resolves to `true` when the update is complete.
   */
  const updateConfig = useCallback(
    async (e: any, multiConfigID: any, isMultiConfig: any) => {
      const { name: fieldName, value } = e?.target || {};
      let configuration = state?.installationData?.configuration || {};
      let serverConfiguration =        state?.installationData?.serverConfiguration || {};
      const fieldValue = typeof value === "string" ? value.trim() : value;

      if (isMultiConfig) {
        if (configInputFields?.[fieldName]?.saveInConfig) {
          configuration = {
            ...configuration,
            multi_config_keys: {
              ...configuration?.multi_config_keys,
              [multiConfigID]: {
                ...(configuration?.multi_config_keys?.[multiConfigID] || {}),
                [fieldName]: fieldValue,
              },
            },
          };
        } else {
          serverConfiguration = {
            ...serverConfiguration,
            multi_config_keys: {
              ...serverConfiguration?.multi_config_keys,
              [multiConfigID]: {
                ...(serverConfiguration?.multi_config_keys?.[multiConfigID]
                  || {}),
                [fieldName]: fieldValue,
              },
            },
          };
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

      // Encrypt values before setting them in appsdk
      const encryptedConfiguration = encryptObject(
        configuration,
        rootConfig.configureConfigScreen()
      );
      const encryptedServerConfiguration = encryptObject(
        serverConfiguration,
        rootConfig.configureConfigScreen()
      );
      

      if (state?.setInstallationData) {
        await state?.setInstallationData({
          ...state?.installationData,
          configuration: encryptedConfiguration,
          serverConfiguration: encryptedServerConfiguration,
        });
        setState((prevState) => ({
          ...prevState,
          installationData: {
            configuration: decryptObject(
              encryptedConfiguration,
              rootConfig.configureConfigScreen()
            ), // Use decrypted values for display
            serverConfiguration: decryptObject(
              encryptedServerConfiguration,
              rootConfig.configureConfigScreen()
            ), // Use decrypted values for display
          },
        }));
      }

      return true;
    },
    [state?.setInstallationData, state?.installationData]
  );

  const updateTypeObj = useCallback(
    async (list: any[]) => {
      const customKeysTemp: any[] = [];
      list?.forEach((key: any) => customKeysTemp?.push(key?.value));
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
      updatedConfigAccordions = {
        ...prevState?.installationData?.configuration?.multi_config_keys,
      };
      updatedServerConfigAccordions = {
        ...prevState?.installationData?.serverConfiguration?.multi_config_keys,
      };

      delete updatedConfigAccordions?.[id];
      delete updatedServerConfigAccordions?.[id];

      return {
        ...prevState,
        installationData: {
          ...prevState?.installationData,
          configuration: {
            ...prevState?.installationData?.configuration,
            multi_config_keys: updatedConfigAccordions,
            default_multi_config_key: "",
          },
          serverConfiguration: {
            ...prevState?.installationData?.serverConfiguration,
            multi_config_keys: updatedServerConfigAccordions,
          },
        },
      };
    });

    state.setInstallationData({
      ...state?.installationData,
      configuration: {
        ...state?.installationData?.configuration,
        multi_config_keys: updatedConfigAccordions,
        default_multi_config_key: "",
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

  /**
   * Handles changes for the custom component.
   *
   * @param {Object} event - The event object containing the name and value.
   * @param {any} multiConfigID - The ID of the multi configuration, should be present if multi config is true.
   * @param {boolean} isMultiConfig - Indicates whether multi config is enabled or not.
   */
  const customComponentOnChange = (
    event: { name: string; value: any },
    multiConfigID: any,
    isMultiConfig: boolean
  ) => {
    updateConfig(event, multiConfigID, isMultiConfig);
  };

  const renderConfig = () => {
    const configScreen = rootConfig?.configureConfigScreen();
    const { multiConfigFields, singleConfigFields } =      extractFieldsByConfigType(configScreen);
    return (
      <>
        {Boolean(multiConfigFields?.length) && (
          <>
            <div className="multi-config-wrapper">
              <Accordion
                version="v2"
                title={localeTexts.configPage.multiConfig.accordionLabel?.replace(
                  "$",
                  rootConfig.ecommerceEnv.APP_ENG_NAME
                )}
                renderExpanded
                accordionDataCount={
                  Object.keys(
                    state?.installationData?.configuration?.multi_config_keys
                      || {}
                  )?.length
                }
              >
                <p className="multi-config-wrapper__sublabel">
                  {localeTexts.configPage.multiConfig.accordionSubLabel?.replace(
                    "$",
                    rootConfig?.ecommerceEnv.APP_ENG_NAME
                  )}
                </p>
                {Boolean(
                  Object.keys(
                    state?.installationData?.configuration?.multi_config_keys
                  )?.length
                ) && (
                  <div className="multi-config-wrapper__subcontainer">
                    {Object.entries(
                      state?.installationData?.configuration?.multi_config_keys
                    )?.map(
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
                              },
                            ]}
                          >
                            {Object.entries(configInputFields)?.map(
                              ([objKey, objValue]: any) => {
                                if (
                                  objValue?.isMultiConfig
                                  && objValue?.type === "textInputFields"
                                ) {
                                  return (
                                    <div key={`${objKey}`}>
                                      <Field>
                                        <FieldLabel
                                          required
                                          htmlFor={`${objKey}-id`}
                                          data-testid="text_label"
                                          className="multi-config-wrapper__FieldLabel"
                                        >
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
                                            objValue?.isSensitive
                                              ? "password"
                                              : undefined
                                          }
                                          required
                                          value={
                                            objValue?.saveInConfig
                                              ? multiConfigurationData?.[objKey]
                                              : state?.installationData
                                                  ?.serverConfiguration
                                                  ?.multi_config_keys?.[
                                                  multiConfigurationID
                                                ]?.[objKey] || ""
                                          }
                                          placeholder={
                                            objValue?.placeholderText
                                          }
                                          name={objKey}
                                          onChange={(e: any) =>
                                            updateConfig(
                                              e,
                                              multiConfigurationID,
                                              objValue?.isMultiConfig
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

                            {Object.values(configInputFields)?.some(
                              (objValue: any) =>
                                objValue?.isMultiConfig
                                && objValue?.type !== "textInputFields"
                            ) && (
                              <Field key="customComponentField">
                                {rootConfig.customMultiConfigComponent(
                                  multiConfigurationID,
                                  state?.installationData?.configuration,
                                  state?.installationData?.serverConfiguration,
                                  customComponentOnChange
                                )}
                              </Field>
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

        {Boolean(singleConfigFields?.length) && (
          <div className="single-config-wrapper">
            {Object.entries(configInputFields)?.map(
              ([objKey, objValue]: any) => {
                if (objValue?.isMultiConfig === false) {
                  if (objValue?.type === "textInputFields") {
                    return (
                      <div key={`${objKey}`}>
                        <Field>
                          <FieldLabel
                            required
                            htmlFor={`${objKey}-id`}
                            data-testid="text_label"
                            className="multi-config-wrapper__FieldLabel"
                          >
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
                                : "text"
                            }
                            required
                            placeholder={objValue?.placeholderText}
                            name={objKey}
                            value={
                              objValue?.saveInConfig
                                ? state?.installationData?.configuration?.[
                                    objKey
                                  ]
                                : objValue?.saveInServerConfig
                                ? state?.installationData
                                    ?.serverConfiguration?.[objKey]
                                : ""
                            }
                            onChange={(e: any) =>
                              updateConfig(e, "", objValue?.isMultiConfig)
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
                  return (
                    <div key={objKey}>
                      {rootConfig.customNonMultiConfigComponent(
                        state?.installationData?.configuration,
                        state?.installationData?.serverConfiguration,
                        customComponentOnChange
                      )}
                    </div>
                  );
                }
                return null;
              }
            )}
          </div>
        )}
      </>
    );
  };
  return (
    <div className="layout-container">
      <div className="page-wrapper">
        <Form className="config-wrapper" data-testid="config-wrapper">
          {renderConfig()}

          <Field className="json-field">
            <div className="flex">
              <FieldLabel required htmlFor="is_custom_json">
                {localeTexts.configPage.saveInEntry.label}
              </FieldLabel>
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
                    {localeTexts.configPage.customKeys.label.replace(
                      "$",
                      rootConfig.ecommerceEnv.APP_ENG_NAME
                    )}
                  </FieldLabel>

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
        </Form>
      </div>
    </div>
  );
};

export default ConfigScreen;
