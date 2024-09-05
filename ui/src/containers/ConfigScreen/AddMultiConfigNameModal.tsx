import React, { useState } from "react";
import {
  ModalHeader,
  ModalBody,
  Field,
  FieldLabel,
  TextInput,
  ModalFooter,
  ButtonGroup,
  Button,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us";

interface AddMultiConfigurationModalProps {
  addMultiConfiguration: (config: any) => void;
  addMultiConfigurationData: any;
  isOpen: any;
  onRequestClose: any;
}

// eslint-disable-next-line react/function-component-definition
const AddMultiConfigurationModal: React.FC<AddMultiConfigurationModalProps> = (
  props
) => {
  const {
    addMultiConfiguration,
    addMultiConfigurationData,
    isOpen,
    onRequestClose,
  } = props;
  const [enteredConfigurationName, setEnteredConfigurationName] =    useState<any>("");
  const [hasDuplicateConfigurationName, setHasDuplicateConfigurationName] =    useState<boolean>(false);
  const [alphanumericIdentifier, setAlphanumericIdentifier] =    useState<any>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onInputChange = (e: any) => {
    const inputValue = e?.target?.value ?? "";
    const trimmedValue = inputValue;
    const regex = /^[a-zA-Z0-9-_]*$/;
    if (!regex.test(trimmedValue)) {
      // Input is invalid
      setAlphanumericIdentifier(true);
      setHasDuplicateConfigurationName(false);
    } else {
      setAlphanumericIdentifier(false);

      if (
        Object.keys(addMultiConfigurationData)?.length
        && trimmedValue !== "legacy_config"
      ) {
        const isDuplicate = Object.keys(addMultiConfigurationData)?.some(
          (addMultiConfigurationKeys: string) =>
            addMultiConfigurationKeys === trimmedValue
        );
        setHasDuplicateConfigurationName(isDuplicate);
      } else {
        setHasDuplicateConfigurationName(false);
      }
    }
    setEnteredConfigurationName(trimmedValue);
  };

  const onSaveConfiguration = () => {
    addMultiConfiguration(enteredConfigurationName);
    onRequestClose();
  };
  React.useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  return (
    // eslint-disable-next-line
    <>
      {isModalOpen && (
        <div className="ReactModalPortal">
          <div className="ReactModal__Overlay ReactModal__Overlay--after-open ReactModal__overlay-default flex-v-center">
            <div className="ReactModal__Content ReactModal__Content--after-open  ReactModal__Content--medium ">
              <ModalHeader
                title={
                  localeTexts.configPage.multiConfig.addConfigurationModal
                    .modalHeaderLabel
                }
                closeModal={onRequestClose}
                closeIconTestId="cs-default-header-close"
              />
              <ModalBody className="modalBodyCustomClass">
                <Field>
                  <FieldLabel required htmlFor="multiconfiglabel">
                    {" "}
                    {
                      localeTexts.configPage.multiConfig.addConfigurationModal
                        .multiConfigNameLabel
                    }
                  </FieldLabel>
                  <TextInput
                    required
                    placeholder={
                      localeTexts.configPage.multiConfig.addConfigurationModal
                        .multiConfigNameLabelPlaceHolder
                    }
                    name="multiConfigLabelName"
                    data-testid="multiconfiglabel-input"
                    onChange={onInputChange}
                    version="v2"
                  />
                  {alphanumericIdentifier ? (
                    <span className="errorcontainer">
                      {
                        localeTexts.configPage.multiConfig.ErrorMessage
                          .invalidAlphanumeric
                      }
                    </span>
                  ) : hasDuplicateConfigurationName ? (
                    <span className="errorcontainer">
                      {
                        localeTexts.configPage.multiConfig.ErrorMessage
                          .duplicateLabelError.msg
                      }
                    </span>
                  ) : enteredConfigurationName === "legacy_config" ? (
                    <span className="errorcontainer">
                      {
                        localeTexts.configPage.multiConfig.ErrorMessage
                          .oldV2KeysNameMsg
                      }
                    </span>
                  ) : (
                    ""
                  )}
                </Field>
              </ModalBody>
              <ModalFooter>
                <ButtonGroup>
                  <Button buttonType="light" onClick={() => onRequestClose()}>
                    Cancel
                  </Button>
                  <Button
                    onClick={onSaveConfiguration}
                    disabled={
                      !enteredConfigurationName
                      || hasDuplicateConfigurationName
                      || enteredConfigurationName === "legacy_config"
                    }
                  >
                    {
                      localeTexts.configPage.multiConfig.addConfigurationModal
                        .modalFooterButtonLabel
                    }
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddMultiConfigurationModal;
