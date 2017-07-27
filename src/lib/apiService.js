// @flow
import axios from 'axios';

import {getAuthorization} from 'lib/auth';

// Axios config object
type RequestConfigType = {
  baseURL?: string,
  headers?: Object,
  params?: Object,
  headers?: Object,
  url?: string,
  method?: string,
  params?: Object,
  data?: Object
};

/**
 * Default axios config object
 * @type {RequestConfigType}
 */
const defaultRequestConfig: RequestConfigType = {
  baseURL: `/api/`,
  method: 'get'
};

/**
 * What to do with the request before handing it back to the calling object
 * @param  {Object}   response Request response
 * @param  {Function} next     resolve(data)
 */
const preProcessResponse = function(response: Object, next) {
  next(response.data);
};

/**
 * What to do with the error before handing it back to the calling object
 * @param  {Object}   err
 * @param  {Function} next     reject(error)
 */
const preProcessError = function(err: Object, next) {
  next(err);
};

/**
 * [description]
 * @param  {String} method HTTP Verb
 * @param  {String} url    Endpoint to hit. No starting slash
 * @param  {Object} data   URL parameters OR post body to be sent
 * @param  {Object} config Axios configuration object
 * @return {Promise}       Promise with response.data OR error
 */
const makeRequest = async function(
  method: string,
  app: string,
  path: string,
  data: ?Object = null,
  config: RequestConfigType = {}
): Promise<any> {
  config.url = `${app}/${path}`;
  config.method = method.toLowerCase();

  // Add an authorization header to the request if a token is available
  var authorization = await getAuthorization(app);
  if (authorization) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = authorization;
  }

  // Combine our passed configuration with the base configuration
  config = Object.assign({}, defaultRequestConfig, config);

  // Set data to the post body or query string
  if (data !== null) {
    if (config.method === 'get' || config.method === 'delete') {
      config.params = data;
    } else {
      config.data = data;
    }
  }

  return new Promise((resolve, reject) => {
    axios
      .request(config)
      .then(response => {
        // Pre-process the response before handing it back to the calling controller
        preProcessResponse(response, resolve);
      })
      .catch(err => {
        // Pre-process the response before handing it back to the calling controller
        preProcessError(err, reject);
      });
  });
};

/*
 * Exported methods shouldn't be used directly from a component; use
 * one of the actual API libs instead.
 */

export function get(app: string, path: string, data: ?Object = null, config: RequestConfigType = {}): Promise<any> {
  return makeRequest('get', app, path, data, config);
}

export function post(app: string, path: string, data: ?Object = null, config: RequestConfigType = {}): Promise<any> {
  return makeRequest('post', app, path, data, config);
}

export function put(app: string, path: string, data: ?Object = null, config: RequestConfigType = {}): Promise<any> {
  return makeRequest('put', app, path, data, config);
}

export function delete_(app: string, path: string, data: ?Object = null, config: RequestConfigType = {}): Promise<any> {
  return makeRequest('delete', app, path, data, config);
}
