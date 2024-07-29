import React from "react";
import {
  ActionTooltip,
  cbModal,
  Icon,
  Tooltip,
} from "@contentstack/venus-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Props } from "../../common/types";
import DeleteModal from "./DeleteModal";
import rootConfig from "../../root_config";
import localeTexts from "../../common/locale/en-us";
import NoImg from "../../assets/NoImg.svg";
import constants from "../../common/constants";
import useAppConfig from "../../common/hooks/useAppConfig";
import { removeHTMLTags } from "../../common/utils";

const Category: React.FC<Props> = function ({ categories, remove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: categories?.id });
  const config = useAppConfig();
  const { error } = categories;
  const { id, name, customUrl, description, isCategoryDeleted } =    rootConfig.returnFormattedCategory(categories);

  const getImageUrl = (category: any) => {
    let imageSrc = category?.c_slotBannerImage || category?.image;

    if (!imageSrc && category?.c_headerMenuBanner) {
      imageSrc = category?.c_headerMenuBanner
        .match(/(https?:\/\/[^ ]*)/)[1]
        .replace(/"/g, "");
    }

    return imageSrc ? (
      <div className="product-image cat-img">
        <img src={imageSrc} alt={category?.name} />
      </div>
    ) : (
      <div className="product-image cat-img">
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
    );
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: isDragging ? constants.droppingDOMBorder : undefined,
    backgroundColor: isDragging ? constants.droppingDOMBackground : "inherit",
    borderRadius: 12,
  };

  /* eslint-disable */
  const getDeleteModal = (props: any) => (
    <DeleteModal
      multi_config_name={categories?.cs_metadata?.multi_config_name}
      type="Category"
      remove={remove}
      id={categories?.id}
      name={name}
      {...props}
    />
  );
  /* eslint-enable */

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
          rootConfig.getOpenerLink(categories, config, "category"),
          "_blank"
        ),
    },
    {
      label: <Icon icon="Trash" size="mini" />,
      title: localeTexts.customField.listActions.delete,
      action: () =>
        cbModal({
          component: getDeleteModal,
          modalProps: {
            onClose: () => {},
            onOpen: () => {},
            size: "xsmall",
          },
        }),
      className: "ActionListItem--warning",
    },
  ].filter(
    (action) => !(isCategoryDeleted && action.label.props.icon === "NewTab")
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
                {isCategoryDeleted ? (
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
                ) : (
                  getImageUrl(customUrl)
                )}

                <div className="divider" />
                <div className="product-body">
                  <span className="product-name">{name}</span>

                  {!isCategoryDeleted && (
                    <span
                      className="product-desc"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                        // eslint-disable-next-line
                        __html: `${removeHTMLTags(description)}`,
                      }}
                    />
                  )}
                  {isCategoryDeleted && (
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

export default Category;
