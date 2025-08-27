import { combineReducers } from "redux";
import formData from '../../app/reducers/formReducer';
import formFilterData from '../../app/reducers/filterFormReducer';
import parentData from '../../app/reducers/parentDataReducer';
import parentInfo from '../../app/reducers/parentInfoReducer';
import usage from "../../app/reducers/usageReducer";
import environmentReducer from "../../app/reducers/environmentReducer";

const rootReducer = combineReducers({
  formData,
  formFilterData,
  usage,
  parentData,
  parentInfo,
  environmentReducer,
});
export default rootReducer;
