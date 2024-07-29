import React from "react";
import { Tooltip } from "@contentstack/venus-components";
import { Props, TypeProduct } from "../../common/types";
import localeTexts from "../../common/locale/en-us";
import "./styles.scss";
import rootConfig from "../../root_config";
import NoImg from "../../assets/NoImg.svg";

const ProductDescription: React.FC<Props> = function ({ product, config }) {
  const { id, name, description, price, sku, image }: TypeProduct =    rootConfig.returnFormattedProduct(product, config);
  const { nameLbl, skuLbl, descriptionLbl, priceLbl } =    localeTexts.sidebarWidget.labels;

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
              // eslint-disable-next-line @typescript-eslint/naming-convention
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          <div className="detail-group">
            <div className="label">{priceLbl}</div>
            <div className="value">{price}</div>
          </div>
          {rootConfig.getSidebarData(product)?.map(({ title, value }: any) => (
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
