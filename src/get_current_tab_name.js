const getCurrentTabName = () => {
  return SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet()
    .getName()
    .replace(/ /g, '');
};

export default getCurrentTabName;
