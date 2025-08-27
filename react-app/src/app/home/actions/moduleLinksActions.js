import * as types from "../../../base/constants/ActionTypes";
export function setModuleAreas(moduleAreas) {
  return {
    type: types.SET_MODULE_AREAS,
    moduleAreas
  };
}
