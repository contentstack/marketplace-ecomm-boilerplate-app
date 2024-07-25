import React from "react";
import {
  ActionTooltip,
  cbModal,
  Icon,
  Tooltip,
} from "@contentstack/venus-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import currency from "currency.js";
import { Props, TypeProduct } from "../../common/types";
import localeTexts from "../../common/locale/en-us";
import constants from "../../common/constants";
import DeleteModal from "./DeleteModal";
import rootConfig from "../../root_config";
import NoImg from "../../assets/NoImg.svg";
import useAppConfig from "../../common/hooks/useAppConfig";

const DraggableListItem: React.FC<Props> = function ({ product, remove }) {
  const config = useAppConfig();
  const { id, name, price, image }: TypeProduct =
    rootConfig.returnFormattedProduct(product, config);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: isDragging ? constants.droppingDOMBorder : undefined,
    backgroundColor: isDragging ? constants.droppingDOMBackground : "inherit",
  };

  const deleteModal = (props: any) => (
    <DeleteModal
      type={"Product" || "Category"}
      remove={remove}
      id={id}
      name={name}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );

  const onHoverActionList = [
    {
      label: <Icon icon="MoveIcon" size="mini" className="drag" />,
      title: localeTexts.customField.listActions.drag,
      action: () => {},
    },
    {
      label: <Icon icon="NewTab" size="mini" />,
      title: localeTexts.customField.listActions.openInConsole.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
      action: () =>
        window.open(
          rootConfig.getOpenerLink(product, config, "product"),
          "_blank"
        ),
    },
    {
      label: <Icon icon="Trash" size="mini" />,
      title: localeTexts.customField.listActions.delete,
      action: () =>
        cbModal({
          component: deleteModal,
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...attributes}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...listeners}
    >
      {isDragging ? (
        ""
      ) : (
        <ActionTooltip list={onHoverActionList}>
          <div role="cell" className="Table__body__column">
            {image ? (
              <div className="product-image">
                <img src={image} alt={name} />
              </div>
            ) : (
              <div className="product-image">
                <Tooltip
                  content={localeTexts.selectorPage.ImageTooltip.label}
                  position="top"
                  showArrow={false}
                  variantType="light"
                  type="secondary"
                >
                  <img
                    src={NoImg}
                    alt={localeTexts.selectorPage.noImageAvailable}
                    className="selector-product-image"
                  />
                </Tooltip>
              </div>
            )}
          </div>
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
