/* Import React modules */
import React, { useCallback, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
/* ContentStack Modules */
// For all the available venus components, please refer below doc
// https://venus-storybook.contentstack.com/?path=/docs/components-textinput--default
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
} from "@contentstack/venus-components";

/* eslint-disable */
/* Import our modules */
import rootConfig from "../../root_config";
import { isEmpty, mergeObjects } from "../../common/utils";
import { TypeAppSdkConfigState } from "../../common/types";
/* Import our CSS */
import "./styles.scss";
import localeTexts from "../../common/locale/en-us";

const ConfigScreen: React.FC = function () {
  // entire configuration object returned from configureConfigScreen
  const configInputFields = rootConfig?.configureConfigScreen?.();
  // config objs to be saved in configuration
  const saveInConfig: any = {};

  Object.keys(configInputFields)?.forEach((field: any) => {
    if (configInputFields?.[field]?.saveInConfig)
      saveInConfig[field] = configInputFields?.[field];
  });

  // state for configuration
  const [isCustom, setIsCustom] = useState(false);
  const [customKeys, setCustomKeys] = useState<any[]>(rootConfig.mandatoryKeys);
  const { iterations }: any = localeTexts.Decryption;
  const { keySize }: any = localeTexts.Decryption;
  const password = `password#123`;
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        page_count: "",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        is_custom_json: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        custom_keys: rootConfig.mandatoryKeys,
      },
      /* Use ServerConfiguration Only When Webhook is Enbaled */
      serverConfiguration: {},
    },
    setInstallationData: (): any => {},
    appSdkInitialized: false,
  });
  console.info("Config screen state", state);
  const isConfigSensitive = (name: string) => {
    let isSensitive = false;
    Object.keys(configInputFields)?.forEach((field: any) => {
      if (configInputFields?.[field]?.name === name) {
        isSensitive = configInputFields?.[field]?.isSensitive;
      }
    });
    return isSensitive;
  };

  const encryptData = (msg: any, pass: any) => {
    const salt = CryptoJS?.lib?.WordArray?.random(128 / 8);
    const key = CryptoJS?.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations,
    });

    const iv = CryptoJS?.lib?.WordArray?.random(128 / 8);

    const encrypted = CryptoJS?.AES?.encrypt(msg, key, {
      iv,
      padding: CryptoJS?.pad?.Pkcs7,
      mode: CryptoJS?.mode?.CBC,
    });

    // salt, iv will be hex 32 in length
    // append them to the ciphertext for use  in decryption
    const transitmessage =
      (salt?.toString() ?? "") +
      (iv?.toString() ?? "") +
      (encrypted?.toString() ?? "");
    return transitmessage;
  };

  const decryptData = (transitmessage: any, pass: any) => {
    const salt = CryptoJS?.enc?.Hex?.parse(transitmessage?.substr(0, 32));
    const iv = CryptoJS?.enc?.Hex?.parse(transitmessage?.substr(32, 32));
    const encrypted = transitmessage?.substring(64);

    const key = CryptoJS?.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations,
    });

    const decrypted = CryptoJS?.AES?.decrypt(encrypted, key, {
      iv,
      padding: CryptoJS?.pad?.Pkcs7,
      mode: CryptoJS?.mode?.CBC,
    });
    return decrypted?.toString(CryptoJS?.enc?.Utf8);
  };

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        console.info("App SDK Initialized", appSdk);
        const sdkConfigData = appSdk?.location?.AppConfigWidget?.installation;
        if (sdkConfigData) {
          const installationDataFromSDK =
            await sdkConfigData?.getInstallationData();
          const setInstallationDataOfSDK = sdkConfigData?.setInstallationData;
          let newObj: any;
          if (!isEmpty(installationDataFromSDK?.configuration)) {
            const configuration = Object.entries(
              installationDataFromSDK?.configuration
            )?.reduce((obj: any, [key, value]) => {
              // eslint-disable-next-line no-param-reassign
              obj[key] =
                // eslint-disable-next-line no-nested-ternary
                isConfigSensitive(key) ? decryptData(value, password) : value;
              return obj;
            }, {});

            newObj = { ...installationDataFromSDK, configuration };
          }
          const installationDataOfSdk = mergeObjects(
            state.installationData,
            newObj || installationDataFromSDK
          );
          setState({
            ...state,
            installationData: installationDataOfSdk,
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
    async (e: any) => {
      // eslint-disable-next-line prefer-const
      let { name: fieldName, value: fieldValue } = e?.target || {};
      if (typeof fieldValue === "string") {
        fieldValue = fieldValue?.trim();
      }

      const updatedConfig = state?.installationData?.configuration || {};
      if (
        configInputFields?.[fieldName]?.saveInConfig ||
        state?.installationData?.configuration
      ) {
        updatedConfig[fieldName] = fieldValue;
      }

      const newConfiguration = Object.entries(updatedConfig)?.reduce(
        (obj: any, [key, value]) => {
          // eslint-disable-next-line no-param-reassign
          obj[key] =
            /* eslint-disable */
            // prettier-ignore
            value !== ""
              ? ((isConfigSensitive(key))? encryptData(value, password)
                : value)
              : value;
          return obj;
        },
        {}
      );

      if (typeof state.setInstallationData !== "undefined") {
        await state.setInstallationData({
          ...state.installationData,
          configuration: newConfiguration,
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
      updateConfig(e);
    },
    [updateConfig]
  );

  const updateCustomJSON = useCallback((e: any) => {
    setIsCustom(e?.target?.id !== "wholeJSON");
  }, []);

  useEffect(() => {
    const e: any = {};
    e.target = { name: "is_custom_json", value: isCustom };
    updateConfig(e);
  }, [isCustom]);
  // return render jsx for the config object provided
  const renderConfig = () =>
    Object.entries(configInputFields)?.map(([objKey, objValue, index]: any) => {
      if (objValue?.type === "textInputFields") {
        return (
          <div key={`${objKey}_${index}`}>
            <Field>
              <FieldLabel
                required
                htmlFor={`${objKey}-id`}
                data-testid="text_label"
              >
                {" "}
                {/* Change the label caption as per your requirement */}
                {objValue?.labelText}
              </FieldLabel>
              {objValue?.helpText && (
                <Help text={objValue?.helpText} data-testid="text_help" />
              )}
              {/* Change the help caption as per your requirement */}
              <TextInput
                id={`${objKey}-id`}
                required
                value={
                  objValue?.saveInConfig
                    ? state?.installationData?.configuration?.[objKey]
                    : objValue?.saveInServerConfig
                    ? state?.installationData?.serverConfiguration?.[objKey]
                    : ""
                }
                placeholder={objValue?.placeholderText}
                name={objKey}
                onChange={updateConfig}
                data-testid="text_input"
              />
              <InstructionText data-testid="text_instruction">
                {objValue?.instructionText}
              </InstructionText>
            </Field>
            <Line type="dashed" />
          </div>
        );
      }
      return null;
    });

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
            <>
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
            </>
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

          <Field>
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
