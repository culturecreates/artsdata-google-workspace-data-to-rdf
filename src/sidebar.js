const showSidebar = () => {
  const template = HtmlService.createTemplateFromFile('index');
  template.graph_name = `http://kg.artsdata.ca`;
  template.user_name = Session.getActiveUser().getEmail();
  const html = template.evaluate().setTitle('Data-to-RDF');
  SpreadsheetApp.getUi().showSidebar(html);
};

export default showSidebar;
