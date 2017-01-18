/**
 * Soccerama service class for build requests
 */
class SocceramaService {
  /**
   * @param  {Object} options.socceramaRequest instance of SocceramaRequest
   * @param  {boolean} options.eagerLoading - if true, autoloading all available includes
   */
  constructor({ socceramaRequest, eagerLoading }) {
    this.socceramaRequest = socceramaRequest;
    this.eagerLoading = !!eagerLoading;
  }

  getMatchById(id, include) {
    return this.fetch({
      endpoint: 'matches/{id}',
      params: { id, include },
      availableIncludes: [
        'competition',
        'season',
        'homeTeam',
        'awayTeam',
        'venue',
        'events',
        'lineup',
        'homeStats',
        'awayStats',
        'commentaries',
        'odds',
        'videos',
        'referee'
      ]
    });
  }

  getCompetitions(include) {
    return this.fetch({
      endpoint: 'competitions',
      params: { include },
      get: result => result.data,
      availableIncludes: [
        'country',
        'currentSeason',
        'seasons'
      ]
    });
  }

  getCompetitionById(id, include) {
    return this.fetch({
      endpoint: 'competitions/{id}',
      params: { id, include },
      availableIncludes: [
        'country',
        'currentSeason',
        'seasons'
      ]
    });
  }

  // You may include `fixtures` instead of `matches`
  // to only get the upcoming matches.
  getSeasons(include) {
    return this.fetch({
      endpoint: 'seasons',
      params: { include },
      get: result => result.data,
      availableIncludes: [
        'matches',
        'competition',
        'rounds',
        'stages'
      ]
    });
  }

  getSeasonById(id, include) {
    return this.fetch({
      endpoint: 'seasons/{id}',
      params: { id, include },
      availableIncludes: [
        'matches',
        'competition',
        'rounds',
        'stages'
      ]
    });
  }

  getMatchesBySeasonId(id, include) {
    if (include && include.indexOf('matches') === -1) {
      include.push('matches');
    }

    return this.fetch({
      endpoint: 'seasons/{id}',
      params: { id, include },
      get: result => result.matches.data,
      availableIncludes: [
        'matches',
        'competition',
        'rounds',
        'stages'
      ]
    });
  }

  getTeamsBySeasonId(id, include) {
    return this.fetch({
      endpoint: 'teams/season/{id}',
      params: { id, include },
      get: result => result.data,
      availableIncludes: [
        'players',
        'venue',
        'coach',
        'chairman'
      ]
    });
  }

  // @todo sort by group
  getStandingById(id) {
    return this.fetch({
      endpoint: 'standings/season/{id}',
      params: { id },
      get: result => result.data
    });
  }

  getTeamsById(id, include) {
    return this.fetch({
      endpoint: 'teams/{id}',
      params: { id, include },
      availableIncludes: [
        'players',
        'venue',
        'coach',
        'chairman'
      ]
    });
  }

  getMatchesByTeamIdAndSeasonId({ teamId, seasonId }, include) {
    return this.fetch({
      endpoint: 'teams/{teamId}/season/{seasonId}',
      params: { teamId, seasonId, include },
      get: result => result.matches.data
    });
  }

  getMatchesByDateRange({ start, end }, include) {
    // @todo validation start and end (format: YYYY-MM-DD)
    return this.fetch({
      endpoint: 'matches/{start}/{end}',
      params: { start, end, include },
    });
  }

  /**
   * Send request to server via socceramaRequest
   * @param  {string} options.endpoint (resourse string)
   * @param  {object} options.params
   * @param  {function|null} options.get - this function will handle result
   * @param  {array|null} options.availableIncludes - array of available includes for endpoint
   */
  fetch({ endpoint, params, get, availableIncludes }) {
    // set includes for request
    if (availableIncludes) {
      let include = params.include || [];
      if (this.eagerLoading) {
        include = include.concat(availableIncludes.filter(item =>
          include.indexOf(item) < 0));
      } else if (include) {
        include = include.filter(a =>
          availableIncludes.indexOf(a) !== -1 || a.indexOf('.') !== -1);
      }
      params.include = include;
    }

    return new Promise((resolve, reject) =>
      this.socceramaRequest.get(endpoint, params)
      .then((result) => {
        if (result && result.error) {
          reject(JSON.stringify(result.error));
        }
        resolve(get ? get(result) : result);
      })
      .catch(error => reject(error))
    );
  }
}

module.exports = SocceramaService;
