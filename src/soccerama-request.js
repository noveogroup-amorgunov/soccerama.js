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
      throw new Error('`apikey` is required params');
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
   * replace params from Object to passed string
   * ex. str: "match/{id}", params: {id:5} => "match/5"
   * @param  {string} str
   * @param  {object} params
   * @return {string}
   */
  static replaceParams(str, params = {}) {
    for (const prop of Object.keys(params)) {
      str = str.replace(`{${prop}}`, params[prop]);
    }
    return str;
  }

  /**
   * get request to API with params
   * @param  {string} url
   * @param  {object|false} params
   * @return {promise}
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
   * @param  {string} endpoint
   * @param  {object|null} options
   * @return {promise}
   */
  get(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      // add api_token to request
      const params = { api_token: this.apikey };
      const url = this.baseUrl + SocceramaRequest.replaceParams(endpoint, options);

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
