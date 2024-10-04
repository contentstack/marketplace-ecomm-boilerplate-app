export default {
  appFailedText: {
    errorMessage: "Something went wrong. Please try refreshing the page.",
    appText:
      "If the issue continues, please reach out to us at support@contentstack.com",
    learnMore: "Learn more",
    signFail: "Signature Verification failed",
  },
  error_Messages: {
    keyInputLimit: `Maximum character limit reached. $ key path length should not exceed 100 characters.`,
  },
  configPage: {
    customWholeJson: {
      modal: {
        header: `Add $ Key Field`,
        label: "Key Name or Path",
        placeholder: "Enter Key Name or Path",
        instructionS:
          'Use the dot format to enter nested objects, for eg: "file.url".',
        instructionE: "Existing labels in the dropdown will not be created.",
        note: "Note: ",
        btn: {
          cancel: "Cancel",
          create: "Create",
          apply: "Create",
        },
        addOption: "New Key Field",
        successToast: {
          type: "success",
          text: `$ Key Field added successfully`,
        },
      },
      notification: {
        errorS: "The option",
        errorE: "already exists",
      },
    },
    errorInADK: "Something Went Wrong While Loading App SDK",
    saveInEntry: {
      label: "Save In Entry",
      help: "You can select different ways to store your ecommerce data.",
      placeholder: "Enter the structure of data you want to save in the entry",
      allFieldsInstruction:
      "The 'All Fields' option allows you to add a limited number of products based on the entry's response data structure. (Refer ",
      customFieldsInstruction:"The 'Custom Field' option allows you to define and select the data structure you want to save in the entry. (Refer ",
      link: "Custom Fields Limitations",
      url: "https://www.contentstack.com/docs/developers/create-custom-fields/limitations-of-custom-fields/",
      contentstackSupportText:
        " for more details). To increase this limit, please contact ",
      wholeJson: "All Fields",
      supportLink: "support.",
      supportUrl: "support@contentstack.com",
      NoteText:"Note: Switching options with existing data in entry may cause data loss. Proceed with caution.",
      customJson: "Custom Fields",
      isCustomJson: "is_custom_json",
      onlyID: "Only ID",
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
      instruction: "You can enter the page count as numbers eg. 1, 5, 10, etc",
    },
    multiConfig: {
      deleteModalNameNotPresent: "Validation error: Config Names don't match",
      buttonLabel: "New Configuration",
      accordionLabel: "$ Configuration",
      setDefaultText: "Set as Default",
      deleteButtonText: "Delete",
      accordionSubLabel: "Configure your $ credentials",
      multiConfigCheckBoxLabel: "Set as Default",
      addConfigurationModal: {
        modalHeaderLabel: "Add Configuration",
        modalFooterButtonLabel: "Add",
        multiConfigNameLabel: "Name",
        multiConfigNameLabelPlaceHolder: "Enter configuration name",
      },
      deleteModal: {
        deleteMessage: "Configuration deleted successfully",
        confirMationText: "Are you sure you want to delete ",
        confirMationYesText:
          " configuration? If yes, type the name of the configuration and press Delete.",
        cancelButtonText: "cancel",
        deleteButtonText: "Delete",
      },

      ErrorMessage: {
        invalidAlphanumeric:
          "Only alphanumeric characters, hyphens, and underscores are allowed, with no spaces.",
        validInputMsg: "Please enter atleast one multiconfig",
        oneDefaultMsg: "Please select at least one default configuration.  ",
        configDefaultMessgae:
          "Please ensure that the latest Shopify app includes at least one default configuration setting.",
        emptyConfigNotifyMsg: "Please enter valid inputs for ",
        oldV2KeysNameMsg:
          "Please enter unique configuration label name. 'legacy_config' is not allowed.",
        duplicateLabelError: {
          msg: "Configuration label name already exists. Please use a different name and try again.",
        },
      },
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
    noConfig: "This Product's config is either deleted or updated",
    noImage: {
      text: "No image available",
    },
    configDeletedImg:
      "We are unable to access the image url. The link could be broken, the asset might be deleted or you do not have access to it.",
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
      newTab: "NewTab",
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
    loadingError: "Error loading more data",
    tableFetchError: "Error fetching table data",
    initialErr: "Error fetching initial data",
    errHandling: "Error loading more searched data",
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
    unexpectedError: "An unexpected error occurred. Please try again later.",
  },
  Decryption: {
    keySize: "256",
    iterations: "100",
  },
  TextInputFieldWithSuffix: {
    tooltip: {
      hide: "Hide",
      show: "Show",
    },
    icon: {
      eyeClose: "EyeClose",
      eye: "Eye",
    },
  },

  errors: {
    badRequest: "Bad Request. Please check your input.",
    unauthorized: "Unauthorized access. Please login again.",
    forbidden: "Forbidden. You do not have permission to access this resource.",
    notFound: "Resource not found. Please check the URL or try again later.",
    tooManyRequests: "Too many requests. Please try again later.",
  },
};
