import root_config from ".";
/* 
You can use this file to write your custom code, 
that you can use in the root config.
*/

export const getHeaders = (key?: any) => {
  return {
    // eslint-disable-next-line
    "Content-Type": "application/json",
    Authorization: `Bearer `,
  };
};

const calculatePage = (skip: any, limit: any) => {
  const page = Math.floor(skip / limit);
  return page;
};

export const getUrl = (
  {
    skip,
    limit,
    query,
    searchParam,
    id,
    searchCategories,
  }: {
    skip?: number;
    limit?: number;
    query?: any;
    searchParam?: string;
    id?: any;
    searchCategories?: any;
  },
  productPayload: any
) => {
  let url = `https://`;
  const page = calculatePage(skip, limit);
  if (id) {
    url += `/${id}`;
  } else if (searchParam) {
    url += `/search?query=${searchParam}&${root_config.FIELDS_URL}${
      page ? `&currentPage=${page}` : ""
    }${limit ? `&pageSize=${limit}` : ""}`;
  } else if (query === "product") {
    url += `?offset=${skip}&limit=${limit}`;
  } else {
    url += `?offset=${skip}&limit=${limit}`;
  }

  return url;
};

export const extractCategories = (categories: any) => {
  function flat(r: any, a: any) {
    const b: any = {};
    Object.keys(a)?.forEach((k: any) => {
      if (k !== "subcategories") {
        b[k] = a[k];
      }
    });
    r.push(b);
    if (Array.isArray(a?.subcategories)) {
      b.subcategories = a?.subcategories.map((item: any) => item?.id);
      return a?.subcategories.reduce(flat, r);
    }
    return r;
  }

  let mutated;
  categories?.catalogs?.forEach((catalog: any, n: any) => {
    const onlineCategories = catalog?.catalogVersions?.filter(
      (version: any) => version?.id === "Online"
    );
    const formattedCategories = onlineCategories?.[n]?.categories?.reduce(
      flat,
      []
    );
    mutated = formattedCategories?.map((formattedCategory: any) => {
      formattedCategory.catalogId = catalog?.id;
      formattedCategory.catalogName = catalog?.name;
      formattedCategory.catalogVersionId = "Online";
      return formattedCategory;
    });
  });
  return mutated;
};

export const getByCategoryIdUrl = (
  categoryPayLoad: any,
  query: any,
  category: any
) => {
  const url = `https://`;
  return url;
};
