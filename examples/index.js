const config = require('./config');
const SocceramaRequest = require('../src/index').SocceramaRequest;
const SocceramaService = require('../src/index').SocceramaService;

const apikey = config.apikey;
const socceramaRequest = new SocceramaRequest({ apikey });
const service = new SocceramaService({ socceramaRequest });

socceramaRequest.get('countries', { include: ['competitions'] })
.then((result) => {
  if (result) {
    // get competition of first country in list
    const { competitions } = result.data.pop();
    console.log(competitions);
  }
})
.catch((error) => {
  console.error(error);
});


// get match by id with stats
service.getMatchById(691088, ['homeStats', 'awayStats'])
.then((result) => {
  console.log(result);
});

// get matches by date range (YYYY-mm-dd) with home team stats
service.getMatchesByDateRange({ start: '2017-01-10', end: '2017-01-17' }, ['homeStats'])
.then((result) => {
  console.log(result);
});
