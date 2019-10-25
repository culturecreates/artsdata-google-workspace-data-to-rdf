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
      const propertyMap = {};
      for (let p = 0; p < propertyMapping[0].length; p += 1) {
        propertyMap[propertyMapping[0][p]] = propertyMapping[row][p];
      }
      return propertyMap; // mapped property name in column 2
    }
  }
  return undefined;
};

const formatObject = (predicate, objectString, objTransform, objSplit) => {
  let formattedObject = objectString;

  if (objSplit) {
    if (objSplit === 'LF') {
      formattedObject = `"${formattedObject.split('\n').join('" , "')}"`;
    } else {
      formattedObject = `"${formattedObject.split(objSplit).join('" , "')}"`;
    }
  } else if (objTransform) {
    formattedObject = objTransform.replace(/{{value}}/g, formattedObject);
  } else if (predicate === 'schema:description') {
    formattedObject = `"${formattedObject.replace(/"/g, '\\"')}"`; // escape quotes
  } else if (predicate === 'ado:promotionalDescription') {
    // uriencode
    formattedObject = `"${encodeURI(formattedObject)}"`;
  } else if (typeof objectString === 'string' || objectString instanceof String) {
    formattedObject = `"${formattedObject.replace(/"/g, '\\"')}"`;
  } else {
    formattedObject = `"${formattedObject.toString()}"`; // Convert number to string
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
  let rdfSubject;
  let rdfPredicate;
  let rdfObject;

  for (let row = 1; row < numberRows; row += 1) {
    // if (mappedProperty(data[row][0]) == "") { continue; }   //NEW!!
    const subjectTransform = lookupProperty(propertyMapping, 'ID').Transform;
    rdfSubject = subjectTransform.replace('{{value}}', data[row][idColumn]);

    for (let column = 0; column < numberColumns; column += 1) {
      const propertyMap = lookupProperty(propertyMapping, data[propertyRow][column]);
      if (propertyMap) {
        const rdfProp = propertyMap.Property;
        // Logger.log(`rdfProp: ${rdfProp} propertyMap.Transform: ${propertyMap.Transform}`);
        const objTransform = propertyMap.Transform;
        const objSplit = propertyMap.Split;
        if (data[row][column] && rdfProp && column !== idColumn) {
          rdfPredicate = rdfProp;
          rdfObject = data[row][column];
          outputString += `${rdfSubject} ${rdfPredicate} ${formatObject(
            rdfPredicate,
            rdfObject,
            objTransform,
            objSplit
          )} .   `;
        }
      }
    }
  }
  Logger.log(outputString);
  return outputString;
};

export default getTurtleData;
