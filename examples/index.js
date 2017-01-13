const config = require('./config');
const SocceramaRequest = require('../src/index').SocceramaRequest;

const apikey = config.apikey;
const request = new SocceramaRequest({ apikey });

request.get('countries', { include: ['competitions'] })
.then((result) => {
  if (result) {
    // get competition of first country in list
    const { competitions } = result.data.pop();
    console.log(competitions);
  }
})
.catch((error) => {
  console.warn(error);
});
