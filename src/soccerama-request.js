const request = require('request');

/**
 * Soccerama class for requests to server
 */
class SocceramaRequest {
  constructor({
    host = 'https://api.soccerama.pro/',
    version = 'v1.2',
    apikey
  }) {
    this.apikey = apikey;
    this.baseUrl = `${host}${version}/`;

    if (!apikey) {
      throw new Error('API key is required params');
    }
  }

  /**
   * serialize Object into a list of parameters
   * ex. obj { token: 12345, action: login } => token=12345&action=login
   * @param  {Object} o
   * @return {String}
   */
  static getParams(o) {
    return Object.keys(o).map(key => `${key}=${encodeURIComponent(o[key])}`).join('&');
  }

  /**
   * replace params from Object in passed string
   * ex. str: "match/{id}", params: {id:5} => "match/5"
   * @param  {String} str
   * @param  {Pbject} params
   * @return {String}
   */
  static replaceParams(str, params = {}) {
    for (const prop of Object.keys(params)) {
      str = str.replace(`{${prop}}`, params[prop]);
    }
    return str;
  }

  /**
   * get request to API with params
   * @param  {String} url
   * @param  {Object|false} params
   * @return {Promise}
   */
  static request(url, params = false) {
    const paramsString = params ? SocceramaRequest.getParams(params) : '';
    const urlWithParams = `${url}?${paramsString}`;

    // console.log(urlWithParams);
    return new Promise((resolve, reject) => {
      request(urlWithParams, (error, response, body) => {
        const { statusCode } = response;
        // handle error
        if (error || statusCode < 200 || statusCode > 299) {
          reject(new Error(`Failed to load page with status code: ${response.statusCode}`));
        }
        resolve(body);
      });
    });
  }

  /**
   * public method for get data from api
   * @param  {String} resource
   * @param  {Object|null} options
   * @return {Promise}
   */
  get(resource, options = {}) {
    return new Promise((resolve, reject) => {
      // add api_token to request
      const params = { api_token: this.apikey };
      const url = this.baseUrl + SocceramaRequest.replaceParams(resource, options);

      if (Array.isArray(options.include) && options.include.length > 0) {
        params.include = options.include.join(',');
      }

      SocceramaRequest.request(url, params)
      .then(result => resolve(JSON.parse(result)))
      .catch(error => reject(error));
    });
  }
}

module.exports = SocceramaRequest;
