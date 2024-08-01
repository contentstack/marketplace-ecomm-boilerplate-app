import React, { useState } from "react";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TextInput,
  InstructionText,
  Notification,
  Tooltip,
} from "@contentstack/venus-components";
import localtext from "../../common/locale/en-us/index";

export const toastMessage = ({ text }: any) => {
  Notification({
    notificationContent: { text },
    notificationProps: {
      hideProgressBar: true,
    },
    type: "success",
  });
};

// eslint-disable-next-line react/function-component-definition
export const DeleteModalConfig = React.memo((props: any) => {
  const [deleteConfirmationName, setDeleteConfirmationName] = useState("");
  const [isConfirmationDisabled, setIsConfirmationDisabled] = useState(true);

  const handleInputChange = (e: any) => {
    const inputValue = e?.target?.value?.trim();
    setDeleteConfirmationName(inputValue);
    setIsConfirmationDisabled(inputValue !== props.multiConfigLabelName);
  };

  const handleDeleteConfirmation = () => {
    if (!isConfirmationDisabled) {
      if (
        deleteConfirmationName
        && deleteConfirmationName === props.multiConfigLabelName
      ) {
        props.removeAccordion();
        toastMessage({
          text: localtext.configPage.multiConfig.deleteModal.deleteMessage,
        });
      }

      props.closeModal();
    }
    else{
      toastMessage({
        text: localtext.configPage.multiConfig.deleteModalNameNotPresent,
      });

    }
  };

  return (
    <>
      <ModalHeader
        title="Confirm Deletion"
        closeModal={props.closeModal}
        closeIconTestId="cs-default-header-close"
      />
      <ModalBody>
        <InstructionText>
          {localtext.configPage.multiConfig.deleteModal.confirMationText}
          <Tooltip content={props.multiConfigLabelName} position="right">
            <b className="multiconfig-ellipsis">{props.multiConfigLabelName}</b>
          </Tooltip>
          {localtext.configPage.multiConfig.deleteModal.confirMationYesText}
        </InstructionText>

        <br />

        <TextInput
          required
          placeholder="Enter configuration name for confirmation"
          name="deleteConfirmationName"
          value={deleteConfirmationName}
          onChange={handleInputChange}
          version="v2"
        />
      </ModalBody>
      <ModalFooter>
        <Button buttonType="light" onClick={() => props.closeModal()}>
          {localtext.configPage.multiConfig.deleteModal.cancelButtonText}
        </Button>
        <Button
          buttonType="delete"
          icon="TrashMini"
          onClick={handleDeleteConfirmation}
          disabled={isConfirmationDisabled}
        >
          {localtext.configPage.multiConfig.deleteModal.deleteButtonText}
        </Button>
      </ModalFooter>
    </>
  );
});
