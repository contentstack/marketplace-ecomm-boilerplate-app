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
import NoImg from "../../assets/NoImg.svg";
import useAppConfig from "../../common/hooks/useAppConfig";

const Product: React.FC<Props> = function ({ product, remove }) {
  const config = useAppConfig();
  const { id, name, description, image, price }: TypeProduct =
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
    borderRadius: 12,
  };

  const deleteModal = (props: any) => (
    <DeleteModal
      multi_config_name={product?.cs_metadata?.multi_config_name}
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
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      {isDragging ? (
        ""
      ) : (
        <ActionTooltip list={toolTipActions}>
          <div
            className="product"
            key={id || product?.code}
            data-testid="render-card-item"
          >
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
                      <img
                        src={NoImg}
                        alt={localeTexts.selectorPage.noImageAvailable}
                        className="selector-product-image"
                      />
                    </Tooltip>
                  </div>
                )}

                <div className="divider" />
                <div className="product-body">
                  <span className="product-name">{name}</span>
                  {price && (
                    <span className="product-name">
                      {localeTexts.customField.listViewTable.price}: {price}
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
