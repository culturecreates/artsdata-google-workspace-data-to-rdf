import callTripleStore from './call_triple_store';
import getTurtleData from './get_turtle_data';
import getCurrentTabName from './get_current_tab_name';
import getTransformSparql from './get_transform_sparql';

const getPrefixes = () => {
  // example output "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prefix');
  const data = sheet.getDataRange().getValues();
  let prefixes = '';
  for (let row = 1; row < data.length; row += 1) {
    prefixes += `PREFIX ${data[row][0]}  <${data[row][1]}>  `;
  }
  Logger.log(prefixes);
  return prefixes;
};

const updateGraph = graphName => {
  const turtleData = getTurtleData();
  const sparql = `${getPrefixes()} INSERT DATA  {  GRAPH ${graphName} { ${turtleData} }}`;
  return callTripleStore(sparql);
};

const dropGraph = graphName => {
  const sparql = `DROP GRAPH ${graphName}`;
  return callTripleStore(sparql);
};

const transformGraph = graphName => {
  const transforms = getTransformSparql(graphName);
  const transformResults = [];
  for (let x = 0; x < transforms.length; x += 1) {
    const sparql = transforms[x];
    transformResults.push(`Transform ${x}: ${callTripleStore(sparql)}`);
  }
  return transformResults;
};

const pushData = (data = { graphBase: 'http://kg.artsdata.ca' }) => {
  Logger.log(`pushData received: ${data.graphBase} `);
  const graphName = `<${data.graphBase}/${getCurrentTabName()}>`;
  dropGraph(graphName);
  const results = [];
  results.push(`Update: ${updateGraph(graphName)}`);
  results.push(transformGraph(graphName));

  return results;
};

export default pushData;
