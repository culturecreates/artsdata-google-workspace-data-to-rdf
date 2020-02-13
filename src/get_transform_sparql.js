import getMappingTabName from './get_current_tab_name';

const getSparqlCells = () => {
    const mappingTabName = getMappingTabName();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mappingTabName);
    const data = sheet.getDataRange().getValues();
    const col = data[0].indexOf('Transform SPARQL');
    let sparqlList = [];
    for (let row = 1; row < data.length; row += 1) {
        sparqlList << data[row][col]
    }
    Logger.log(`sparqlList: ${sparqlList}  `);
    return sparqlList;
  };

const getTransformSparql = (graphName) => {
    const sparqlCells = getSparqlList();
    //add graph name

};

export default getTransformSparql;