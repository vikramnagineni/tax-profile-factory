export const UI_PAGE = "page";
export const UI_COMP = "comp";

export default {
  moduleAreas: {
    areas: []
  },
  favoriteAreas: [],
  environment : {
    tfSaas: sessionStorage.getItem("tfSaas") === 'true',
    isEU: true
  },

  formData: { data: {}, isOpen:   false, mode: "New", index: null },

  formFilterData: {
    companyCode: "",
    taxCode: "",
    startDate: "",
    riskClass: "",
    taxType: "",
    formNumber: 0,
    companyName: "",
    company: "",
    courtesy: false,
    fein: "",
    name: ""
  },
  formDeleteData: {
    companyCode: "",
    taxCode: ""
  },
  formSaveData: {
    companyCode: "",
    taxCode: "",
    formdata: {}
  },
  parentData:{},
  parentInfo:{}
};
