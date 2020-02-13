import getCurrentTabName from './get_current_tab_name';

const getMappingTabName = () => {
 // Construct Tab name from Current Tab name
 return `${getCurrentTabName()} Mapping`;
  };
  
export default getMappingTabName;
  