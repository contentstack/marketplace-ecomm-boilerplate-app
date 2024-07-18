/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Props } from "../../common/types";
import { findProduct } from "../../common/utils";
import Product from "./Product";
import rootConfig from "../../root_config";
import Category from "./Category";
import useProductCustomField from "../../common/hooks/useProductCustomField";

const DraggableGrid: React.FC<Props> = function ({ remove, type }) {
  let { selectedItems, handleDragEvent } = useProductCustomField();
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
  const uniqueKey = rootConfig.ecommerceEnv.UNIQUE_KEY?.[type] ?? "id";
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0.1 } })
  );

  const handleDragStart = ({ active }: any) => {
    if (!active) {
      return;
    }
    setActiveId(active.id);
  };

  function handleDragCancel() {
    setActiveId(null);
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    setActiveId(null);
    if (active?.id !== over?.id) {
      handleDragEvent(
        arrayMove(
          selectedItems,
          selectedItems?.findIndex((p: any) => p?.[uniqueKey] === active?.id),
          selectedItems?.findIndex((p: any) => p?.[uniqueKey] === over?.id)
        )
      );
    }
  };

  const getDraOverlay = () => {
    if (activeId) {
      return type === "category" ? (
        <Category
          categories={findProduct(selectedItems, activeId, uniqueKey)}
          remove={remove}
        />
      ) : (
        <Product
          product={findProduct(selectedItems, activeId, uniqueKey)}
          remove={remove}
        />
      );
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      onDragStart={handleDragStart}
    >
      <SortableContext items={selectedItems}>
        <div className="gridContainer">
          {type === "category"
            ? selectedItems?.map((category: any) => (
                <Category
                  categories={category}
                  remove={remove}
                  key={category?.[uniqueKey]}
                  id={category?.[uniqueKey]}
                />
              ))
            : selectedItems?.map((product: any) => (
                <Product
                  key={product?.[uniqueKey]}
                  product={product}
                  remove={remove}
                />
              ))}
        </div>
      </SortableContext>
      <DragOverlay>{getDraOverlay()}</DragOverlay>
    </DndContext>
  );
};

export default DraggableGrid;
