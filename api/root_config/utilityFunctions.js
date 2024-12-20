// Import the root configuration
const root_config = require(".");

// Function to generate headers
exports.getHeaders = (key) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer `, // Add logic to include the actual token if needed
  };
};

// Function to calculate the page number
const calculatePage = (skip, limit) => {
  return Math.floor(skip / limit);
};

// Function to construct a URL
exports.getUrl = (
  { skip, limit, query, searchParam, id, searchCategories },
  productPayload
) => {
  let url = `https://`;
  const page = calculatePage(skip, limit);

  if (id) {
    url += `/${id}`;
  } else if (searchParam) {
    url += `/search?query=${searchParam}&${root_config.FIELDS_URL}`;
    if (page) url += `&currentPage=${page}`;
    if (limit) url += `&pageSize=${limit}`;
  } else if (query === "product") {
    url += `${root_config.SEARCH_URL_PARAMS}?${root_config.FIELDS_URL}`;
    if (page) url += `&currentPage=${page}`;
    if (limit) url += `&pageSize=${limit}`;
  } else {
    url += `?offset=${skip}&limit=${limit}`;
  }

  return url;
};

// Function to extract and flatten categories
exports.extractCategories = (categories) => {
  function flat(r, a) {
    const b = {};
    Object.keys(a)?.forEach((k) => {
      if (k !== "subcategories") {
        b[k] = a[k];
      }
    });
    r.push(b);

    if (Array.isArray(a?.subcategories)) {
      b.subcategories = a?.subcategories.map((item) => item?.id);
      return a?.subcategories.reduce(flat, r);
    }
    return r;
  }

  let mutated;
  categories?.catalogs?.forEach((catalog) => {
    const onlineCategories = catalog?.catalogVersions?.filter(
      (version) => version?.id === "Online"
    );

    const formattedCategories = onlineCategories?.[0]?.categories?.reduce(
      flat,
      []
    );

    mutated = formattedCategories?.map((formattedCategory) => {
      formattedCategory.catalogId = catalog?.id;
      formattedCategory.catalogName = catalog?.name;
      formattedCategory.catalogVersionId = "Online";
      return formattedCategory;
    });
  });

  return mutated;
};

// Function to get URL by category ID
exports.getByCategoryIdUrl = (categoryPayLoad, query, category) => {
  const url = `https://`;
  // Add logic to construct the URL based on the payload, query, and category
  return url;
};
