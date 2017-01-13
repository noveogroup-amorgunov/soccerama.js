# soccerama.js
Request wrapper and services for soccerama API

[![Build Status](https://travis-ci.org/noveogroup-amorgunov/soccerama.js.svg?branch=master)](https://travis-ci.org/noveogroup-amorgunov/soccerama.js) [![downloads](https://img.shields.io/npm/dm/soccerama.js.svg)](https://www.npmjs.com/package/soccerama.js) [![version](https://img.shields.io/npm/v/soccerama.js.svg)]() [![license](https://img.shields.io/npm/l/soccerama.js.svg)]()

## Installation

```js
npm install 
```

## Usage

```javascript

const SocceramaRequest = require('../src/index').SocceramaRequest;

const request = new SocceramaRequest({ apikey: 'YOUR_API_KEY' });

// send request
request.get(resource, options).then(data => console.log(data));
```

### `resource`
*Type: String*

Pathname to request url like `"matches"`, `"players"`, `"countries/{id}"` and so on. 
You can get the resource (endpoint) from the [official soccerama documentation](https://soccerama.pro/docs/1.2).

### `options`
*Type: Object|Null*

*Example: `{ id: 683223, include: [players] }`* 

Object literal with `params` (key => value) and `include` (Array) properties. 

- **`params`** - value will replace part of resource string by key. For example, `{id}` in resource string will be replace to `id` from params.
- **`include`**'s elements will be add to query string (to include relations into the response you can pass the include parameter with request).

## Examples

- Get countries

```javascript
request.get('countries').then(data => {
  // will be send request to api with resource like
  // https://api.soccerama.pro/v1.2/countries?api_token={token}
  
  // data: { data: [{ id: 7, name: 'Italy', iso_code: 'ITA' }, { ... }] }
});
```

- Get match with id `683223`

```javascript
request.get('matches/{id}', { id: 683223 }).then(data => {
  // {id} in resource will be replace to id from params
  // https://api.soccerama.pro/v1.2/matches/683223?api_token={token}
  
  // data: { id: 683223, ht_score: '2-0', ft_score: '3-2', ...,  }
});
```

- Get match with id `683223` with included stats for both teams.

```javascript
request.get('matches/{id}', {
  id: 683223,
  include: ['homeStats', 'awayStats']
}).then(data => {
  // {id} in resource will be replace to id from params
  // elements from include will be add to query string too
  // https://api.soccerama.pro/v1.2/matches/683223?api_token={token}&include=homeStats,awayStats
  
  // data: { id: 683223, ht_score: '2-0', ft_score: '3-2', homeStats: { ... }, awayStats: { ... }, ...  }
});

```

- Catch error if data isn't found, token isn't available and so on.

```javascript
request.get('unavailable_resource/{id}', { id: 772841 }).then(data => {
  // ...
})
.catch((error) => {

  // Error: Failed to load page with status code: 404
  // and stacktrace
  console.error(error);
});

```
