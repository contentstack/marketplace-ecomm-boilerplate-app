/* you can make changes in this file and the functions as per your api requirements */

import axios from 'axios';
import constants from '../constants';
import root_config from '../root_config';

const _getHeaders: any = (authToken: any) => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'Content-Type': 'application/json',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'X-Auth-Token': authToken,
});

const _getApiOptions: any = (
  {
    page,
    limit,
    query,
    searchParam,
    id,
  }: {
    page?: number;
    limit?: number;
    query?: any;
    searchParam?: string;
    id?: any;
  },
  key: any,
) => {
  let url: string = `${root_config.API_BASE_URL}${root_config.URI_ENDPOINTS?.[query]}`;

  if (searchParam) url += `?${searchParam}&`;
  else if (id) url += `/${id}?`;
  else url += `?page=${page}&limit=${limit}&`;
  if (query === 'product' && root_config.PRODUCT_URL_PARAMS) url += root_config.PRODUCT_URL_PARAMS;
  return { url, method: 'GET', headers: _getHeaders(key?.auth_token) };
};

// commonx function for making third party API calls
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

// get all products and categories
export const getProductAndCategory: any = (data: any, key: any) => _makeApiCall(_getApiOptions(data, key));

// get a particular product
export const getById: any = ({ id, query }: any, key: any) => _makeApiCall(_getApiOptions({ id, query }, key));

// get an array of selected products and categories
export const getSelectedProdsAndCats: any = (data: any, key: any) => {
  let url: string = `${root_config.API_BASE_URL}${
    root_config.URI_ENDPOINTS[data?.query]
  }`;

  url += data['id:in'] ?
    `?id:in=${data['id:in']}`
    : `?sku:in=${data['sku:in']}`;
  if (data?.query === 'product') url += `&${root_config.PRODUCT_URL_PARAMS}`;

  return _makeApiCall({
    url,
    method: 'GET',
    headers: _getHeaders(key?.auth_token),
  });
};

// filter products as per categories
export const filterByCategory: any = (data: any, key: any) => _makeApiCall({
  url: `${root_config.API_BASE_URL}${
    root_config.URI_ENDPOINTS[data?.query]
  }?categories:in=${data['categories:in']}&${root_config.PRODUCT_URL_PARAMS}`,
  method: 'GET',
  headers: _getHeaders(key?.auth_token),
});
