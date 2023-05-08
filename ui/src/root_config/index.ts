import currency from "currency.js";
import { ColumnsProp } from "@contentstack/venus-components/build/components/Table/InfiniteScrollTable";
// eslint-disable-next-line import/no-cycle
import { wrapWithDiv, getImage } from "../common/utils";
import { TypeCategory, ConfigFields, EcommerceEnv, KeyOption, TypeProduct, SidebarDataObj } from "../types";
import Logo from '../assets/Logo.svg'
/* eslint-disable */

/* all values in this file are an example.
    You can modify its values and implementation,
    but please do not change any keys or function names.

*/
const ecommerceEnv: EcommerceEnv = {
    REACT_APP_NAME: 'yourappnameinlowercase',
    SELECTOR_PAGE_LOGO: Logo,
    APP_ENG_NAME: 'Your App Name',
    UNIQUE_KEY: {
        product: "code",
        category: "id",
    },
    FETCH_PER_PAGE: 20
}
// example config fields. you will need to use these values in the config screen accordingly.
const ecommerceConfigFields: ConfigFields = {
    field1: {
        label: "Store ID",
        help: "You can find your store's ID on your ECommerce Console",
        placeholder: "Enter your Store ID",
        instruction: "Copy and Paste your Store ID",
    },
    field2: {
        label: "Auth Token",
        help: "You can find your store's Auth Token as 'Access Token' in the file you downloaded.",
        placeholder: "Enter your Auth Token",
        instruction: "Copy and Paste your Auth Token",
    },
    field3: {
        label: "Items per Page",
        placeholder: "Enter the number items you want to fetch per page.",
        instruction: "You can enter the page count as numbers eg. 1, 5, 10, etc",
    },
}

const getCustomKeys = () => <KeyOption[]>(
        [
            {
                label: "availability",
                value: "availability",
                searchLabel: "availability",
            },
            {
                label: "availability_description",
                value: "availability_description",
                searchLabel: "availability_description",
            },
            {
                label: "base_variant_id",
                value: "base_variant_id",
                searchLabel: "base_variant_id",
            },
            {
                label: "brand_id",
                value: "brand_id",
                searchLabel: "brand_id",
            },
            {
                label: "calculated_price",
                value: "calculated_price",
                searchLabel: "calculated_price",
            },
            {
                label: "categories",
                value: "categories",
                searchLabel: "categories",
            },
            {
                label: "condition",
                value: "condition",
                searchLabel: "condition",
            },
            {
                label: "cost_price",
                value: "cost_price",
                searchLabel: "cost_price",
            },
            {
                label: "custom_url",
                value: "custom_url",
                searchLabel: "custom_url",
            },
            {
                label: "date_created",
                value: "date_created",
                searchLabel: "date_created",
            },
            {
                label: "depth",
                value: "depth",
                searchLabel: "depth",
            },
            {
                label: "description",
                value: "description",
                searchLabel: "description",
            },
            {
                label: "fixed_cost_shipping_price",
                value: "fixed_cost_shipping_price",
                searchLabel: "fixed_cost_shipping_price",
            },
            {
                label: "gift_wrapping_options_list",
                value: "gift_wrapping_options_list",
                searchLabel: "gift_wrapping_options_list",
            },
            {
                label: "gift_wrapping_options_type",
                value: "gift_wrapping_options_type",
                searchLabel: "gift_wrapping_options_type",
            },
            {
                label: "gtin",
                value: "gtin",
                searchLabel: "gtin",
            },
            {
                label: "height",
                value: "height",
                searchLabel: "height",
            },
            {
                label: "id",
                value: "id",
                searchLabel: "id",
                isDisabled: true,
            },
            {
                label: "images",
                value: "images",
                searchLabel: "images",
            },
            {
                label: "inventory_level",
                value: "inventory_level",
                searchLabel: "inventory_level",
            },
            {
                label: "inventory_tracking",
                value: "inventory_tracking",
                searchLabel: "inventory_tracking",
            },
            {
                label: "inventory_warning_level",
                value: "inventory_warning_level",
                searchLabel: "inventory_warning_level",
            },
            {
                label: "is_condition_shown",
                value: "is_condition_shown",
                searchLabel: "is_condition_shown",
            },
            {
                label: "is_featured",
                value: "is_featured",
                searchLabel: "is_featured",
            },
            {
                label: "is_free_shipping",
                value: "is_free_shipping",
                searchLabel: "is_free_shipping",
            },
            {
                label: "is_preorder_only",
                value: "is_preorder_only",
                searchLabel: "is_preorder_only",
            },
            {
                label: "is_price_hidden",
                value: "is_price_hidden",
                searchLabel: "is_price_hidden",
            },
            {
                label: "is_visible",
                value: "is_visible",
                searchLabel: "is_visible",
            },
            {
                label: "layout_file",
                value: "layout_file",
                searchLabel: "layout_file",
            },
            {
                label: "map_price",
                value: "map_price",
                searchLabel: "map_price",
            },
            {
                label: "meta_description",
                value: "meta_description",
                searchLabel: "meta_description",
            },
            {
                label: "meta_keywords",
                value: "meta_keywords",
                searchLabel: "meta_keywords",
            },
            {
                label: "mpn",
                value: "mpn",
                searchLabel: "mpn",
            },
            {
                label: "name",
                value: "name",
                searchLabel: "name",
                isDisabled: true,
            },
            {
                label: "open_graph_description",
                value: "open_graph_description",
                searchLabel: "open_graph_description",
            },
            {
                label: "open_graph_title",
                value: "open_graph_title",
                searchLabel: "open_graph_title",
            },
            {
                label: "open_graph_type",
                value: "open_graph_type",
                searchLabel: "open_graph_type",
            },
            {
                label: "open_graph_use_image",
                value: "open_graph_use_image",
                searchLabel: "open_graph_use_image",
            },
            {
                label: "open_graph_use_meta_description",
                value: "open_graph_use_meta_description",
                searchLabel: "open_graph_use_meta_description",
            },
            {
                label: "open_graph_use_product_name",
                value: "open_graph_use_product_name",
                searchLabel: "open_graph_use_product_name",
            },
            {
                label: "option_set_display",
                value: "option_set_display",
                searchLabel: "option_set_display",
            },
            {
                label: "option_set_id",
                value: "option_set_id",
                searchLabel: "option_set_id",
            },
            {
                label: "order_quantity_maximum",
                value: "order_quantity_maximum",
                searchLabel: "order_quantity_maximum",
            },
            {
                label: "order_quantity_minimum",
                value: "order_quantity_minimum",
                searchLabel: "order_quantity_minimum",
            },
            {
                label: "page_title",
                value: "page_title",
                searchLabel: "page_title",
            },
            {
                label: "preorder_message",
                value: "preorder_message",
                searchLabel: "preorder_message",
            },
            {
                label: "preorder_release_date",
                value: "preorder_release_date",
                searchLabel: "preorder_release_date",
            },
            {
                label: "price",
                value: "price",
                searchLabel: "price",
            },
            {
                label: "price_hidden_label",
                value: "price_hidden_label",
                searchLabel: "price_hidden_label",
            },
            {
                label: "primary_image",
                value: "primary_image",
                searchLabel: "primary_image",
            },
            {
                label: "product_tax_code",
                value: "product_tax_code",
                searchLabel: "product_tax_code",
            },
            {
                label: "related_products",
                value: "related_products",
                searchLabel: "related_products",
            },
            {
                label: "retail_price",
                value: "retail_price",
                searchLabel: "retail_price",
            },
            {
                label: "reviews_count",
                value: "reviews_count",
                searchLabel: "reviews_count",
            },
            {
                label: "reviews_rating_sum",
                value: "reviews_rating_sum",
                searchLabel: "reviews_rating_sum",
            },
            {
                label: "sale_price",
                value: "sale_price",
                searchLabel: "sale_price",
            },
            {
                label: "search_keywords",
                value: "search_keywords",
                searchLabel: "search_keywords",
            },
            {
                label: "sku",
                value: "sku",
                searchLabel: "sku",
            },
            {
                label: "sort_order",
                value: "sort_order",
                searchLabel: "sort_order",
            },
            {
                label: "tax_class_id",
                value: "tax_class_id",
                searchLabel: "tax_class_id",
            },
            {
                label: "total_sold",
                value: "total_sold",
                searchLabel: "total_sold",
            },
            {
                label: "type",
                value: "type",
                searchLabel: "type",
            },
            {
                label: "upc",
                value: "upc",
                searchLabel: "upc",
            },
            {
                label: "variants",
                value: "variants",
                searchLabel: "variants",
            },
            {
                label: "view_count",
                value: "view_count",
                searchLabel: "view_count",
            },
            {
                label: "warranty",
                value: "warranty",
                searchLabel: "warranty",
            },
            {
                label: "weight",
                value: "weight",
                searchLabel: "weight",
            },
            {
                label: "width",
                value: "width",
                searchLabel: "width",
            },
        ]
)
// this function maps the corresponding keys to your product object
const returnFormattedProduct = (product: any) => <TypeProduct>({
    id: product?.id || "",
    name: product?.name || "",
    description: product?.description || {},
    image: product?.primary_image?.url_thumbnail || "",
    price: `$${currency(product?.price) || "Not Available"}`,
    sku: product?.sku || "",
});

// this function maps the corresponding keys to your category object
const returnFormattedCategory = (category: any) => <TypeCategory>({
    id: category?.id || "",
    name: category?.name || "",
    customUrl: category?.custom_url?.url || "",
    description: category?.description || "Not Available",
})

// this function returns the link to open the product or category in the third party app
// you can use the id, config and type to generate links
const getOpenerLink = (id: any, config: any, type: any) =>
    `https://store-${config?.storeId}.myexamplecommerce.com/manage/products/${type === "category" ? `categories/${id}/edit` : `edit/${id}`
    }`;

/* this function returns the titles and data that are to be displayed in the sidebar
    by default, name, image, price and description are being displayed.
    you can add additional values in this function that you want to display
*/
const getSidebarData = (product: any) => <SidebarDataObj[]>
    ([
        {
            title: 'Dimensions',
            value: `${product?.width}in X ${product?.height}in X `
        },
        {
            title: 'Height',
            value: product?.height
        },
        {
            title: 'Width',
            value: product?.width
        },
    ])

// this defines what and how will the columns will be displayed in your product selector page
const productSelectorColumns: ColumnsProp[] = [
    {
      Header: "ID", // the title of the column
      id: "id", 
      accessor: "id", // specifies how you want to display data in the column. can be either string or a function
      default: false, 
      disableSortBy: true, // disable sorting of the table with this column
      addToColumnSelector: true, // specifies whether you want to add this column to column selector in the table
      columnWidthMultiplier: 0.8, // multiplies this number with one unit of column with.
                                  // 0.x means smaller than one specified unit by 0.x times
                                  // x means bigger that one specified unit by x times
    },
    {
      Header: "Image",
      accessor: (obj: any) => getImage(obj?.primary_image?.url_tiny),
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 0.7,
    },
    {
      Header: "SKU",
      id: "sku",
      accessor: "sku",
      default: true,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 0.8,
    },
    {
      Header: "Product Name",
      id: "name",
      accessor: "name",
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 3,
    },
    {
      Header: "Price",
      accessor: (obj: any) => `$${currency(obj?.price)}`,
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 1,
    },
    {
      Header: "Description",
      accessor: (obj: any) => wrapWithDiv(obj?.description),
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 3.5,
    },
  ];
  
// this defines what and how will the columns will be displayed in your category selector page 
  const categorySelectorColumns: ColumnsProp[] = [
    {
      Header: "ID",
      id: "id",
      accessor: "id",
      default: true,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 0.8,
    },
    {
      Header: "Category Name",
      id: "name",
      accessor: "name",
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
    },
    {
      Header: "Custom URL",
      accessor: "custom_url.url",
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
    },
    {
      Header: "Description",
      accessor: (obj: any) => wrapWithDiv(obj?.description),
      default: false,
      disableSortBy: true,
      addToColumnSelector: true,
      columnWidthMultiplier: 4,
    },
  ];

const rootConfig = {
    ecommerceEnv,
    ecommerceConfigFields,
    returnFormattedProduct,
    returnFormattedCategory,
    getOpenerLink,
    productSelectorColumns,
    categorySelectorColumns,
    getCustomKeys,
    getSidebarData
}

export default rootConfig