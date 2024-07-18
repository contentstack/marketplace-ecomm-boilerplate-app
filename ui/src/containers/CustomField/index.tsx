/* eslint-disable */
/* Import React modules */
import React, { useCallback, useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import {
  Button,
  Dropdown,
  Icon,
  SkeletonTile,
  Tooltip,
} from "@contentstack/venus-components";
import { Props, TypeSDKData, TypeWarningtext } from "../../common/types";
/* Import our modules */
import RenderList from "./RenderList";
import WarningMessage from "../../components/WarningMessage";
import {
  popupWindow,
  getTypeLabel,
  gridViewDropdown,
  isEmpty,
} from "../../common/utils";

/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";
import localeTexts from "../../common/locale/en-us";
import rootConfig from "../../root_config";
import useProductCustomField from "../../common/hooks/useProductCustomField";
import useAppConfig from "../../common/hooks/useAppConfig";

/* To add any labels / captions for fields or any inputs, use common/local/en-us/index.ts */

const CustomField: React.FC<Props> = function ({ type }) {
  let {
    selectedIds,
    selectedItems,
    setSelectedIds,
    setFieldData,
    stackApiKey,
    setSelectedItems
  }: any = useProductCustomField();
//   selectedItems=[
//     {
//         "__typename": "Product",
//         "id": "gid://shopify/Product/8257070072035",
//         "availableForSale": false,
//         "createdAt": "2024-01-09T15:10:43Z",
//         "updatedAt": "2024-01-09T15:10:44Z",
//         "descriptionHtml": "Tshirt",
//         "description": "Tshirt",
//         "handle": "tshirt",
//         "productType": "",
//         "title": "Tshirt",
//         "vendor": "cs Staging Store",
//         "publishedAt": "2024-01-09T15:10:43Z",
//         "onlineStoreUrl": null,
//         "options": [
//             {
//                 "id": "gid://shopify/ProductOption/10506563453155",
//                 "name": "Title",
//                 "values": [
//                     {
//                         "value": "Default Title",
//                         "type": {
//                             "name": "String",
//                             "kind": "SCALAR"
//                         }
//                     }
//                 ],
//                 "type": {
//                     "name": "ProductOption",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "name": "String",
//                         "values": "String"
//                     },
//                     "implementsNode": true
//                 }
//             }
//         ],
//         "images": [],
//         "variants": [
//             {
//                 "id": "gid://shopify/ProductVariant/44292931158243",
//                 "title": "Default Title",
//                 "price": {
//                     "amount": "0.0",
//                     "currencyCode": "INR",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "priceV2": {
//                     "amount": "0.0",
//                     "currencyCode": "INR",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "weight": 0,
//                 "available": false,
//                 "sku": "",
//                 "compareAtPrice": null,
//                 "compareAtPriceV2": null,
//                 "image": null,
//                 "selectedOptions": [
//                     {
//                         "name": "Title",
//                         "value": "Default Title",
//                         "type": {
//                             "name": "SelectedOption",
//                             "kind": "OBJECT",
//                             "fieldBaseTypes": {
//                                 "name": "String",
//                                 "value": "String"
//                             },
//                             "implementsNode": false
//                         }
//                     }
//                 ],
//                 "unitPrice": null,
//                 "unitPriceMeasurement": {
//                     "measuredType": null,
//                     "quantityUnit": null,
//                     "quantityValue": 0,
//                     "referenceUnit": null,
//                     "referenceValue": 0,
//                     "type": {
//                         "name": "UnitPriceMeasurement",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "measuredType": "UnitPriceMeasurementMeasuredType",
//                             "quantityUnit": "UnitPriceMeasurementMeasuredUnit",
//                             "quantityValue": "Float",
//                             "referenceUnit": "UnitPriceMeasurementMeasuredUnit",
//                             "referenceValue": "Int"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "type": {
//                     "name": "ProductVariant",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "availableForSale": "Boolean",
//                         "compareAtPrice": "MoneyV2",
//                         "id": "ID",
//                         "image": "Image",
//                         "price": "MoneyV2",
//                         "product": "Product",
//                         "selectedOptions": "SelectedOption",
//                         "sku": "String",
//                         "title": "String",
//                         "unitPrice": "MoneyV2",
//                         "unitPriceMeasurement": "UnitPriceMeasurement",
//                         "weight": "Float"
//                     },
//                     "implementsNode": true
//                 },
//                 "hasNextPage": false,
//                 "hasPreviousPage": false,
//                 "variableValues": {
//                     "id": "gid://shopify/Product/8257070072035"
//                 }
//             }
//         ],
//         "type": {
//             "name": "Product",
//             "kind": "OBJECT",
//             "fieldBaseTypes": {
//                 "availableForSale": "Boolean",
//                 "createdAt": "DateTime",
//                 "description": "String",
//                 "descriptionHtml": "HTML",
//                 "handle": "String",
//                 "id": "ID",
//                 "images": "ImageConnection",
//                 "onlineStoreUrl": "URL",
//                 "options": "ProductOption",
//                 "productType": "String",
//                 "publishedAt": "DateTime",
//                 "title": "String",
//                 "updatedAt": "DateTime",
//                 "variants": "ProductVariantConnection",
//                 "vendor": "String"
//             },
//             "implementsNode": true
//         },
//         "cs_metadata": "s2"
//     },
//     {
//         "__typename": "Product",
//         "id": "gid://shopify/Product/8257070399715",
//         "availableForSale": false,
//         "createdAt": "2024-01-09T15:11:06Z",
//         "updatedAt": "2024-01-09T15:11:07Z",
//         "descriptionHtml": "Pant",
//         "description": "Pant",
//         "handle": "pant",
//         "productType": "",
//         "title": "Pant",
//         "vendor": "cs Staging Store",
//         "publishedAt": "2024-01-09T15:11:06Z",
//         "onlineStoreUrl": null,
//         "options": [
//             {
//                 "id": "gid://shopify/ProductOption/10506563780835",
//                 "name": "Title",
//                 "values": [
//                     {
//                         "value": "Default Title",
//                         "type": {
//                             "name": "String",
//                             "kind": "SCALAR"
//                         }
//                     }
//                 ],
//                 "type": {
//                     "name": "ProductOption",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "name": "String",
//                         "values": "String"
//                     },
//                     "implementsNode": true
//                 }
//             }
//         ],
//         "images": [],
//         "variants": [
//             {
//                 "id": "gid://shopify/ProductVariant/44292934303971",
//                 "title": "Default Title",
//                 "price": {
//                     "amount": "0.0",
//                     "currencyCode": "INR",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "priceV2": {
//                     "amount": "0.0",
//                     "currencyCode": "INR",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "weight": 0,
//                 "available": false,
//                 "sku": "",
//                 "compareAtPrice": null,
//                 "compareAtPriceV2": null,
//                 "image": null,
//                 "selectedOptions": [
//                     {
//                         "name": "Title",
//                         "value": "Default Title",
//                         "type": {
//                             "name": "SelectedOption",
//                             "kind": "OBJECT",
//                             "fieldBaseTypes": {
//                                 "name": "String",
//                                 "value": "String"
//                             },
//                             "implementsNode": false
//                         }
//                     }
//                 ],
//                 "unitPrice": null,
//                 "unitPriceMeasurement": {
//                     "measuredType": null,
//                     "quantityUnit": null,
//                     "quantityValue": 0,
//                     "referenceUnit": null,
//                     "referenceValue": 0,
//                     "type": {
//                         "name": "UnitPriceMeasurement",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "measuredType": "UnitPriceMeasurementMeasuredType",
//                             "quantityUnit": "UnitPriceMeasurementMeasuredUnit",
//                             "quantityValue": "Float",
//                             "referenceUnit": "UnitPriceMeasurementMeasuredUnit",
//                             "referenceValue": "Int"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "type": {
//                     "name": "ProductVariant",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "availableForSale": "Boolean",
//                         "compareAtPrice": "MoneyV2",
//                         "id": "ID",
//                         "image": "Image",
//                         "price": "MoneyV2",
//                         "product": "Product",
//                         "selectedOptions": "SelectedOption",
//                         "sku": "String",
//                         "title": "String",
//                         "unitPrice": "MoneyV2",
//                         "unitPriceMeasurement": "UnitPriceMeasurement",
//                         "weight": "Float"
//                     },
//                     "implementsNode": true
//                 },
//                 "hasNextPage": false,
//                 "hasPreviousPage": false,
//                 "variableValues": {
//                     "id": "gid://shopify/Product/8257070399715"
//                 }
//             }
//         ],
//         "type": {
//             "name": "Product",
//             "kind": "OBJECT",
//             "fieldBaseTypes": {
//                 "availableForSale": "Boolean",
//                 "createdAt": "DateTime",
//                 "description": "String",
//                 "descriptionHtml": "HTML",
//                 "handle": "String",
//                 "id": "ID",
//                 "images": "ImageConnection",
//                 "onlineStoreUrl": "URL",
//                 "options": "ProductOption",
//                 "productType": "String",
//                 "publishedAt": "DateTime",
//                 "title": "String",
//                 "updatedAt": "DateTime",
//                 "variants": "ProductVariantConnection",
//                 "vendor": "String"
//             },
//             "implementsNode": true
//         },
//         "cs_metadata": "s2"
//     },
//     {
//         "__typename": "Product",
//         "id": "gid://shopify/Product/6340708860078",
//         "availableForSale": false,
//         "createdAt": "2021-02-18T22:31:50Z",
//         "updatedAt": "2024-05-20T08:08:01Z",
//         "descriptionHtml": "A shirt from the best company in the world.",
//         "description": "A shirt from the best company in the world.",
//         "handle": "contentstack-t-shirt",
//         "productType": "",
//         "title": "White T-Shirt-6340708860078-8407495114926-6340708860078-8420896538798-6340708860078-8420932026542",
//         "vendor": "contentstack-dev01",
//         "publishedAt": "2021-02-18T23:18:01Z",
//         "onlineStoreUrl": null,
//         "options": [
//             {
//                 "id": "gid://shopify/ProductOption/8113816109230",
//                 "name": "Title",
//                 "values": [
//                     {
//                         "value": "Default Title",
//                         "type": {
//                             "name": "String",
//                             "kind": "SCALAR"
//                         }
//                     }
//                 ],
//                 "type": {
//                     "name": "ProductOption",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "name": "String",
//                         "values": "String"
//                     },
//                     "implementsNode": true
//                 }
//             }
//         ],
//         "images": [
//             {
//                 "id": "gid://shopify/ProductImage/23563170906286",
//                 "src": "https://cdn.shopify.com/s/files/1/0533/9047/5438/products/20200907-tshirt-05.jpg?v=1613688322",
//                 "altText": null,
//                 "width": 1000,
//                 "height": 1000,
//                 "type": {
//                     "name": "Image",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "altText": "String",
//                         "height": "Int",
//                         "id": "ID",
//                         "url": "URL",
//                         "width": "Int"
//                     },
//                     "implementsNode": false
//                 },
//                 "hasNextPage": false,
//                 "hasPreviousPage": false,
//                 "variableValues": {
//                     "id": "gid://shopify/Product/6340708860078"
//                 }
//             }
//         ],
//         "variants": [
//             {
//                 "id": "gid://shopify/ProductVariant/38170069434542",
//                 "title": "Default Title",
//                 "price": {
//                     "amount": "29.99",
//                     "currencyCode": "USD",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "priceV2": {
//                     "amount": "29.99",
//                     "currencyCode": "USD",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "weight": 0,
//                 "available": false,
//                 "sku": "",
//                 "compareAtPrice": {
//                     "amount": "39.99",
//                     "currencyCode": "USD",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "compareAtPriceV2": {
//                     "amount": "39.99",
//                     "currencyCode": "USD",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "image": {
//                     "id": "gid://shopify/ProductImage/23563170906286",
//                     "src": "https://cdn.shopify.com/s/files/1/0533/9047/5438/products/20200907-tshirt-05.jpg?v=1613688322",
//                     "altText": null,
//                     "width": 1000,
//                     "height": 1000,
//                     "type": {
//                         "name": "Image",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "altText": "String",
//                             "height": "Int",
//                             "id": "ID",
//                             "url": "URL",
//                             "width": "Int"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "selectedOptions": [
//                     {
//                         "name": "Title",
//                         "value": "Default Title",
//                         "type": {
//                             "name": "SelectedOption",
//                             "kind": "OBJECT",
//                             "fieldBaseTypes": {
//                                 "name": "String",
//                                 "value": "String"
//                             },
//                             "implementsNode": false
//                         }
//                     }
//                 ],
//                 "unitPrice": null,
//                 "unitPriceMeasurement": {
//                     "measuredType": null,
//                     "quantityUnit": null,
//                     "quantityValue": 0,
//                     "referenceUnit": null,
//                     "referenceValue": 0,
//                     "type": {
//                         "name": "UnitPriceMeasurement",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "measuredType": "UnitPriceMeasurementMeasuredType",
//                             "quantityUnit": "UnitPriceMeasurementMeasuredUnit",
//                             "quantityValue": "Float",
//                             "referenceUnit": "UnitPriceMeasurementMeasuredUnit",
//                             "referenceValue": "Int"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "type": {
//                     "name": "ProductVariant",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "availableForSale": "Boolean",
//                         "compareAtPrice": "MoneyV2",
//                         "id": "ID",
//                         "image": "Image",
//                         "price": "MoneyV2",
//                         "product": "Product",
//                         "selectedOptions": "SelectedOption",
//                         "sku": "String",
//                         "title": "String",
//                         "unitPrice": "MoneyV2",
//                         "unitPriceMeasurement": "UnitPriceMeasurement",
//                         "weight": "Float"
//                     },
//                     "implementsNode": true
//                 },
//                 "hasNextPage": false,
//                 "hasPreviousPage": false,
//                 "variableValues": {
//                     "id": "gid://shopify/Product/6340708860078"
//                 }
//             }
//         ],
//         "type": {
//             "name": "Product",
//             "kind": "OBJECT",
//             "fieldBaseTypes": {
//                 "availableForSale": "Boolean",
//                 "createdAt": "DateTime",
//                 "description": "String",
//                 "descriptionHtml": "HTML",
//                 "handle": "String",
//                 "id": "ID",
//                 "images": "ImageConnection",
//                 "onlineStoreUrl": "URL",
//                 "options": "ProductOption",
//                 "productType": "String",
//                 "publishedAt": "DateTime",
//                 "title": "String",
//                 "updatedAt": "DateTime",
//                 "variants": "ProductVariantConnection",
//                 "vendor": "String"
//             },
//             "implementsNode": true
//         },
//         "cs_metadata": "s1"
//     },
//     {
//         "__typename": "Product",
//         "id": "gid://shopify/Product/6545684398254",
//         "availableForSale": false,
//         "createdAt": "2021-03-04T05:50:43Z",
//         "updatedAt": "2024-05-20T08:08:04Z",
//         "descriptionHtml": "<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">100% Original Products</div>\n</div>\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">Free Delivery on order above Rs.<span data-mce-fragment=\"1\"> 8</span>99</div>\n</div>\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">Pay on delivery might be available</div>\n</div>\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">Easy 30 days returns and exchanges</div>\n</div>\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">Try &amp; Buy might be available</div>\n</div>",
//         "description": "100% Original Products Free Delivery on order above Rs. 899 Pay on delivery might be available Easy 30 days returns and exchanges Try & Buy might be available",
//         "handle": "men-black-printed-round-neck-t-shirt",
//         "productType": "",
//         "title": "Men Black Printed Round Neck T-shirt Test",
//         "vendor": "contentstack-dev01",
//         "publishedAt": "2021-03-04T05:51:44Z",
//         "onlineStoreUrl": null,
//         "options": [
//             {
//                 "id": "gid://shopify/ProductOption/8418531770542",
//                 "name": "Title",
//                 "values": [
//                     {
//                         "value": "Default Title",
//                         "type": {
//                             "name": "String",
//                             "kind": "SCALAR"
//                         }
//                     }
//                 ],
//                 "type": {
//                     "name": "ProductOption",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "name": "String",
//                         "values": "String"
//                     },
//                     "implementsNode": true
//                 }
//             }
//         ],
//         "images": [
//             {
//                 "id": "gid://shopify/ProductImage/27997999235246",
//                 "src": "https://cdn.shopify.com/s/files/1/0533/9047/5438/products/11525433792765-HERENOW-Men-Black-Printed-Round-Neck-T-shirt-2881525433792598-1.jpg?v=1614837045",
//                 "altText": null,
//                 "width": 1080,
//                 "height": 1440,
//                 "type": {
//                     "name": "Image",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "altText": "String",
//                         "height": "Int",
//                         "id": "ID",
//                         "url": "URL",
//                         "width": "Int"
//                     },
//                     "implementsNode": false
//                 },
//                 "hasNextPage": false,
//                 "hasPreviousPage": false,
//                 "variableValues": {
//                     "id": "gid://shopify/Product/6545684398254"
//                 }
//             }
//         ],
//         "variants": [
//             {
//                 "id": "gid://shopify/ProductVariant/39291387478190",
//                 "title": "Default Title",
//                 "price": {
//                     "amount": "599.0",
//                     "currencyCode": "USD",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "priceV2": {
//                     "amount": "599.0",
//                     "currencyCode": "USD",
//                     "type": {
//                         "name": "MoneyV2",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "amount": "Decimal",
//                             "currencyCode": "CurrencyCode"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "weight": 0,
//                 "available": false,
//                 "sku": "",
//                 "compareAtPrice": null,
//                 "compareAtPriceV2": null,
//                 "image": {
//                     "id": "gid://shopify/ProductImage/27997999235246",
//                     "src": "https://cdn.shopify.com/s/files/1/0533/9047/5438/products/11525433792765-HERENOW-Men-Black-Printed-Round-Neck-T-shirt-2881525433792598-1.jpg?v=1614837045",
//                     "altText": null,
//                     "width": 1080,
//                     "height": 1440,
//                     "type": {
//                         "name": "Image",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "altText": "String",
//                             "height": "Int",
//                             "id": "ID",
//                             "url": "URL",
//                             "width": "Int"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "selectedOptions": [
//                     {
//                         "name": "Title",
//                         "value": "Default Title",
//                         "type": {
//                             "name": "SelectedOption",
//                             "kind": "OBJECT",
//                             "fieldBaseTypes": {
//                                 "name": "String",
//                                 "value": "String"
//                             },
//                             "implementsNode": false
//                         }
//                     }
//                 ],
//                 "unitPrice": null,
//                 "unitPriceMeasurement": {
//                     "measuredType": null,
//                     "quantityUnit": null,
//                     "quantityValue": 0,
//                     "referenceUnit": null,
//                     "referenceValue": 0,
//                     "type": {
//                         "name": "UnitPriceMeasurement",
//                         "kind": "OBJECT",
//                         "fieldBaseTypes": {
//                             "measuredType": "UnitPriceMeasurementMeasuredType",
//                             "quantityUnit": "UnitPriceMeasurementMeasuredUnit",
//                             "quantityValue": "Float",
//                             "referenceUnit": "UnitPriceMeasurementMeasuredUnit",
//                             "referenceValue": "Int"
//                         },
//                         "implementsNode": false
//                     }
//                 },
//                 "type": {
//                     "name": "ProductVariant",
//                     "kind": "OBJECT",
//                     "fieldBaseTypes": {
//                         "availableForSale": "Boolean",
//                         "compareAtPrice": "MoneyV2",
//                         "id": "ID",
//                         "image": "Image",
//                         "price": "MoneyV2",
//                         "product": "Product",
//                         "selectedOptions": "SelectedOption",
//                         "sku": "String",
//                         "title": "String",
//                         "unitPrice": "MoneyV2",
//                         "unitPriceMeasurement": "UnitPriceMeasurement",
//                         "weight": "Float"
//                     },
//                     "implementsNode": true
//                 },
//                 "hasNextPage": false,
//                 "hasPreviousPage": false,
//                 "variableValues": {
//                     "id": "gid://shopify/Product/6545684398254"
//                 }
//             }
//         ],
//         "type": {
//             "name": "Product",
//             "kind": "OBJECT",
//             "fieldBaseTypes": {
//                 "availableForSale": "Boolean",
//                 "createdAt": "DateTime",
//                 "description": "String",
//                 "descriptionHtml": "HTML",
//                 "handle": "String",
//                 "id": "ID",
//                 "images": "ImageConnection",
//                 "onlineStoreUrl": "URL",
//                 "options": "ProductOption",
//                 "productType": "String",
//                 "publishedAt": "DateTime",
//                 "title": "String",
//                 "updatedAt": "DateTime",
//                 "variants": "ProductVariantConnection",
//                 "vendor": "String"
//             },
//             "implementsNode": true
//         },
//         "cs_metadata": "s1"
//     }
// ]
  const appName = rootConfig.ecommerceEnv.REACT_APP_NAME;
  const uniqueKey: any = rootConfig.ecommerceEnv.UNIQUE_KEY[type];
  let childWindow: any;
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [entryIds, setEntryIds] = useState<any[]>([]);
  const [view, setView] = useState<any>({ value: "card" });
  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<TypeWarningtext>({
      error: false,
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    });
  const config = useAppConfig();
//   console.info("config",config)
  // const [state, setState] = useState<TypeSDKData>({
  //   config: {},
  //   location: {},
  //   appSdkInitialized: false,
  // });

  // const fetchData = async (selectedIdsArray: any) => {
  //   if (
  //     Array.isArray(selectedIdsArray) &&
  //     !isEmpty(state?.config) &&
  //     selectedIdsArray.length &&
  //     !isInvalidCredentials.error
  //   ) {
  //     let res;
  //     if (
  //       rootConfig.ecomCustomFieldCategoryData === true &&
  //       type === "category"
  //     ) {
  //       res = await filter(state?.config, type, selectedIdsArray);
  //       if (res?.error) {
  //         setIsInvalidCredentials(res);
  //       } else setSelectedItems(res?.data?.items);
  //     } else {
  //       res = await getSelectedIDs(state?.config, type, selectedIdsArray);
  //       if (res?.error) {
  //         setIsInvalidCredentials(res);
  //       } else
  //         setSelectedItems(
  //           rootConfig.arrangeList(
  //             selectedIdsArray,
  //             res?.data?.data || res?.data?.items,
  //             uniqueKey
  //           )
  //         );
  //     }
  //   }
  // };

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (childWindow) childWindow.close();
      childWindow = undefined;
    });
  }, []);

  // useEffect(() => {
  //   ContentstackAppSdk.init()
  //     .then(async (appSdk) => {
  //       // eslint-disable-next-line no-unsafe-optional-chaining, no-underscore-dangle
  //       const { api_key } = appSdk?.stack?._data || {};
  //       setStackApiKey(api_key);

  //       const config = await appSdk?.getConfig();
  //       window.iframeRef = null;
  //       window.postRobot = appSdk?.postRobot;
  //       const entryData = appSdk?.location?.CustomField?.field?.getData();
  //       // console.info("entryData", entryData);
  //       appSdk?.location?.CustomField?.frame?.enableAutoResizing();
  //       if (entryData?.data?.length) {
  //         if (
  //           rootConfig.ecomCustomFieldCategoryData &&
  //           rootConfig.ecomCustomFieldCategoryData === true &&
  //           type === "category"
  //         ) {
  //           setEntryIds(
  //             entryData?.data?.map((i: any) => ({
  //               [uniqueKey]: i?.[uniqueKey],
  //               catalogId: i?.catalogId,
  //               catalogVersionId: i?.catalogVersionId,
  //             }))
  //           );
  //         } else setEntryIds(entryData?.data?.map((i: any) => i?.[uniqueKey]));
  //       }
  //       setState({
  //         config,
  //         location: appSdk.location,
  //         appSdkInitialized: true,
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("appSdk initialization error", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (!state.appSdkInitialized) return;
  //   setIsInvalidCredentials({
  //     error: Object.values(state.config || {}).includes(""),
  //     data: localeTexts.warnings.invalidCredentials.replace(
  //       "$",
  //       rootConfig.ecommerceEnv.APP_ENG_NAME
  //     ),
  //   });
  // }, [state.config]);

  // useEffect(() => {
  //   // if (!state.appSdkInitialized) return;
  //   // console.info(entryIds, "entryIds");
  //   setSelectedIds(entryIds);
  // }, [entryIds]);

  // useEffect(() => {
  //   // if (!state.appSdkInitialized) return;
  //   if (selectedIds.length) fetchData(selectedIds);
  //   else setSelectedItems([]);
  // }, [selectedIds]);

  useEffect(() => {
//    let selectedItems=[
//       {
//           "__typename": "Product",
//           "id": "gid://shopify/Product/8257070072035",
//           "availableForSale": false,
//           "createdAt": "2024-01-09T15:10:43Z",
//           "updatedAt": "2024-01-09T15:10:44Z",
//           "descriptionHtml": "Tshirt",
//           "description": "Tshirt",
//           "handle": "tshirt",
//           "productType": "",
//           "title": "Tshirt",
//           "vendor": "cs Staging Store",
//           "publishedAt": "2024-01-09T15:10:43Z",
//           "onlineStoreUrl": null,
//           "options": [
//               {
//                   "id": "gid://shopify/ProductOption/10506563453155",
//                   "name": "Title",
//                   "values": [
//                       {
//                           "value": "Default Title",
//                           "type": {
//                               "name": "String",
//                               "kind": "SCALAR"
//                           }
//                       }
//                   ],
//                   "type": {
//                       "name": "ProductOption",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "name": "String",
//                           "values": "String"
//                       },
//                       "implementsNode": true
//                   }
//               }
//           ],
//           "images": [],
//           "variants": [
//               {
//                   "id": "gid://shopify/ProductVariant/44292931158243",
//                   "title": "Default Title",
//                   "price": {
//                       "amount": "0.0",
//                       "currencyCode": "INR",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "priceV2": {
//                       "amount": "0.0",
//                       "currencyCode": "INR",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "weight": 0,
//                   "available": false,
//                   "sku": "",
//                   "compareAtPrice": null,
//                   "compareAtPriceV2": null,
//                   "image": null,
//                   "selectedOptions": [
//                       {
//                           "name": "Title",
//                           "value": "Default Title",
//                           "type": {
//                               "name": "SelectedOption",
//                               "kind": "OBJECT",
//                               "fieldBaseTypes": {
//                                   "name": "String",
//                                   "value": "String"
//                               },
//                               "implementsNode": false
//                           }
//                       }
//                   ],
//                   "unitPrice": null,
//                   "unitPriceMeasurement": {
//                       "measuredType": null,
//                       "quantityUnit": null,
//                       "quantityValue": 0,
//                       "referenceUnit": null,
//                       "referenceValue": 0,
//                       "type": {
//                           "name": "UnitPriceMeasurement",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "measuredType": "UnitPriceMeasurementMeasuredType",
//                               "quantityUnit": "UnitPriceMeasurementMeasuredUnit",
//                               "quantityValue": "Float",
//                               "referenceUnit": "UnitPriceMeasurementMeasuredUnit",
//                               "referenceValue": "Int"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "type": {
//                       "name": "ProductVariant",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "availableForSale": "Boolean",
//                           "compareAtPrice": "MoneyV2",
//                           "id": "ID",
//                           "image": "Image",
//                           "price": "MoneyV2",
//                           "product": "Product",
//                           "selectedOptions": "SelectedOption",
//                           "sku": "String",
//                           "title": "String",
//                           "unitPrice": "MoneyV2",
//                           "unitPriceMeasurement": "UnitPriceMeasurement",
//                           "weight": "Float"
//                       },
//                       "implementsNode": true
//                   },
//                   "hasNextPage": false,
//                   "hasPreviousPage": false,
//                   "variableValues": {
//                       "id": "gid://shopify/Product/8257070072035"
//                   }
//               }
//           ],
//           "type": {
//               "name": "Product",
//               "kind": "OBJECT",
//               "fieldBaseTypes": {
//                   "availableForSale": "Boolean",
//                   "createdAt": "DateTime",
//                   "description": "String",
//                   "descriptionHtml": "HTML",
//                   "handle": "String",
//                   "id": "ID",
//                   "images": "ImageConnection",
//                   "onlineStoreUrl": "URL",
//                   "options": "ProductOption",
//                   "productType": "String",
//                   "publishedAt": "DateTime",
//                   "title": "String",
//                   "updatedAt": "DateTime",
//                   "variants": "ProductVariantConnection",
//                   "vendor": "String"
//               },
//               "implementsNode": true
//           },
//           "cs_metadata": "s2"
//       },
//       {
//           "__typename": "Product",
//           "id": "gid://shopify/Product/8257070399715",
//           "availableForSale": false,
//           "createdAt": "2024-01-09T15:11:06Z",
//           "updatedAt": "2024-01-09T15:11:07Z",
//           "descriptionHtml": "Pant",
//           "description": "Pant",
//           "handle": "pant",
//           "productType": "",
//           "title": "Pant",
//           "vendor": "cs Staging Store",
//           "publishedAt": "2024-01-09T15:11:06Z",
//           "onlineStoreUrl": null,
//           "options": [
//               {
//                   "id": "gid://shopify/ProductOption/10506563780835",
//                   "name": "Title",
//                   "values": [
//                       {
//                           "value": "Default Title",
//                           "type": {
//                               "name": "String",
//                               "kind": "SCALAR"
//                           }
//                       }
//                   ],
//                   "type": {
//                       "name": "ProductOption",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "name": "String",
//                           "values": "String"
//                       },
//                       "implementsNode": true
//                   }
//               }
//           ],
//           "images": [],
//           "variants": [
//               {
//                   "id": "gid://shopify/ProductVariant/44292934303971",
//                   "title": "Default Title",
//                   "price": {
//                       "amount": "0.0",
//                       "currencyCode": "INR",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "priceV2": {
//                       "amount": "0.0",
//                       "currencyCode": "INR",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "weight": 0,
//                   "available": false,
//                   "sku": "",
//                   "compareAtPrice": null,
//                   "compareAtPriceV2": null,
//                   "image": null,
//                   "selectedOptions": [
//                       {
//                           "name": "Title",
//                           "value": "Default Title",
//                           "type": {
//                               "name": "SelectedOption",
//                               "kind": "OBJECT",
//                               "fieldBaseTypes": {
//                                   "name": "String",
//                                   "value": "String"
//                               },
//                               "implementsNode": false
//                           }
//                       }
//                   ],
//                   "unitPrice": null,
//                   "unitPriceMeasurement": {
//                       "measuredType": null,
//                       "quantityUnit": null,
//                       "quantityValue": 0,
//                       "referenceUnit": null,
//                       "referenceValue": 0,
//                       "type": {
//                           "name": "UnitPriceMeasurement",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "measuredType": "UnitPriceMeasurementMeasuredType",
//                               "quantityUnit": "UnitPriceMeasurementMeasuredUnit",
//                               "quantityValue": "Float",
//                               "referenceUnit": "UnitPriceMeasurementMeasuredUnit",
//                               "referenceValue": "Int"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "type": {
//                       "name": "ProductVariant",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "availableForSale": "Boolean",
//                           "compareAtPrice": "MoneyV2",
//                           "id": "ID",
//                           "image": "Image",
//                           "price": "MoneyV2",
//                           "product": "Product",
//                           "selectedOptions": "SelectedOption",
//                           "sku": "String",
//                           "title": "String",
//                           "unitPrice": "MoneyV2",
//                           "unitPriceMeasurement": "UnitPriceMeasurement",
//                           "weight": "Float"
//                       },
//                       "implementsNode": true
//                   },
//                   "hasNextPage": false,
//                   "hasPreviousPage": false,
//                   "variableValues": {
//                       "id": "gid://shopify/Product/8257070399715"
//                   }
//               }
//           ],
//           "type": {
//               "name": "Product",
//               "kind": "OBJECT",
//               "fieldBaseTypes": {
//                   "availableForSale": "Boolean",
//                   "createdAt": "DateTime",
//                   "description": "String",
//                   "descriptionHtml": "HTML",
//                   "handle": "String",
//                   "id": "ID",
//                   "images": "ImageConnection",
//                   "onlineStoreUrl": "URL",
//                   "options": "ProductOption",
//                   "productType": "String",
//                   "publishedAt": "DateTime",
//                   "title": "String",
//                   "updatedAt": "DateTime",
//                   "variants": "ProductVariantConnection",
//                   "vendor": "String"
//               },
//               "implementsNode": true
//           },
//           "cs_metadata": "s2"
//       },
//       {
//           "__typename": "Product",
//           "id": "gid://shopify/Product/6340708860078",
//           "availableForSale": false,
//           "createdAt": "2021-02-18T22:31:50Z",
//           "updatedAt": "2024-05-20T08:08:01Z",
//           "descriptionHtml": "A shirt from the best company in the world.",
//           "description": "A shirt from the best company in the world.",
//           "handle": "contentstack-t-shirt",
//           "productType": "",
//           "title": "White T-Shirt-6340708860078-8407495114926-6340708860078-8420896538798-6340708860078-8420932026542",
//           "vendor": "contentstack-dev01",
//           "publishedAt": "2021-02-18T23:18:01Z",
//           "onlineStoreUrl": null,
//           "options": [
//               {
//                   "id": "gid://shopify/ProductOption/8113816109230",
//                   "name": "Title",
//                   "values": [
//                       {
//                           "value": "Default Title",
//                           "type": {
//                               "name": "String",
//                               "kind": "SCALAR"
//                           }
//                       }
//                   ],
//                   "type": {
//                       "name": "ProductOption",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "name": "String",
//                           "values": "String"
//                       },
//                       "implementsNode": true
//                   }
//               }
//           ],
//           "images": [
//               {
//                   "id": "gid://shopify/ProductImage/23563170906286",
//                   "src": "https://cdn.shopify.com/s/files/1/0533/9047/5438/products/20200907-tshirt-05.jpg?v=1613688322",
//                   "altText": null,
//                   "width": 1000,
//                   "height": 1000,
//                   "type": {
//                       "name": "Image",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "altText": "String",
//                           "height": "Int",
//                           "id": "ID",
//                           "url": "URL",
//                           "width": "Int"
//                       },
//                       "implementsNode": false
//                   },
//                   "hasNextPage": false,
//                   "hasPreviousPage": false,
//                   "variableValues": {
//                       "id": "gid://shopify/Product/6340708860078"
//                   }
//               }
//           ],
//           "variants": [
//               {
//                   "id": "gid://shopify/ProductVariant/38170069434542",
//                   "title": "Default Title",
//                   "price": {
//                       "amount": "29.99",
//                       "currencyCode": "USD",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "priceV2": {
//                       "amount": "29.99",
//                       "currencyCode": "USD",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "weight": 0,
//                   "available": false,
//                   "sku": "",
//                   "compareAtPrice": {
//                       "amount": "39.99",
//                       "currencyCode": "USD",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "compareAtPriceV2": {
//                       "amount": "39.99",
//                       "currencyCode": "USD",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "image": {
//                       "id": "gid://shopify/ProductImage/23563170906286",
//                       "src": "https://cdn.shopify.com/s/files/1/0533/9047/5438/products/20200907-tshirt-05.jpg?v=1613688322",
//                       "altText": null,
//                       "width": 1000,
//                       "height": 1000,
//                       "type": {
//                           "name": "Image",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "altText": "String",
//                               "height": "Int",
//                               "id": "ID",
//                               "url": "URL",
//                               "width": "Int"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "selectedOptions": [
//                       {
//                           "name": "Title",
//                           "value": "Default Title",
//                           "type": {
//                               "name": "SelectedOption",
//                               "kind": "OBJECT",
//                               "fieldBaseTypes": {
//                                   "name": "String",
//                                   "value": "String"
//                               },
//                               "implementsNode": false
//                           }
//                       }
//                   ],
//                   "unitPrice": null,
//                   "unitPriceMeasurement": {
//                       "measuredType": null,
//                       "quantityUnit": null,
//                       "quantityValue": 0,
//                       "referenceUnit": null,
//                       "referenceValue": 0,
//                       "type": {
//                           "name": "UnitPriceMeasurement",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "measuredType": "UnitPriceMeasurementMeasuredType",
//                               "quantityUnit": "UnitPriceMeasurementMeasuredUnit",
//                               "quantityValue": "Float",
//                               "referenceUnit": "UnitPriceMeasurementMeasuredUnit",
//                               "referenceValue": "Int"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "type": {
//                       "name": "ProductVariant",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "availableForSale": "Boolean",
//                           "compareAtPrice": "MoneyV2",
//                           "id": "ID",
//                           "image": "Image",
//                           "price": "MoneyV2",
//                           "product": "Product",
//                           "selectedOptions": "SelectedOption",
//                           "sku": "String",
//                           "title": "String",
//                           "unitPrice": "MoneyV2",
//                           "unitPriceMeasurement": "UnitPriceMeasurement",
//                           "weight": "Float"
//                       },
//                       "implementsNode": true
//                   },
//                   "hasNextPage": false,
//                   "hasPreviousPage": false,
//                   "variableValues": {
//                       "id": "gid://shopify/Product/6340708860078"
//                   }
//               }
//           ],
//           "type": {
//               "name": "Product",
//               "kind": "OBJECT",
//               "fieldBaseTypes": {
//                   "availableForSale": "Boolean",
//                   "createdAt": "DateTime",
//                   "description": "String",
//                   "descriptionHtml": "HTML",
//                   "handle": "String",
//                   "id": "ID",
//                   "images": "ImageConnection",
//                   "onlineStoreUrl": "URL",
//                   "options": "ProductOption",
//                   "productType": "String",
//                   "publishedAt": "DateTime",
//                   "title": "String",
//                   "updatedAt": "DateTime",
//                   "variants": "ProductVariantConnection",
//                   "vendor": "String"
//               },
//               "implementsNode": true
//           },
//           "cs_metadata": "s1"
//       },
//       {
//           "__typename": "Product",
//           "id": "gid://shopify/Product/6545684398254",
//           "availableForSale": false,
//           "createdAt": "2021-03-04T05:50:43Z",
//           "updatedAt": "2024-05-20T08:08:04Z",
//           "descriptionHtml": "<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">100% Original Products</div>\n</div>\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">Free Delivery on order above Rs.<span data-mce-fragment=\"1\"> 8</span>99</div>\n</div>\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">Pay on delivery might be available</div>\n</div>\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">Easy 30 days returns and exchanges</div>\n</div>\n<div class=\"meta-info\" data-mce-fragment=\"1\">\n<div class=\"meta-desc\" data-mce-fragment=\"1\">Try &amp; Buy might be available</div>\n</div>",
//           "description": "100% Original Products Free Delivery on order above Rs. 899 Pay on delivery might be available Easy 30 days returns and exchanges Try & Buy might be available",
//           "handle": "men-black-printed-round-neck-t-shirt",
//           "productType": "",
//           "title": "Men Black Printed Round Neck T-shirt Test",
//           "vendor": "contentstack-dev01",
//           "publishedAt": "2021-03-04T05:51:44Z",
//           "onlineStoreUrl": null,
//           "options": [
//               {
//                   "id": "gid://shopify/ProductOption/8418531770542",
//                   "name": "Title",
//                   "values": [
//                       {
//                           "value": "Default Title",
//                           "type": {
//                               "name": "String",
//                               "kind": "SCALAR"
//                           }
//                       }
//                   ],
//                   "type": {
//                       "name": "ProductOption",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "name": "String",
//                           "values": "String"
//                       },
//                       "implementsNode": true
//                   }
//               }
//           ],
//           "images": [
//               {
//                   "id": "gid://shopify/ProductImage/27997999235246",
//                   "src": "https://cdn.shopify.com/s/files/1/0533/9047/5438/products/11525433792765-HERENOW-Men-Black-Printed-Round-Neck-T-shirt-2881525433792598-1.jpg?v=1614837045",
//                   "altText": null,
//                   "width": 1080,
//                   "height": 1440,
//                   "type": {
//                       "name": "Image",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "altText": "String",
//                           "height": "Int",
//                           "id": "ID",
//                           "url": "URL",
//                           "width": "Int"
//                       },
//                       "implementsNode": false
//                   },
//                   "hasNextPage": false,
//                   "hasPreviousPage": false,
//                   "variableValues": {
//                       "id": "gid://shopify/Product/6545684398254"
//                   }
//               }
//           ],
//           "variants": [
//               {
//                   "id": "gid://shopify/ProductVariant/39291387478190",
//                   "title": "Default Title",
//                   "price": {
//                       "amount": "599.0",
//                       "currencyCode": "USD",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "priceV2": {
//                       "amount": "599.0",
//                       "currencyCode": "USD",
//                       "type": {
//                           "name": "MoneyV2",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "amount": "Decimal",
//                               "currencyCode": "CurrencyCode"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "weight": 0,
//                   "available": false,
//                   "sku": "",
//                   "compareAtPrice": null,
//                   "compareAtPriceV2": null,
//                   "image": {
//                       "id": "gid://shopify/ProductImage/27997999235246",
//                       "src": "https://cdn.shopify.com/s/files/1/0533/9047/5438/products/11525433792765-HERENOW-Men-Black-Printed-Round-Neck-T-shirt-2881525433792598-1.jpg?v=1614837045",
//                       "altText": null,
//                       "width": 1080,
//                       "height": 1440,
//                       "type": {
//                           "name": "Image",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "altText": "String",
//                               "height": "Int",
//                               "id": "ID",
//                               "url": "URL",
//                               "width": "Int"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "selectedOptions": [
//                       {
//                           "name": "Title",
//                           "value": "Default Title",
//                           "type": {
//                               "name": "SelectedOption",
//                               "kind": "OBJECT",
//                               "fieldBaseTypes": {
//                                   "name": "String",
//                                   "value": "String"
//                               },
//                               "implementsNode": false
//                           }
//                       }
//                   ],
//                   "unitPrice": null,
//                   "unitPriceMeasurement": {
//                       "measuredType": null,
//                       "quantityUnit": null,
//                       "quantityValue": 0,
//                       "referenceUnit": null,
//                       "referenceValue": 0,
//                       "type": {
//                           "name": "UnitPriceMeasurement",
//                           "kind": "OBJECT",
//                           "fieldBaseTypes": {
//                               "measuredType": "UnitPriceMeasurementMeasuredType",
//                               "quantityUnit": "UnitPriceMeasurementMeasuredUnit",
//                               "quantityValue": "Float",
//                               "referenceUnit": "UnitPriceMeasurementMeasuredUnit",
//                               "referenceValue": "Int"
//                           },
//                           "implementsNode": false
//                       }
//                   },
//                   "type": {
//                       "name": "ProductVariant",
//                       "kind": "OBJECT",
//                       "fieldBaseTypes": {
//                           "availableForSale": "Boolean",
//                           "compareAtPrice": "MoneyV2",
//                           "id": "ID",
//                           "image": "Image",
//                           "price": "MoneyV2",
//                           "product": "Product",
//                           "selectedOptions": "SelectedOption",
//                           "sku": "String",
//                           "title": "String",
//                           "unitPrice": "MoneyV2",
//                           "unitPriceMeasurement": "UnitPriceMeasurement",
//                           "weight": "Float"
//                       },
//                       "implementsNode": true
//                   },
//                   "hasNextPage": false,
//                   "hasPreviousPage": false,
//                   "variableValues": {
//                       "id": "gid://shopify/Product/6545684398254"
//                   }
//               }
//           ],
//           "type": {
//               "name": "Product",
//               "kind": "OBJECT",
//               "fieldBaseTypes": {
//                   "availableForSale": "Boolean",
//                   "createdAt": "DateTime",
//                   "description": "String",
//                   "descriptionHtml": "HTML",
//                   "handle": "String",
//                   "id": "ID",
//                   "images": "ImageConnection",
//                   "onlineStoreUrl": "URL",
//                   "options": "ProductOption",
//                   "productType": "String",
//                   "publishedAt": "DateTime",
//                   "title": "String",
//                   "updatedAt": "DateTime",
//                   "variants": "ProductVariantConnection",
//                   "vendor": "String"
//               },
//               "implementsNode": true
//           },
//           "cs_metadata": "s1"
//       }
//   ]
    if (selectedItems?.length) {
      
      if (type === "category") {
        setFieldData({
          data: selectedItems,
          type: `${appName}_${type}`,
        });
      } else {
   

        // eslint-disable-next-line
        if (config?.is_custom_json===false){

            console.info("selectedItems in customFiled Index.tsx",selectedItems)
          setFieldData({
            data: selectedItems,
            type: `${appName}_${type}`,
          });
        } 
        else {
            // console.info("in the else case")
        //   console.info("selectedItems",selectedItems,"type",type)

          const data: any[] = [];
          const keys = config?.custom_keys?.map((i: any) => i?.value);
          if (selectedItems?.length) {
            selectedItems.forEach((item: any) => {
              const obj1: any = {};
              keys?.forEach((key: any) => {
                obj1[key] = item[key];
              });
              data.push(obj1);
            });
          }
          setFieldData({
            data,
            type: `${appName}_${type}`,
          });
        }
      }
    }

    setLoading(false);
  }, [selectedItems,config]);

  const handleMessage = (event: any) => {
    const { data } = event;
    if (childWindow) {
      if (data === "openedReady" && !isEmpty(config)) {
        const dataArr = JSON.parse(
          JSON.stringify(selectedItems?.map((i: any) => i?.[uniqueKey]))
        );
        childWindow.postMessage(
          {
            message: "init",
            config,
            selectedItems: dataArr,
            type,
            stackApiKey,
          },
          window.location.origin
        );
      } else if (data.message === "add") {
        console.info("data",data)
        // if (
        //   rootConfig.ecomCustomFieldCategoryData === true &&
        //   type === "category"
        // )
        //   setEntryIds(data?.dataArr); // FIXME remove this logic
        // else setSelectedIds(data?.dataIds);
        setSelectedIds(data?.dataIds)
        // setSelectedItems(data?.dataArr)
        
      } else if (data.message === "close") {
        childWindow = undefined;
      }
    }
  };
  const handleClick = () => {
    if (!childWindow) {
      childWindow = popupWindow({
        url: `${process.env.REACT_APP_UI_URL}/selector-page`,
        title: `${rootConfig.ecommerceEnv.APP_ENG_NAME}Client`,
        w: 1440,
        h: 844,
      });
      window.addEventListener("message", handleMessage, false);
    } else childWindow.focus();
  };

  const handleToggle = useCallback((event: any) => {
    setView(event);
  }, []);

  const renderCustomField = () => {
    // console.info("hi from the renderCustomFiled")
    if (isInvalidCredentials.error)
      return <WarningMessage content={isInvalidCredentials?.data} />;
    if (loading) {
      return (
        <SkeletonTile
          numberOfTiles={2}
          tileHeight={10}
          tileWidth={300}
          tileBottomSpace={20}
          tileTopSpace={10}
          tileleftSpace={10}
          tileRadius={10}
        />
      );
    }
    // console.info('selectedItems',selectedItems)
    if (selectedItems?.length) {
      return (
        <div className="extension-content">
          <div className="box-header">
            <span className="left-header">
              {selectedItems.length} {getTypeLabel(type, selectedItems.length)}
            </span>
            <div className="viewToggler">
              <Dropdown
                list={gridViewDropdown}
                dropDownType="primary"
                type="click"
                viewAs="label"
                onChange={handleToggle}
                withArrow
                withIcon
                dropDownPosition="bottom"
                closeAfterSelect
                highlightActive={false}
              >
                <Tooltip
                  content={localeTexts.customField.toolTip.content}
                  position="top"
                >
                  <Icon
                    icon={
                      view.value === "card"
                        ? localeTexts.customField.toolTip.thumbnail
                        : localeTexts.customField.toolTip.list
                    }
                    size="original"
                  />
                </Tooltip>
              </Dropdown>
            </div>
          </div>
          <RenderList
            type={type}
            view={view?.value}
            childWindow={childWindow}
          />
        </div>
      );
    }
    return (
      <div className="no-selected-items">
        {localeTexts.customField.noItems.replace("$", getTypeLabel(type, 2))}
      </div>
    );
  };

  /* Handle your UI as per requirement. State variable will hold
        the configuration details from the appSdk. */
  return (
    <div className="layout-container">
      {
        <div className="field-extension-wrapper">
          {renderCustomField()}
          <Button
            onClick={handleClick}
            className="add-product-btn"
            buttonType="control"
            disabled={isInvalidCredentials.error || loading}
          >
            {localeTexts.customField.addHere}{" "}
            {type === "category"
              ? localeTexts.customField.buttonText.category
              : localeTexts.customField.buttonText.product}
          </Button>
        </div>
      }
    </div>
  );
};

export default CustomField;
