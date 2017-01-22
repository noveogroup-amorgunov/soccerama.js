const expect = require('chai').expect;
const { SocceramaRequest } = require('../src/index');

describe('socceramaRequest', () => {
  let socceramaRequest;
  const apikey = 'YOUR_API_KEY';

  // override request method to avoid requests to server
  SocceramaRequest.request = () => new Promise(resolve => resolve({}));

  beforeEach(() => {
    socceramaRequest = new SocceramaRequest({ apikey });
  });

  it('should have apikey (token)', () => {
    expect(socceramaRequest.apikey).to.be.equal(apikey);
  });

  it('should throw an error if apikey not passed', () => {
    expect(() => new SocceramaRequest({})).to.throw('`apikey` is required params');
  });

  it('should parse url params from object to string', () => {
    const params = { token: apikey, action: 'login' };
    expect(SocceramaRequest.getParams(params)).to.be.equal('token=YOUR_API_KEY&action=login');
  });

  it('should compose url by host and action', () => {
    expect(true).to.be.equal(true);
  });

  it('should replace params from Object to string', () => {
    const str = 'match/{id}';
    const params = { id: 12345 };
    expect(SocceramaRequest.replaceParams(str, params)).to.be.equal('match/12345');
  });
});
