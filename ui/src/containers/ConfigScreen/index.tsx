/* Import React modules */
/* eslint-disable */
import React, { useState, useEffect } from "react";
/* Import other node modules */
import {
  Form,
  Field,
  FieldLabel,
  Help,
  TextInput,
  InstructionText,
  Line,
  Radio,
  Select,
} from "@contentstack/venus-components";
import CryptoJS from "crypto-js";
// For all the available venus components, please refer below doc
// https://venus-storybook.contentstack.com/?path=/docs/components-textinput--default
import ContentstackAppSdk from "@contentstack/app-sdk";
/* Import our modules */
import localeTexts from "../../common/locale/en-us";
import { isEmpty, mergeObjects } from "../../common/utils";
import { TypeAppSdkConfigState } from "../../common/types";

/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
/* Import our CSS */
import "./styles.scss";
import rootConfig from "../../root_config";

const ConfigScreen: React.FC = function () {
  const [state, setState] = useState<TypeAppSdkConfigState>({
    installationData: {
      configuration: {
        /* Add all your config fields here */
        /* The key defined here should match with the name attribute
        given in the DOM that is being returned at last in this component */
        page_count: "",
        store_id: "",
        is_custom_json: false,
        custom_keys: [
          { label: "id", value: "id" },
          { label: "name", value: "name" },
        ],
        auth_token: "",
      },
      serverConfiguration: {
        
      },
    },
    setInstallationData: (): any => {
      /* this method 'setInstallationData' is empty */
    },
    appSdkInitialized: false,
  });
  const [isCustom, setIsCustom] = useState(false);
  const [customKeys, setCustomKeys] = useState<any[]>([
    { label: "id", value: "id" },
    { label: "name", value: "name" },
  ]);

  const { iterations }: any = localeTexts.Decryption;
  const { keySize }: any = localeTexts.Decryption;
  const password = `password#123`;

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
      salt?.toString() + iv?.toString() + encrypted?.toString();
    return transitmessage;
  };

  const decryptData = (transitmessage: any, pass: any, flag: string) => {
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
    if (flag === "checkIfAlreadyDecrypted") {
      return !!decrypted?.toString(CryptoJS?.enc?.Utf8);
    }
    return decrypted?.toString(CryptoJS?.enc?.Utf8);
  };

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const sdkConfigData = appSdk?.location?.AppConfigWidget?.installation;
        if (sdkConfigData) {
          const installationDataFromSDK =
            await sdkConfigData.getInstallationData();
          const setInstallationDataOfSDK = sdkConfigData.setInstallationData;

          let newObj: any;
          let installationDataOfSdk;
          if (!isEmpty(installationDataFromSDK?.configuration)) {
            const configuration = Object.entries(
              installationDataFromSDK?.configuration
            )?.reduce((obj: any, [key, value]) => {
              obj[key] =
                // eslint-disable-next-line no-nested-ternary
                key === "store_id" || key === "auth_token" ? decryptData(value, password, "checkIfAlreadyDecrypted") === true
                    ? decryptData(value, password, "")
                    : value
                  : value;
              return obj;
            }, {});

            newObj = { ...installationDataFromSDK, configuration };
          }

          // eslint-disable-next-line prefer-const
          installationDataOfSdk = mergeObjects(
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
      .catch((error) => {
        console.error("appSdk initialization error", error);
      });
  }, []);

  /** updateConfig - Function where you should update the state variable
   * Call this function whenever any field value is changed in the DOM
   * */
  const updateConfig = async (e: any) => {
    // eslint-disable-next-line prefer-const
    let { name: fieldName, value: fieldValue } = e.target;
    if (typeof fieldValue === "string") fieldValue = fieldValue.trim();
    const updatedConfig = state?.installationData?.configuration || {};
    // const updatedServerConfig = state?.installationData?.serverConfiguration;

    // if (fieldName === "auth_token") updatedServerConfig[fieldName] = fieldValue;
    updatedConfig[fieldName] = fieldValue;

    delete state?.installationData?.uiLocations;

    const newConfiguration = Object.entries(updatedConfig)?.reduce(
      (obj: any, [key, value]) => {
        obj[key] =
          /* eslint-disable */
          // prettier-ignore
          value !== ""
            ? ((key === "store_id" || key === "auth_token")? encryptData(value, password)
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
        // serverConfiguration: updatedServerConfig,
      });
    }

    return true;
  };

  const updateTypeObj = async (list: any[]) => {
    const customKeysTemp: any[] = [];
    list?.forEach((key: any) => customKeysTemp.push(key?.value));
    setCustomKeys(list);
    const e: any = {};
    e.target = { name: "custom_keys", value: list };
    updateConfig(e);
  };

  const updateCustomJSON = (e: any) => {
    setIsCustom(e?.target?.id !== "wholeJSON");
  };

  useEffect(() => {
    const e: any = {};
    e.target = { name: "is_custom_json", value: isCustom };
    updateConfig(e);
  }, [isCustom]);

  return (
    <div className="layout-container">
      <div className="page-wrapper">
        <Form className="config-wrapper">
          <Field>
          <div className="flex">
            <FieldLabel required htmlFor="store_id">
              {" "}
              {/* Change the label caption as per your requirement */}
              {rootConfig.ecommerceConfigFields.ConfigInfo.label}
            </FieldLabel>
            {/* Change the help caption as per your requirement */}
              <Help text={rootConfig.ecommerceConfigFields.ConfigInfo.help} />
            </div>
            <TextInput
              required
              value={state?.installationData?.configuration?.store_id}
              placeholder={rootConfig.ecommerceConfigFields.ConfigInfo.placeholder}
              name="store_id"
              data-testid="store_id-input"
              onChange={updateConfig}
            />
            <InstructionText>
              {rootConfig.ecommerceConfigFields.ConfigInfo.instruction}
            </InstructionText>
          </Field>

          <Line type="dashed" />

          <Field>
              <div className="flex">
              <FieldLabel required htmlFor="auth_token">
                {" "}
                {/* Change the label caption as per your requirement */}
                {rootConfig.ecommerceConfigFields.field2.label}
              </FieldLabel>
              {/* Change the help caption as per your requirement */}
            <Help text={rootConfig.ecommerceConfigFields.field2.help} />
            </div>
            <TextInput
              required
              value={state?.installationData?.configuration?.auth_token}
              placeholder={rootConfig.ecommerceConfigFields.field2.placeholder}
              name="auth_token"
              data-testid="auth_token-input"
              onChange={updateConfig}
            />
            <InstructionText>
              {rootConfig.ecommerceConfigFields.field2.instruction}
            </InstructionText>
          </Field>

          <Line type="dashed" />

          <Field className="json-field">
            <div className="flex">
              <FieldLabel required htmlFor="is_custom_json">
                {" "}
                {/* Change the label caption as per your requirement */}
                {localeTexts.configPage.saveInEntry.label}
              </FieldLabel>
              {/* Change the help caption as per your requirement */}
              <Help text={localeTexts.configPage.saveInEntry.help.replace('$', rootConfig.ecommerceEnv.APP_ENG_NAME)} />
            </div>
            <>
              <div className="Radio-wrapper">
                <Radio
                  id="wholeJSON"
                  checked={!isCustom}
                  required
                  label={
                    localeTexts.configPage.saveInEntry.wholeJson
                  }
                  name="is_custom_json"
                  value={false}
                  onChange={updateCustomJSON}
                />
                <Radio
                  className="custom-styles"
                  id="customJSON"
                  checked={isCustom}
                  required
                  label={
                    localeTexts.configPage.saveInEntry.customJson
                  }
                  name="is_custom_json"
                  value={true}
                  onChange={updateCustomJSON}
                />
              </div>
            </>
            <InstructionText>
              {localeTexts.configPage.saveInEntry.instruction}
            </InstructionText>

            {isCustom ? (
              <Field className="custom-keys">
                <div className="flex">
                  <FieldLabel required htmlFor="custom_keys">
                    {" "}
                    {/* Change the label caption as per your requirement */}
                    {localeTexts.configPage.customKeys.label.replace("$", rootConfig.ecommerceEnv.APP_ENG_NAME)}
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
              {rootConfig.ecommerceConfigFields.field3.label}
            </FieldLabel>
            {/* Change the help caption as per your requirement */}
            <TextInput
              required
              value={state?.installationData?.configuration?.page_count}
              placeholder={rootConfig.ecommerceConfigFields.field3.placeholder}
              name="page_count"
              data-testid="page_count-input"
              onChange={updateConfig}
            />
            <InstructionText>
              {rootConfig.ecommerceConfigFields.field3.instruction}
            </InstructionText>
          </Field>

          <Line type="dashed" />
        </Form>
      </div>
    </div>
  );
};

export default ConfigScreen;
