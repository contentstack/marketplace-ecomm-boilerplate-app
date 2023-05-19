export default {
  configPage:{
    saveInEntry: {
        label: "Save In Entry",
        help: "You can select how you want to save data you get from $.",
        placeholder: "Enter the structure of data you want to save in the entry",
        instruction:
            "You can select the structure of data you want to save in the entry, if you select Custom JSON. If you select Whole JSON, you can select only limited number of products.",
        wholeJson: "Whole JSON",
        customJson: "Custom JSON",
    },  
    customKeys: {
        label: "$ Keys",
        help: "Select the keys you want to save",
        placeholder: "Select keys",
        instruction: "Select the keys you want to save",
    }
  },
  customField: {
    add : "Add ",
    noItems: "No $ have been Added",
    listViewTable:{
      nameCol: "Product Name",
      priceCol: "Price"
    },
    listActions: {
      drag: "Drag",
      openInConsole: "Open in $",
      delete: "Delete",
    },
    toolTip: {
      content: "Change View",
      thumbnail: "Thumbnail",
      list: "List",
    },
    buttonText: {
      category: "Category(s)",
      product: "Product(s)",
    },
    categoryCard:{
        customURL: "Custom URL"
    }
  },
  selectorPage: {
    heading: "$ Extension",
    searchQuery : "Try changing the search query or filters to find what you are looking for.",
    searchCase : "Not sure where to start? Visit our ",
    helpCenter : "help center",
    selectCategory: {
      placeHolder: "Select Category",
    },
    hoverActions: "View in $",
    ImageTooltip: {
      label: "Product Image Not Available",
    },
    add: "Add #",
    searchPlaceholder: {
      caption: "Search for",
      categories: "categories",
      products: "products",
      category: "category",
      product: "product",
    },
  },
  buttonLabels: {
    category: "Category(s)",
    product: "Product(s)",
    close: "Close"
  },
  sidebarWidget: {
    altTexts:{
        product: "Product"
    },
    select: {
      field: "Select a field",
      products: "Select a product",
      noOptions: "Select a field first",
    },
    noProducts: "No Products Selected",
    labels: {
      nameLbl: "Name",
      typeLbl: "Type",
      skuLbl: "SKU",
      descriptionLbl: "Description",
      priceLbl: "Price",
    },
    featured: {
      yes: "Yes",
      no: "No",
    },
  },
  deleteModal: {
    header: "Delete",
    body: "This will delete <b>&apos;$&apos;</b> permanently.",
    cancelButton: "Cancel",
    confirmButton: "Delete",
  },
  warnings: {
    invalidCredentials:
      "The credentials you entered for the $ app are invalid or missing. Please update the configuration details and try again.",
    somethingWentWrong:
      "Something went wrong while fetching data, please try again.",
    cookiesBlocked:
      "Third-party cookies are blocked. To use the $ app, please disable this setting in your browser.",
  },
  Decryption: {
    keySize: "256",
    iterations: "100",
  },
};
