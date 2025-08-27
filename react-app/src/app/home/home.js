import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactDOM from "react-dom";
import { Container } from "reactstrap";
import * as formMetaData from "../metadata/metaData";
import * as fieldData from "../metadata/fieldData";
import { tftools } from "../../base/constants/TFTools";
import { formatFieldData } from "../../base/utils/tfUtils";
import { ReusableModal, DynamicForm, SearchBar } from "bsiuilib";
import * as styles from "../../base/constants/AppConstants";
import { isMock } from '../../tpf_employee.js';
import { ListsWidget } from "./listWidget";
import ModuleHeader from "./moduleHeader";
class TFHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: true,
      sideDrawerOpen: true,
      options: [],
      getGridData: this.props.fetchGridData
    };

    this.sectionLayout = [
      [
        {
          section: "Tf-setup-n-maintenance",
          sectionHeader: "Tf-setup-n-maintenance",
          sectionIcon: "book",
          value: "SM"
        }
      ]
    ];

    this.handleClose = this.handleClose.bind(this);
    this.toggle = this.toggle.bind(this);
    this.renderApplication = this.renderApplication.bind(this);
    this.renderMe = this.renderMe.bind(this);
    this.setFavorite = this.setFavorite.bind(this);
  }

  toggle(pageData) {
    const { id, label } = pageData;
    const payload = { data: {}, mode: "New" };
    this.props.setFormData(payload);
    this.setState({
      isOpen: true,
      pgid: id,
      formTitle: label,
      isfilterform: true
    });
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  renderMe(pageId, values, filter) {
    filter && this.props.setFilterFormData(values);
    let data = tftools.find(tftool => tftool.id == pageId);
    renderTPFEmployee("pageContainer", data);
  }

  renderApplication(data) {
    const { id, value } = data;
    if (!fieldData[id] || value !== "UQ" || id === "maritalStatusReport" || id === "paServicesTaxReport") {
      this.renderMe(id);
    } else {
      this.toggle(data);
    }
  }
  /**
   * setFavorite
   * @param {*} favorites 
   * @param {*} selectedFavorite 
   * @param {*} action 
   */
  setFavorite(favorites, selectedFavorite, action) {
    setUnSetFavorite(favorites, selectedFavorite, action);
    this.props.saveFavoriteLinks(favorites, selectedFavorite, action);
  }

  getOptions() {
    let excluededPages=[];
    if(!isMock()){
      excluededPages = ["testHarness", "selectSamplePage", "dateFieldDoc","UQ","CD","GD","CT","MT","TS","PD"];
    }
    let perms = getAllRights();
    if(perms && perms['PN'] && perms['PN'][0]===1){
      perms["SM"] = perms['PN'];
    }
    let arr = tftools.filter(tool => !excluededPages.includes(tool.value) && perms[tool.value] && perms[tool.value][0]===1).sort(this.GetSortOrder("label"));
    console.log(arr);

    const env = this.props.environment;

    if(env.tfSaas) {
      arr = arr.filter(screen => !screen.hideSaaS)
    }
    //return arr ;//tftools.filter(tool => !excluededPages.includes(tool.value)).sort(this.GetSortOrder("label"));
    return tftools;
  }
  getTFTools() {
    let perms = getAllRights();
    if(perms && perms['PN'] && perms['PN'][0]===1){
      perms["SM"] = perms['PN'];
    }
    let arr = tftools.filter(tool => perms[tool.value] && perms[tool.value][0]===1).sort(this.GetSortOrder("label"));
    const env = this.props.environment;

    if(env.tfSaas) {
      arr = arr.filter(screen => !screen.hideSaaS)
    }
    //return arr;
    return tftools;
  }
  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  }

  async componentDidMount() {
    let options = await this.getOptions();
	   this.setState({ options });
  }

  render() {
    const rootEl = document.getElementById("kt_quick_search_toggle");
    const { options } = this.state;
    let groups = [];
    options.sort((a,b) => a.groupOrder - b.groupOrder);
    options.map((option) => {

      if(groups[option.groupOrder]){
        groups[option.groupOrder].push(option);
      }
      else{
        groups[option.groupOrder] = [option];
      }
    });
    groups.map((group) => {
      group.sort((a, b) => a.orderWithInCard - b.orderWithInCard);
    });

    let searchComp = (
      <div style={{ width: "800px" }}>
        <SearchBar
          title="Employee Self Service"
          sectionLayout={this.sectionLayout}
          options={this.getOptions()}		  
          favorites={this.props.favorites}
          setFavorite={this.setFavorite}
          renderApplication={this.renderApplication}
          generalConfiguration={this.state.generalConfiguration}
		      bulletin={this.state.bulletin}
        />
      </div>
    );
    if (rootEl) {
      ReactDOM.render(searchComp, rootEl);
    }
    const { isOpen, formTitle, isfilterform, pgid, generalConfiguration, bulletin } = this.state;
    const { formData } = this.props;
    const formProps = {
      close: this.handleClose,
      pgid,
      renderMe: this.renderMe,
      filter: isfilterform
    };

    const fieldDataX = formatFieldData(fieldData[pgid], pgid, appUserId());

    let headerInfo = {
      title: "Employee Self Service",
      description: "Tax Profile Factory Employee portal",
      cardIcon: "ico-processing ico-lg",
    };
    return (
      <div style={{ marginTop: 0 }}>
        <Container fluid>
        {!rootEl && (<SearchBar
            title="Employee Self Service"
            sectionLayout={this.sectionLayout}
            options={this.getOptions()}
            favorites={this.props.favorites}
            setFavorite={this.setFavorite}
            renderApplication={this.renderApplication}
            generalConfiguration={generalConfiguration}
			bulletin={bulletin}
          />
        )}

         

          <div id="pageContainer" className="">
                    <ModuleHeader headerInfo={headerInfo} />
                    <div class="row">
                    {groups.map((group, index) => {
                        return (
                          <div className="col-lg-6 col-xl-3">
                            <ListsWidget
                              className="card shadow card-fixed-md"
                              favorites={this.props.favorites}
                              apps={group}
                              background={group.background}  
                              setFavorite={this.setFavorite} 
                              renderApplication={this.renderApplication}
                              generalConfiguration={generalConfiguration}
							  bulletin={bulletin}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
        </Container>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    formData: state.formData,
    favorites: state.favoriteLinks,//.filter(opt => opt.id !== "testHarness")
    environment: state.environmentReducer,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(TFHome);
