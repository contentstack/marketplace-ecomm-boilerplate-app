/* eslint-disable */

import React from "react";
import {
  ActionTooltip,
  cbModal,
  Icon,
  Tooltip,
} from "@contentstack/venus-components";
import { Props } from "../../common/types";
import DeleteModal from "./DeleteModal";
import rootConfig from "../../root_config";
import localeTexts from "../../common/locale/en-us";
import NoImg from "../../assets/NoImg.svg";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import constants from "../../common/constants";

const Category: React.FC<Props> = function ({ categories, remove, config }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: categories?.id });
  const { error } = categories;

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

  const getDeleteModal = (props: any) => (
    <DeleteModal
      type="Category"
      remove={remove}
      id={categories?.id}
      name={categories?.name}
      {...props}
    />
  );

  const toolTipActions = [
    {
      label: <Icon icon="MoveIcon" size="mini" className="drag" />,
      title: localeTexts.customField.listActions.drag,
      action: () => {},
    },
    // {
    //   label: <Icon icon="NewTab" size="mini" />,
    //   title: localeTexts.customField.listActions.openInConsole.replace(
    //     "$",
    //     rootConfig.ecommerceEnv.APP_ENG_NAME
    //   ),
    //   action: () =>
    //     window.open(
    //       rootConfig.getOpenerLink(categories, config, "category"),
    //       "_blank"
    //     ),
    // },
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
  ];

  return (
    <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
      {isDragging ? (
        ""
      ) : (
        <ActionTooltip list={toolTipActions}>
          <div
            className="product"
            key={categories?.id}
            data-testid="render-card-item"
          >
            {!error ? (
              <>
                {getImageUrl(categories)}
                <div className="divider" />
                <div className="product-body">
                  <span className="product-name">{categories?.name}</span>
                  {categories?.id && (
                    <span className="product-name sub-name">
                      {`${localeTexts.customField.idLbl}: ${categories?.id}`}
                    </span>
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
