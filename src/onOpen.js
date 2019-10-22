const onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu('⧇ Data-to-RDF')
    .addItem('Show Sidebar', 'showSidebar')
    .addSeparator()
    .addItem('Credits', 'showCredits')
    .addToUi();
};

export default onOpen;
