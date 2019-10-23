import callTripleStore from './call_triple_store';

const pushData = data => {
  const sparql =
    ' PREFIX schema: <http://schema.org/> insert data { GRAPH <http://test.plugin.com> {<http://test.one> a schema:Organization . } }';

  const result = callTripleStore(sparql);
  return `Test updated ${data} ${JSON.stringify(result)}`;
};

export default pushData;
