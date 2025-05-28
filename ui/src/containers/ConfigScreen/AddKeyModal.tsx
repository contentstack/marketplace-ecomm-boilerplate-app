import React, { useCallback, useState } from "react";
import {
  ModalHeader,
  ModalBody,
  FieldLabel,
  Help,
  TextInput,
  InstructionText,
  ModalFooter,
  ButtonGroup,
  Button,
  Icon,
  Notification,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us/index";
import rootConfig from "../../root_config";

const toastMessage = ({ text }: any) => {
  Notification({
    notificationContent: { text },
    notificationProps: {
      hideProgressBar: true,
    },
    type: "success",
  });
};
const inputLengthLimit = 100;
const checkModalValue = ({ modalValue, customOptions }: any) => {
  let returnValue: any = {};
  const trimmedModalValue: any = modalValue?.trim();
  const matchValue = customOptions?.find(
    (i: any) => i?.value === trimmedModalValue
  );
  if (matchValue === undefined) {
    returnValue = [
      {
        label: trimmedModalValue,
        value: trimmedModalValue,
        searchLabel: trimmedModalValue,
      },
    ];
  } else {
    Notification({
      displayContent: {
        error: {
          error_message: `${localeTexts.configPage.customWholeJson.notification.errorS} "${trimmedModalValue}" ${localeTexts.configPage.customWholeJson.notification.errorE}`,
        },
      },
      notifyProps: {
        hideProgressBar: false,
        className: "modal_toast_message",
        autoClose: true,
      },
      type: "error",
    });
  }
  return returnValue;
};
// eslint-disable-next-line
export const CustomModal = ({
  isOpen,
  onRequestClose,
  customOptions,
  handleModalValue,
  keyPathOptions,
}: any) => {
  const [isEmptySpace, setIsEmptySpace] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const [keyNameError, setKeyNameError] = useState<string>("");

  const isValidKeyName = (value: string) => {
    const validPattern = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/;
    return validPattern.test(value);
  };

  React.useEffect(() => {
    setIsEmptySpace(true);
  }, []);

  const debounce = (func: (arg0: any) => void, delay: number | undefined) => {
    let timerId: string | number | NodeJS.Timeout | undefined;
    return (...args: any) => {
      if (timerId) clearTimeout(timerId);
      // @ts-ignore
      timerId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedHandleChange = useCallback(
    debounce((value) => {
      if (/\s/.test(value) || value === "") {
        setIsEmptySpace(true);
        setKeyNameError(localeTexts?.error_Messages?.invalidInput);
      } else {
        setIsEmptySpace(false);
        if (!isValidKeyName(value)) {
          setKeyNameError(localeTexts?.error_Messages?.invalidInput);
        } else {
          setKeyNameError("");
        }
        setModalValue(value);
      }
    }, 300),
    []
  );

  const handleChange = (e: any) => {
    const value = e?.target?.value?.trim();
    debouncedHandleChange(value);
  };
  const handleValueCreate = async () => {
    const updatedValue = checkModalValue({
      customOptions,
      modalValue,
    });
    if (Object.keys(updatedValue)?.length) {
      const updatedKeyPathOptions = [...keyPathOptions, ...updatedValue];
      handleModalValue(updatedKeyPathOptions, updatedValue);
      setModalValue("");
      setIsEmptySpace(true);
      onRequestClose();
      const message =
        localeTexts.configPage.customWholeJson.modal.successToast.text.replace(
          "$",
          rootConfig.ecommerceEnv.APP_ENG_NAME
        );
      toastMessage({ text: message });
    }
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
                title={localeTexts.configPage.customWholeJson.modal.header?.replace(
                  "$",
                  rootConfig.ecommerceEnv.APP_ENG_NAME
                )}
                closeModal={() => {
                  setModalValue("");
                  setIsEmptySpace(true);
                  setKeyNameError("");
                  onRequestClose();
                }}
              />
              <ModalBody className="modalBodyCustomClass ">
                <FieldLabel required htmlFor="label">
                  {localeTexts.configPage.customWholeJson.modal.label}
                </FieldLabel>
                <Help
                  type="basic"
                  text={
                    localeTexts.configPage.customWholeJson.modal.instructionE
                  }
                />
                <TextInput
                  required
                  error={modalValue?.length > inputLengthLimit}
                  autoFocus
                  maxLength={100}
                  showCharacterCount
                  value={modalValue}
                  placeholder={
                    localeTexts.configPage.customWholeJson.modal.placeholder
                  }
                  name="label"
                  autoComplete="off"
                  onChange={handleChange}
                  version="v2"
                />
                <InstructionText>
                  {localeTexts.configPage.customWholeJson.modal.instructionS}
                </InstructionText>
                {keyNameError && (
                  <p className="error_container">{keyNameError}</p>
                )}
                {modalValue?.length > inputLengthLimit ? (
                  <p className="error_container">
                    {localeTexts?.error_Messages?.keyInputLimit?.replace(
                      "$",
                      rootConfig.ecommerceEnv.APP_ENG_NAME
                    )}
                  </p>
                ) : (
                  ""
                )}
              </ModalBody>
              <ModalFooter>
                <ButtonGroup>
                  <Button
                    buttonType="secondary"
                    version="v2"
                    size="small"
                    onClick={() => {
                      setModalValue("");
                      setIsEmptySpace(true);
                      setKeyNameError("");
                      onRequestClose();
                    }}
                  >
                    {localeTexts.configPage.customWholeJson.modal.btn.cancel}
                  </Button>
                  <Button
                    version="v2"
                    size="small"
                    disabled={
                      isEmptySpace ||
                      !!keyNameError ||
                      modalValue?.length > inputLengthLimit
                    }
                    onClick={() => handleValueCreate()}
                  >
                    <Icon icon="CheckedWhite" />
                    {localeTexts.configPage.customWholeJson.modal.btn.apply}
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
