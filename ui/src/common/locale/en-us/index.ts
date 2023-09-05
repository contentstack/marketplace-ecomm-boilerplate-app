export default {
  appFailedText: {
    errorMessage: "Something went wrong. Please try refreshing the page.",
    appText:
      "If the issue continues, please reach out to us at support@contentstack.com",
    learnMore: "Learn more",
    signFail: "Signature Verification failed",
  },
  configPage: {
    errorInADK: "Something Went Wrong While Loading App SDK",
    saveInEntry: {
      label: "Save In Entry",
      help: "You can select different ways to store your ecommerce data.",
      placeholder: "Enter the structure of data you want to save in the entry",
      instruction:
        "Select Custom Fields to include specific fields from your ecommerce website into your entry or select All Fields to save complete data of the selected product(s) into your entry by adding only a limited number of products.",
      wholeJson: "All Fields",
      customJson: "Custom Fields",
      isCustomJson: "is_custom_json",
    },
    customKeys: {
      label: "Ecommerce Fields",
      help: "Select the keys you want to save",
      placeholder: "Select keys",
      instruction: "Select the keys you want to save",
    },
    pageCount: {
      label: "Items Per Page",
      name: "page_count",
      placeholder: "Enter the number items you want to fetch per page.",
      instruction: "Select the number of items/products to be displayed on a single page while fetching data from your ecommerce site. For example, 1,5,10.",
    },
  },
  gridViewDropdown: {
    Thumbnail: "Thumbnail",
    List: "List",
  },
  EmptyObj: {
    NoResults: "No matching results found!",
    changeQuery:
      "Try changing the search query or filters to find what you are looking for.",
    visitCS: "Not sure where to start? Visit our",
    help: "help center",
  },
  customField: {
    idLbl: "ID",
    add: "Add ",
    noItems: "No $ have been Added",
    listViewTable: {
      imgCol: "Image",
      nameCol: "Name",
      id: "ID",
      price: "Price",
    },
    listActions: {
      drag: "Drag",
      openInConsole: "Open in $",
      delete: "Remove",
    },
    toolTip: {
      content: "Change View",
      thumbnail: "Thumbnail",
      list: "List",
    },
    addHere: "Add",
    buttonText: {
      category: "Category(s)",
      product: "Product(s)",
    },
    categoryCard: {
      customURL: "Custom URL",
    },
  },
  alertModal: {
    header: "Change",
    customChannel:
      "The list of added product(s) will be updated based on the new channel. Unavailable products in the new channel will be removed. Are you sure you want to proceed?",
    customLocale:
      "The details of the added product(s) will be updated based on the new locale. Are you sure you want to proceed?",
    cancelButton: "Cancel",
    confirmButton: "Proceed",
    selectorChannel:
      "All the selected products will be removed. The products of the new channel will be listed. Are you sure you want to proceed?",
    selectorLocale:
      "The details of the listed product(s) will be updated based on the new locale. Are you sure you want to proceed?",
  },
  selectorPage: {
    loadingError: "error loading more data",
    tableFetchError: "error fetching table data",
    initialErr:"error fetching initial data",
    errHandling: "error loading more searched data",
    heading: "$ App",
    noImageAvailable: "Product image not available",
    searchQuery:
      "Try changing the search query or filters to find what you are looking for.",
    searchCase: "Not sure where to start? Visit our ",
    helpCenter: "help center",
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
    close: "Close",
  },
  sidebarWidget: {
    appSdkErr: "appSdk initialization error",
    dropdownLabels: {
      products: "Products",
      fields: "Fields",
    },
    altTexts: {
      product: "Product",
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
    header: "Remove",
    body: "This will remove <b>&apos;$&apos;</b> permanently.",
    cancelButton: "Cancel",
    confirmButton: "Remove",
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
