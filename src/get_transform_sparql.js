import getMappingTabName from './get_mapping_tab_name';

const getTransformSparql = graphName => {
  const mappingTabName = getMappingTabName();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mappingTabName);
  const data = sheet.getDataRange().getValues();
  const col = data[0].indexOf('Transform SPARQL');
  const sparqlList = [];
  for (let row = 1; row < data.length; row += 1) {
    if (data[row][col]) {
      sparqlList.push(data[row][col].replace(/{{graph}}/g, graphName));
    }
  }
  return sparqlList;
};

export default getTransformSparql;