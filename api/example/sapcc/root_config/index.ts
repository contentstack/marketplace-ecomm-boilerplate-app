/* eslint-disable @typescript-eslint/naming-convention */
const root_config: any = {
  API_BASE_URL: 'https://$/occ/v2/', // this api baseUrl is used in handler/index.js. Please replace the $ with the baseURL value from config in handler
  URI_ENDPOINTS: {
    product: 'products',
    category: 'catalogs',
  },
  PRODUCT_URL_PARAMS: '/search',
  FIELDS_URL: 'fields=FULL',
  SENSITIVE_CONFIG_KEYS: ['base_site_id', 'backoffice_url', 'base_url'],

  generateBaseURL: (key:any) => {
    if (key?.is_custom_json) {
      return `https://${key?.configField2}${key?.configField1}`;
    }
    return root_config.API_BASE_URL.replace('$', key?.configField2);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHeaders: (key?: any) => ({
    'Content-Type': 'application/json',
  }),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAuthToken: (key?:any) => {
    const authToken: any = key?.configField2 ?? '';
    return authToken;
  },

  getUrl: (key: any, query: any, searchParam?:any, searchCategories?:any, id?:any, page?:any, limit?:any) => {
    let url = `${root_config.generateBaseURL(key)}${key?.configField3}/${root_config.URI_ENDPOINTS[query]}`;

    if (id) {
      url += `/${id}?${root_config.FIELDS_URL}`;
    } else if (searchParam) {
      url += `/search?query=${searchParam}&${root_config.FIELDS_URL}${page ? `&currentPage=${page}` : ''}${limit ? `&pageSize=${limit}` : ''}`;
    } else if (query === 'product') {
      url += `${root_config.PRODUCT_URL_PARAMS}?${root_config.FIELDS_URL}${page ? `&currentPage=${page}` : ''}${limit ? `&pageSize=${limit}` : ''}`;
    } else {
      url += `?${root_config.FIELDS_URL}`;
    }

    return url;
  },

  getByCategoryIdUrl: (key:any, query:any, category:any) => {
    const url = `${root_config.generateBaseURL(key?.config)}${key?.config.configField3}/${root_config.URI_ENDPOINTS[query]}/${category?.catalogId}/${category?.catalogVersionId}/categories/${category?.id}`;
    return url;
  },

  extractCategories: (categories: any) => {
    function flat(r:any, a:any) {
      const b: any = {};
      Object.keys(a)?.forEach((k: any) => {
        if (k !== 'subcategories') {
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
      const onlineCategories = catalog?.catalogVersions?.filter((version: any) => version?.id === 'Online');
      const formattedCategories = onlineCategories[n]?.categories?.reduce(flat, []);
      mutated = formattedCategories?.map((formattedCategory: any) => {
        formattedCategory.catalogId = catalog?.id;
        formattedCategory.catalogName = catalog?.name;
        formattedCategory.catalogVersionId = 'Online';
        return formattedCategory;
      });
    });
    return mutated;
  },

  getProductAndCategory: (data:any, response:any) => (data?.query === 'category' ? { catalogs: root_config.extractCategories(response) } : response),

  getSelectedProductandCatUrl: (data:any, key:any) => {
    let url: string = root_config.getUrl(key, data?.query);
    const urlHasQueryParams: boolean = url.indexOf('?') > -1;
    url += data['id:in'] ?
      `${urlHasQueryParams ? '&' : '?'}id:in=${data['id:in']}`
      : `${urlHasQueryParams ? '&' : '?'}sku:in=${data['sku:in']}`;
    if (data?.query === 'product') url += root_config.PRODUCT_URL_PARAMS;
    if (data?.limit) url += `&limit=${data?.limit}`;
    return url;
  },

  getSeparateProdCat: true,
};

export default root_config;
