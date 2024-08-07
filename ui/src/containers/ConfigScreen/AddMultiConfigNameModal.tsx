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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onInputChange = (e: any) => {
    const trimmedValue = e?.target?.value?.trim();
    setEnteredConfigurationName(trimmedValue);

    if (
      Object.keys(addMultiConfigurationData)?.length
      && trimmedValue !== "shopifystore"
    ) {
      const isDuplicate = Object.keys(addMultiConfigurationData)?.some(
        (addMultiConfigurationKeys: string) =>
          addMultiConfigurationKeys === trimmedValue
      );
      setHasDuplicateConfigurationName(isDuplicate);
    }
    setEnteredConfigurationName(e?.target?.value?.trim());
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
                  {hasDuplicateConfigurationName
                  || enteredConfigurationName === "legacy_config" ? (
                    <span className="errorcontainer">
                      {enteredConfigurationName === "legacy_config"
                        ? localeTexts.configPage.multiConfig.ErrorMessage
                            .oldV2KeysNameMsg
                        : localeTexts.configPage.multiConfig.ErrorMessage
                            .duplicateLabelError.msg}
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
