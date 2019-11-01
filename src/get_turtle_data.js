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

const formatObject = (predicate, objectString, objTransform, objSplit) => {
  let formattedObject = objectString;

  if (objSplit) {
    if (objSplit === 'LF') {
      formattedObject = `"${formattedObject.split('\n').join('" , "')}"`;
    } else {
      formattedObject = `"${formattedObject.split(objSplit).join('" , "')}"`;
    }
  }
  if (objTransform) {
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

const getDataSheet = () => {
  const sheet = SpreadsheetApp.getActiveSheet();
  return sheet.getDataRange().getValues();
};

const lookupData = (data, row, fieldName) => {
  // 1. get column number of fieldName
  const col = data[0].indexOf(fieldName);

  // 2. get data
  return data[row][col];
};

const getTurtleData = () => {
  const data = getDataSheet();

  const propertyMapping = getPropertyMapping();

  let outputString = '';

  // Mapping table: Field, Property, Transform, Split

  const fieldCol = 2;
  const propertyCol = 0;
  const templateCol = 1;
  const splitCol = 3;

  const idColumn = lookupData(data, 0, propertyMapping[1][fieldCol]); // getColumnNumFor("ID");   //NEW!!!! start from 0

  for (let row = 1; row < data.length; row += 1) {
    // go through each row of the spreadsheet

    const subjectTransform = propertyMapping[1][templateCol]; // Subject must be first row
    const rdfSubject = subjectTransform.replace('{{value}}', lookupData(data, row, idColumn)); // TODO: get rid of idColumn

    for (let mapRow = 2; mapRow < propertyMapping.length; mapRow += 1) {
      // go through each row of mapping table
      const fieldName = propertyMapping[mapRow][fieldCol];
      const rdfPredicate = propertyMapping[mapRow][propertyCol];
      const objTemplate = propertyMapping[mapRow][templateCol];
      const objSplit = propertyMapping[mapRow][splitCol];

      if (rdfPredicate !== '') {
        if (fieldName === '') {
          outputString += ` ${rdfSubject} ${rdfPredicate} ${objTemplate} `;
        } else {
          const rawObject = lookupData(data, row, fieldName);
          if (rawObject !== '') {
            const rdfObject = formatObject(rdfPredicate, rawObject, objTemplate, objSplit);
            outputString += ` ${rdfSubject} ${rdfPredicate} ${rdfObject} `;
          } else {
            // do nothing - avoid entering statements with an empty rdfObject
          }
        }
      } else if (fieldName === '') {
        outputString += `  ${objTemplate} `;
      } else {
        const rawObject = lookupData(data, row, fieldName);
        if (rawObject !== '') {
          const rdfObject = formatObject(rdfPredicate, rawObject, objTemplate, objSplit);
          outputString += `  ${rdfObject} `;
        } else {
          // do nothing - avoid entering statements with an empty rdfObject
        }
      }
    }
  }
  Logger.log(outputString);
  return outputString;
};

export default getTurtleData;
