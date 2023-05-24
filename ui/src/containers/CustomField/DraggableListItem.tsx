/* eslint-disable */
import React from "react";
import { ActionTooltip, cbModal, Icon } from "@contentstack/venus-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Props } from "../../common/types";
import localeTexts from "../../common/locale/en-us";
import currency from "currency.js";
import constants from "../../common/constants";
import DeleteModal from "./DeleteModal";
import rootConfig from "../../root_config";
import { TypeProduct } from "../../types";

const DraggableListItem: React.FC<Props> = function ({
  product,
  remove,
  config
}) {
  const { id, name, price }: TypeProduct = rootConfig.returnFormattedProduct(product);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: isDragging ? constants.droppingDOMBorder : undefined,
    backgroundColor: isDragging ? constants.droppingDOMBackground : "inherit",
  };

  const onHoverActionList = [
    {
      label: <Icon icon="MoveIcon" size="mini" className="drag" />,
      title: localeTexts.customField.listActions.drag,
      action: () => {},
    },
    {
      label: <Icon icon="NewTab" size="mini" />,
      title: localeTexts.customField.listActions.openInConsole.replace("$", rootConfig.ecommerceEnv.APP_ENG_NAME),
      action: () =>
        window.open(rootConfig.getOpenerLink(id, config, "product"), "_blank"),
    },
    {
      label: <Icon icon="Trash" size="mini" />,
      title: localeTexts.customField.listActions.delete,
      action: () =>
        cbModal({
          component: (props: any) => (
            <DeleteModal
              type="Product"
              remove={remove}
              id={id}
              name={name}
              {...props}
            />
          ),
          modalProps: {
            onClose: () => {},
            onOpen: () => {},
            size: "xsmall",
          },
        }),
      className: "ActionListItem--warning",
    },
  ];
  return (
    <div
      className="Table__body__row"
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {isDragging ? (
        ""
      ) : (
        <ActionTooltip list={onHoverActionList}>
          <div role="cell" className="Table__body__column">
            {name}
          </div>
          <div role="cell" className="Table__body__column">
            {`$${currency(price)}`}
          </div>
        </ActionTooltip>
      )}
    </div>
  );
};

export default React.memo(DraggableListItem);
