import callTripleStore from './call_triple_store';
import getTurtleData from './get_turtle_data';

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
  const sparql = `${getPrefixes()}INSERT DATA  {  GRAPH ${graphName} { ${turtleData} }}`;
  callTripleStore(sparql);
};

const dropGraph = graphName => {
  const sparql = `DROP GRAPH ${graphName}`;
  callTripleStore(sparql);
};

const pushData = data => {
  const graphName = `<${data.graph}>`;
  dropGraph(graphName);
  return updateGraph(graphName);
};

export default pushData;
