/* eslint-disable */
import React from "react";
import { Props } from "../../common/types";
import localeTexts from "../../common/locale/en-us";
import "./styles.scss";
import { Icon, Tooltip } from "@contentstack/venus-components";
import rootConfig from "../../root_config";
import { TypeProduct } from "../../types";
import NoImg from "../../assets/NoImg.svg";

const ProductDescription: React.FC<Props> = function ({ product }) {
  const { id, name, description, price, sku, image }: TypeProduct =
    rootConfig.returnFormattedProduct(product);
  const { nameLbl, skuLbl, descriptionLbl, priceLbl } =
    localeTexts.sidebarWidget.labels;

  return (
    <div>
      {product && (
        <div className="sidebar-widget-wrapper" id={id} key={id}>
          <div className="product-image">
            {image ? (
              <img
                src={image}
                alt={localeTexts.sidebarWidget.altTexts.product}
              />
            ) : (
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
            )}
          </div>
          <div className="detail-group">
            <div className="label">{nameLbl}</div>
            <div className="value">{name}</div>
          </div>
          {sku ? (
            <div className="detail-group">
              <div className="label">{skuLbl}</div>
              <div className="value">{sku}</div>
            </div>
          ) : (
            ""
          )}
          <div className="detail-group">
            <div className="label">{descriptionLbl}</div>
            <div
              className="value"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          <div className="detail-group">
            <div className="label">{priceLbl}</div>
            <div className="value">{price}</div>
          </div>
          {rootConfig.getSidebarData(product)?.map(({ title, value }) => (
            <div className="detail-group" key={title}>
              <div className="label">{title}</div>
              <div className="value">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
