const callTripleStore = (sparql, operation) => {
  // operation can be "query" or "update".  If empty it will default to "update"

  let url = 'http://db.artsdata.ca/repositories/artsdata';

  const options = {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Authorization: `Basic ${Utilities.base64Encode('artsdata-api:Syjcix-zovwes-7vobmi')}`
    },
    payload: {}
  };
  if (operation === 'query') {
    options.payload = { query: sparql };
  } else {
    options.payload = { update: sparql };
    url += '/statements';
  }

  const response = UrlFetchApp.fetch(url, options);
  Logger.log(`Calling triple store: ${response.getContentText()} ${response.getResponseCode()}`);
  return `Response code: ${response.getResponseCode()} ${response.getContentText()}`;
};

export default callTripleStore;
