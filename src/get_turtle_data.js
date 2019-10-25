const getCurrentTabName = () => {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet()
    .getName();
};

const getMappingTabName = () => {
  // Construct Tab name from Current Tab name
  return `${getCurrentTabName()} Mapping`;
};

const getPropertyMapping = () => {
  const mappingTabName = getMappingTabName();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mappingTabName);
  return sheet.getDataRange().getValues();
};

const lookupProperty = (propertyMapping, prop) => {
  for (let row = 0; row < propertyMapping.length; row += 1) {
    if (propertyMapping[row][0] === prop) {
      return propertyMapping[row][1];
    }
  }
  return undefined;
};

const formatObject = (predicate, objectString, splitDelimiter) => {
  let formattedObject = '';
  if (predicate === 'schema:description') {
    // escape quotes
    formattedObject = `"${objectString.replace(/"/g, '\\"')}"`;
  } else if (predicate === 'ado:promotionalDescription') {
    // uriencode
    formattedObject = `"${encodeURI(objectString)}"`;
  } else if (splitDelimiter) {
    // split string using semicolon
    // ///// const itemList = objectString.split(splitDelimiter);
    // itemList.forEach(function(item, i) {
    //   // formattedObject += expandSingleRole(item, predicate) ;
    //   if (i < itemList.length - 1) {
    //     formattedObject += ' , ';
    //   }
    // });
  } else if (typeof objectString === 'string' || objectString instanceof String) {
    formattedObject = `"${objectString.replace(/"/g, '\\"')}"`;
  } else {
    formattedObject = `"${objectString.toString()}"`;
  }
  // Logger.log(objectString);

  return formattedObject;
};

const getTurtleData = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  const firstRow = 1;
  const firstColumn = 1;

  const idColumn = 1; // getColumnNumFor("ID");   //NEW!!!! start from 0
  const propertyRow = 0;

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  const numberRows = lastRow - firstRow + 1;
  const numberColumns = lastColumn - firstColumn + 1;

  const propertyMapping = getPropertyMapping();
  // var propsToSplitOnSemicolon = getPropsToSplitOnSemicolon();

  const data = sheet.getRange(firstRow, firstColumn, numberRows, numberColumns).getValues();
  let outputString = '';
  let dataSubject;
  let dataPredicate;
  let dataObject;

  for (let row = 1; row < numberRows; row += 1) {
    // if (mappedProperty(data[row][0]) == "") { continue; }   //NEW!!
    dataSubject = `adr:001000-${data[row][idColumn]}`; // NEW!!

    for (let column = 1; column < numberColumns; column += 1) {
      const schemaProp = lookupProperty(propertyMapping, data[propertyRow][column]);
      if (data[row][column] && schemaProp && column !== idColumn) {
        dataPredicate = schemaProp;
        dataObject = data[row][column];
        outputString += `${dataSubject} ${dataPredicate} ${formatObject(
          dataPredicate,
          dataObject
        )} .   `;
      }
    }
  }
  Logger.log(outputString);
  return outputString;
};

export default getTurtleData;
