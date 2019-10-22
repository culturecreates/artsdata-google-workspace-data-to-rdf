const showCredits = () => {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Developed for the cultural sector by Culture Creates.', ui.ButtonSet.OK);
};

export default showCredits;
