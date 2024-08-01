import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ActionTooltip,
  Icon,
  Tooltip,
  cbModal,
} from "@contentstack/venus-components";
import { Props, TypeProduct } from "../../common/types";
import { removeHTMLTags } from "../../common/utils";
import localeTexts from "../../common/locale/en-us";
import constants from "../../common/constants";
import DeleteModal from "./DeleteModal";
import rootConfig from "../../root_config";
import useAppConfig from "../../common/hooks/useAppConfig";
import noImage from "../../assets/NoImg.svg";

const Product: React.FC<Props> = function ({ product, remove }) {
  const config = useAppConfig();
  const { id, name, description, image, price, isProductDeleted }: TypeProduct =    rootConfig.returnFormattedProduct(product, config);

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
  /* eslint-disable */
  const deleteModal = (props: any) => (
    <DeleteModal
      multiConfigName={product?.cs_metadata?.multiConfigName}
      type="Product"
      remove={remove}
      id={id}
      name={name}
      {...props}
    />
  );
  /* eslint-enable */

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
  ]?.filter(
    (action) =>
      !(
        isProductDeleted
        && action?.label?.props?.icon === localeTexts.customField.toolTip.newTab
      )
  );

  /* eslint-disable */
  return (
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      {isDragging ? (
        ""
      ) : (
        <ActionTooltip list={toolTipActions}>
          <div className="product" key={id} data-testid="render-card-item">
            {!error ? (
              <>
                {isProductDeleted ? (
                  <div className="product-image product_image">
                    <Tooltip
                      content={localeTexts.customField.configDeletedImg}
                      position="top"
                      showArrow={false}
                      variantType="light"
                      type="secondary"
                    >
                      <Icon icon="WarningBold" version="v2" size="small" />
                    </Tooltip>
                  </div>
                ) : image ? (
                  <>
                    <div className="product-image">
                      <img src={image} alt={name} />
                    </div>
                    <div className="divider" />
                  </>
                ) : (
                  <div className="product-image product_image">
                    <Tooltip
                      content={localeTexts.customField.noImage.text}
                      position="top"
                      showArrow={false}
                      variantType="light"
                      type="secondary"
                    >
                      <img
                        src={noImage}
                        alt={localeTexts.customField.noImage.text}
                        className={"selector-product-image"}
                      />
                    </Tooltip>
                  </div>
                )}
                <div className="product-body">
                  {isProductDeleted ? (
                    <span className="product-name">{name}</span>
                  ) : (
                    <>
                      <span className="product-name">{name}</span>
                      {price && (
                        <span className="product-name">
                          {localeTexts.customField.listViewTable.price}:{price}
                        </span>
                      )}
                      <span
                        className="product-desc"
                        dangerouslySetInnerHTML={{
                          __html: `${removeHTMLTags(description)}`,
                        }}
                      />
                    </>
                  )}
                  {isProductDeleted && (
                    <div className="config-deleted-message">
                      {localeTexts.customField.noConfig}
                    </div>
                  )}
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
