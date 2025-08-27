import React, { Component } from "react";
import { linkColStyle, favoriteLinkStyle, favoriteListStyle } from "../../css/sidebar-css";
import { Row, Col, UncontrolledTooltip, Container, Button } from "reactstrap";
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.handleRender = this.handleRender.bind(this);
  }

  handleRender(data) {
    this.props.onClick(data);
  }

  removeFavorite(fav) {
    const favorite = this.props.favorites.filter(option => option.id == fav.id);
    const favorites = this.props.favorites.filter(option => option.id !== fav.id);
    setUnSetFavorite(favorites,favorite,0);
  }

  render() {
    const { favorites } = this.props;
    let displayFavorites = favorites.sort().map(item => {
      return (
        <Row key={item.label} className="selected">
          <Col style={linkColStyle}>
            <span id={`jumpto-${item.value}`} onClick={e => this.handleRender(item.id)}>
              {item.label}
            </span>
            <UncontrolledTooltip placement="top" target={`jumpto-${item.value}`}>
              Jump to {item.label}
            </UncontrolledTooltip>
          </Col>
          <Col sm="2">
            <Button id={`markas-${item.value}`} close onClick={e => this.removeFavorite(item)} title="Remove from favorites" />
            <UncontrolledTooltip placement="right" target={`markas-${item.value}`}>
              <span> Remove {item.label} from favorites </span>
            </UncontrolledTooltip>
          </Col>
        </Row>
      );
    });

    function compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const keyA = a.key.toUpperCase();
      const keyB = b.key.toUpperCase();

      let comparison = 0;
      if (keyA > keyB) {
        comparison = 1;
      } else if (keyA < keyB) {
        comparison = -1;
      }
      return comparison;
    }

    displayFavorites = displayFavorites.sort(compare);

    return (
      <Row>
        <Col className="sidebar">
          <p style={favoriteLinkStyle}> Favorite Links</p>
          {displayFavorites ? <Container style={favoriteListStyle}>{displayFavorites.sort()}</Container> : <p> None</p>}
        </Col>
      </Row>
    );
  }
}

export default Sidebar;
