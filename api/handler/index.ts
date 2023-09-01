/* you can make changes in this file and the functions as per your api requirements */

import axios from 'axios';
import constants from '../constants';
import root_config from '../root_config';

const _getApiOptions: any = (
  {
    page,
    limit,
    query,
    searchParam,
    id,
    searchCategories,
  }: {
    page?: number;
    limit?: number;
    query?: any;
    searchParam?: string;
    id?: any;
    searchCategories?: any;
  },
  key: any,
) => {
  const url: string = `${root_config.getUrl(key, query, searchParam, searchCategories, id, page, limit)}`;
  return { url, method: 'GET', headers: root_config.getHeaders(key) };
};

// common function for making third party API calls
// you can modify it as per your third party service response
const _makeApiCall: any = async (opts: any) => {
  try {
    const res: any = await axios({ ...opts, timeout: constants.REQ_TIMEOUT });
    return res?.data;
  } catch (e: any) {
    if (e?.response?.status === constants.HTTP_ERROR_CODES.NOT_FOUND) {
      return {
        data: {
          id: e?.response?.data?.title?.match(constants.EXTRACT_ID_REGX)[0],
          error: e?.response?.data?.title,
        },
      };
    }
    console.error(constants.HTTP_ERROR_TEXTS.API_ERROR);
    console.error(e);
    throw e;
  }
};
// get a particular product
export const getById: any = ({ id, query }: any, key: any) => _makeApiCall(_getApiOptions({ id, query }, key));

// get all products and categories
export const getProductAndCategory: any = async (data: any, key: any) => {
  const response = await _makeApiCall(_getApiOptions(data, key));
  if (root_config.getProductAndCategory) {
    return root_config.getProductAndCategory(data, response);
  } return response;
};

const getByCategoryId = (data:any, query:any, key:any) => Promise.all(
  data.map(async (category:any) => {
    const url = root_config.getByCategoryIdUrl(key, query, category);
    const categoryResponse = await _makeApiCall({ url, method: 'GET', headers: root_config.getHeaders(key) });
    categoryResponse.catalogId = category.catalogId;
    categoryResponse.catalogVersionId = category.catalogVersionId;
    return categoryResponse;
  }),
).then((response) => response)
  .catch((err:any) => {
    console.error(err);
  });

// get an array of selected products and categories
export const getSelectedProdsAndCats: any = async (data: any, key: any) => {
  if (root_config.getSeparateProdCat && root_config.getSeparateProdCat === true) {
    let response;
    if (data?.query === 'product') {
      const idsArr = data?.['id:in'].split(',').filter((id:any) => id !== '');
      response = await Promise.all(
        idsArr.map((id:any) => getById({ id, query: data?.query }, key)),
      );
    } else {
      response = await getByCategoryId(key?.selectedIDs, 'category', key);
    }

    return { [root_config.URI_ENDPOINTS[data?.query]]: response };
  }
  const url = root_config.getSelectedProductandCatUrl(data, key);
  return _makeApiCall({
    url,
    method: 'GET',
    headers: root_config.getHeaders(key),
  });
};

// filter products as per categories
export const filterByCategory: any = (data: any, key: any) => _makeApiCall({
  url: `${root_config.getUrl(key, data?.query)}?categories:in=${data['categories:in']}&${root_config.PRODUCT_URL_PARAMS}`,
  method: 'GET',
  headers: root_config.getHeaders(key),
});
