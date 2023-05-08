/* eslint-disable */
import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";
import React from "react";
import localeTexts from "../../common/locale/en-us";
import { Props } from "../../common/types";

const DeleteModal: React.FC<Props> = function ({
  type,
  remove,
  id,
  name: itemName,
  ...props
}) {
  return (
    <>
      <ModalHeader
        title={`${localeTexts.deleteModal.header} ${type}`}
        closeModal={props.closeModal}
      />
      <ModalBody className="deleteModalBody">
        <p
          dangerouslySetInnerHTML={{
            __html: `${localeTexts.deleteModal.body.replace("$", itemName)}`,
          }}
        />
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="light" onClick={props.closeModal}>
            {localeTexts.deleteModal.cancelButton}
          </Button>
          <Button
            buttonType="delete"
            icon="TrashMini"
            onClick={() => {
              remove(id);
              props.closeModal();
            }}
          >
            {localeTexts.deleteModal.confirmButton}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export default React.memo(DeleteModal);
