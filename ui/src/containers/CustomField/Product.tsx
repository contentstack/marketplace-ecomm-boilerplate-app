/* eslint-disable */

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ActionTooltip,
  Icon,
  Tooltip,
  cbModal,
} from "@contentstack/venus-components";
import { Props } from "../../common/types";
import { removeHTMLTags } from "../../common/utils";
import localeTexts from "../../common/locale/en-us";
import constants from "../../common/constants";
import DeleteModal from "./DeleteModal";
import rootConfig from "../../root_config";
import { TypeProduct } from "../../types";

const Product: React.FC<Props> = function ({ product, remove, config }) {
  const { id, name, description, image, price }: TypeProduct =
    rootConfig.returnFormattedProduct(product);
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
    borderRadius: 12,
  };

  const deleteModal = (props: any) => (
    <DeleteModal
      type="Product"
      remove={remove}
      id={id}
      name={name}
      {...props}
    />
  );

  const { error } = product;
  const toolTipActions = [
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
          rootConfig.getOpenerLink(product?.id, config, "product"),
          "_blank"
        ),
    },
    {
      label: <Icon icon="Trash" size="mini" />,
      title: "Delete",
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
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      {isDragging ? (
        ""
      ) : (
        <ActionTooltip list={toolTipActions}>
          <div className="product" key={id} data-testid="render-card-item">
            {!error ? (
              <>
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
                      <Icon
                        icon="RedAlert"
                        size="original"
                        width={70}
                        height={70}
                      />
                    </Tooltip>
                  </div>
                )}

                <div className="divider" />
                <div className="product-body">
                  <span className="product-name">{name}</span>
                  {price && (
                    <span className="product-name">
                      {localeTexts.customField.listViewTable.priceCol}: {price}
                    </span>
                  )}
                  <span
                    className="product-desc"
                    dangerouslySetInnerHTML={{
                      __html: `${removeHTMLTags(description)}`,
                    }}
                  />
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </ActionTooltip>
      )}
    </div>
  );
};

export default React.memo(Product);
