import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Row, Col } from "reactstrap";
import { closeForm, setFormData } from "../actions/formActions";
import * as styles from "../../base/constants/AppConstants";
import * as formMetaData from "../metadata/metaData";
import * as fieldData from "../metadata/fieldData";
import autocompleteSelectAPI from "../api/autocompleteselectAPI";
import { setFilterFormData } from "../actions/filterFormActions";
import { tftools } from "../../base/constants/TFTools";
import { ReusableModal, DynamicForm, FlyoutMenu } from "bsiuilib";
class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      pgid: "",
      isfilterform: true
    };
    this.search = this.search.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.toggle = this.toggle.bind(this);
    this.renderMe = this.renderMe.bind(this);
    this.setFavorite = this.setFavorite.bind(this);
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  search(e) {
    const { value } = e.target;
    this.setState({
      filter: value
    });
  }
  /**
   * setFavorite
   * @param {*} favorites 
   * @param {*} selectedFavorite 
   * @param {*} action 
   */
  setFavorite(favorites, selectedFavorite, action) {
    setUnSetFavorite(favorites, selectedFavorite, action);
  }
  renderMe(pageId, values, filter) {
    filter && this.props.setFilterFormData(values);
    let data = tftools.find(tftool => tftool.id == pageId);
    renderTPFEmployee("pageContainer", data);
  }

  toggle({id, title, type}) {
    if (!fieldData[id] || id === "maritalStatusReport" || id === "paServicesTaxReport") {
      this.renderMe(id);
    } else {
      const payload = { data: {}, mode: "New" };
      this.props.setFormData(payload);
      this.setState({
        isOpen: true,
        pgid: id,
        formTitle: title,
        isfilterform: true
      });
    }
  }

  async componentDidMount() {
   
  }

  render() {
    const { isOpen, formTitle, isfilterform, pgid } = this.state;
    const { renderMe } = this;
    const { formData } = this.props;
    const formProps = {
      close: this.handleClose,
      pgid,
      renderMe,
      filter: isfilterform
    };

    return (
      <Row>
        <Col>
          <FlyoutMenu
            favorites={this.props.favorites}
            options={tftools}
            showSideMenu={false}
            setFavorite={this.setFavorite}
            renderApplication={this.toggle}
            sectionLayout={this.props.sectionLayout}
          />
          <ReusableModal open={isOpen} close={this.handleClose} title={formTitle} styles={styles}>
            <DynamicForm
              formData={formData}
              formProps={formProps}
              filter={false}
              isfilterform={isfilterform}
              tftools={tftools}
              formMetaData={formMetaData[pgid]}
              fieldData={fieldData[pgid]}
              recentUsage={getUsageData}
              autoComplete={autocompleteSelectAPI}
              styles={styles}
            />
          </ReusableModal>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.formData.isOpen,
    formData: state.formData,
    options: state.moduleAreas.areas.filter(opt => opt.id !== "testHarness"),
    favorites: state.favoriteLinks.filter(opt => opt.id !== "testHarness")
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ closeForm, setFormData, setFilterFormData, saveFavoriteLinks }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
