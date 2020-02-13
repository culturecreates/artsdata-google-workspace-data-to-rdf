import callTripleStore from './call_triple_store';
import getTurtleData from './get_turtle_data';
import getCurrentTabName from './get_current_tab_name';

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
  let transformResult = [];
  for (let x = 1; x < transforms.length; x += 1) {
    Logger.log(`transform ${x}: ${transforms[x]} `);
    const sparql = `${getPrefixes()} ${transforms[x]}`;
    transformResults << callTripleStore(sparql);
    Logger.log(`transform ${x} result: ${transformResults[x]} `);
  }
  return transformResults;
};


const pushData = (data = { graphBase: 'http://kg.artsdata.ca' }) => {
  Logger.log(`pushData received: ${data.graphBase} `);
  const graphName = `<${data.graphBase}/${getCurrentTabName()}>`;
  dropGraph(graphName);
  updateResult = updateGraph(graphName);
  postProcessResult = transformGraph(graphName);
  return updateResult + transformResult
};

export default pushData;
