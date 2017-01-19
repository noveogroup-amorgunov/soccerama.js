<h1 align="center">
  soccerama.js
  <br>
</h1>

<h4 align="center">Request wrapper and services for soccerama API</h4>

<p align="center">
  <a href="https://travis-ci.org/noveogroup-amorgunov/soccerama.js">
    <img src="https://travis-ci.org/noveogroup-amorgunov/soccerama.js.svg?branch=master"
         alt="Travis Build Status" />
  </a>
  <a href="https://www.npmjs.com/package/soccerama.js">
    <img src="https://img.shields.io/npm/dm/soccerama.js.svg"
         alt="Downloads per month" />
  </a>
  <a href="https://www.npmjs.com/package/soccerama.js">
    <img src="https://img.shields.io/npm/v/soccerama.js.svg"
         alt="Version" />
  </a>
  <a href="https://www.npmjs.com/package/soccerama.js">
    <img src="https://img.shields.io/npm/l/soccerama.js.svg"
         alt="License" />
  </a>
</p>

## Installation

```js
npm install soccerama.js --save
```

## Usage SocceramaRequest
`SocceramaRequest` provide one public method - `get`. Using this method you can send request by endpoint.


```javascript

const SocceramaRequest = require('soccerama.js').SocceramaRequest;

const request = new SocceramaRequest({ apikey: 'YOUR_API_KEY' });

// send request
request.get(endpoint, options).then(data => console.log(data));
```

### `endpoint`
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

## Usage SocceramaService
`SocceramaService` provide methods for getting data by easiest way.

```javascript
const SocceramaRequest = require('soccerama.js').SocceramaRequest;
const SocceramaService = require('soccerama.js').SocceramaService;

const socceramaRequest = new SocceramaRequest({ apikey: 'YOUR_API_KEY' });
const service = new SocceramaService({ socceramaRequest, eagerLoading: true });

// e.g. get match by id
service.getMatchById(691088, ['homeStats', 'awayStats']).then(data => ... );
```

You can pass `eagerLoading` option to constructor - if it's true, then all available includes will be loaded auto. For example, `competition` can include `['country', 'currentSeason', 'seasons']` and all of them will be include to request.

But `eagerLoading` not load related includes (like `matches.homeStats`). You can pass this option to method (see example). All available options will be concat with your includes (without dublicates).

```javascript
service.getSeasonById(651, ['matches.homeTeam']);
```

### Available methods

All of them return object or array with data (which not wrapped in `data` object).

- `getCompetitions(include)`
- `getCompetitionById(id, include)`
- `getSeasons(include)`
- `getSeasonById(id, include)`
- `getMatchesBySeasonId(id, include)`
- `getTeamsBySeasonId(id, include)`
- `getTeamsById(id, include)`
- `getStandingById(id)`
- `getMatchById(id, include)`
- `getMatchesByTeamIdAndSeasonId({ teamId, seasonId }, include)`
- `getMatchesByDateRange({ start, end }, include)` Date in `YYYY-mm-dd` format

### Create own method

You can create own method for get some data. Overall construction looks like following:

```javascript
getTeamsBySeasonId(id, include) {
  return this.fetch({
    endpoint: 'teams/season/{id}',
    params: { id, include },
    get: result => result.data,
    availableIncludes: ['players', 'venue', 'coach', 'chairman']
  });
}
```
- `endpoint` - endpoint string
- `params` - this params will replace corresponding values in endpoint (in SocceramaRequest instance).
- `get` - function, which handle result
- `availableIncludes` - includes, which load auto (if `eagerLoading` is `true`)

For example, next method get video by match id from wao3iewu:

```javascript
const SocceramaService = require('soccerama.js').SocceramaService;
  
SocceramaService.prototype.getVideoByMatchId(id, include) {
  return this.fetch({
    // endpoint, see https://soccerama.pro/docs/1.2/videos
    endpoint: 'videos/match/{id}',
    // params for SocceramaRequest
    params: { id, include },
    // filter videos and return from `wao3iewu`
    get: result => result.data.filter(video => video.url.indexOf('wao3iewu') !== -1)
    // availableIncludes: [] - not available includes
  });
}

module.exports = SocceramaService;

// ...

const MySocceramaService = require('path-to-override-molude');
// create instance of SocceramaRequest and MySocceramaService

mySocceramaService.getVideoByMatchId(691088).then(videos => ... );
```

### Examples

- Get match by id with stats

```javascript
service.getMatchById(691088, ['homeStats', 'awayStats'])
.then((result) => {
  console.log(result);
});
```

- Get matches by date range (`YYYY-mm-dd`) with home team stats

```javascript
service.getMatchesByDateRange({ start: '2017-01-10', end: '2017-01-17' }, ['homeStats'])
.then((result) => {
  console.log(result);
});
```
