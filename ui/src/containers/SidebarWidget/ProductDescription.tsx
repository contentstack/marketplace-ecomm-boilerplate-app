/* eslint-disable */
import React from "react";
import { Props } from "../../common/types";
import localeTexts from "../../common/locale/en-us";
import "./styles.scss";
import { Icon, Tooltip } from "@contentstack/venus-components";
import rootConfig from "../../root_config";
import { TypeProduct } from "../../types";

const ProductDescription: React.FC<Props> = function ({ product }) {
  const { id, name, description, price, sku, image }: TypeProduct = rootConfig.returnFormattedProduct(product);
  const {
    nameLbl,
    skuLbl,
    descriptionLbl,
    priceLbl,
  } = localeTexts.sidebarWidget.labels;

  return (
    <div>
      {product &&
         (
          <div className="sidebar-widget-wrapper" id={id} key={id}>
            <div className="product-image">
              {image ? (
                <img src={image} alt={localeTexts.sidebarWidget.altTexts.product} />
              ) : (
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
                    width={150}
                    height={150}
                  />
                </Tooltip>
              )}
            </div>
            <div className="detail-group">
              <div className="label">{nameLbl}</div>
              <div className="value">{name}</div>
            </div>
            {sku? 
            <div className="detail-group">
              <div className="label">{skuLbl}</div>
              <div className="value">{sku}</div>
            </div>
            : ''}
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
            {rootConfig.getSidebarData(product)?.map(({title, value}) => (
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

// "name": Name

// "type": Type

// "sku": "SLCTBS",

// "description": Description

// "weight": Weight

// Dimensions: (should show data as 5inx2inx3in ([width]x[depth]x[height]) and should include units (in / mm / etc)

// "price": Price (should show currency as well)

// "sale_price": Sale Price

// "categories": Categories (should have names, not just IDs)

// "brand_id": Brand

// "inventory_level": Inventory

// "reviews_rating_sum": Rating

// "total_sold": Number Sold

// "is_featured": Featured

// "view_count": Views

export default ProductDescription;