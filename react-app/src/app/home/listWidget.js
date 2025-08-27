import React from "react";
import { buttonColStyle } from "../../css/sidebar-css";
const renderAppsList = (props) => {
  const { apps, favorites, renderApplication, generalConfiguration, bulletin } = props;
  const setFavorite = (fav) => {
    if (!props.favorites.some((favItem) => favItem.id === fav.id)) {
      props.setFavorite([...props.favorites, fav], fav, 1);
    }
  };

  let _apps = apps.filter(app => {
    if(app.id == 'enhancedsecurityOption'){
      if(generalConfiguration.canViewEnhancedSec){
        return true;
      }
      return false; // make it false
    }
    if(app.id == 'logins'){
      if(generalConfiguration.manageLogins){
        return true;
      }
      return false; // make it false
    }
    return true;
  })
  const setUnFavorite = (fav) => {
    const favorite = props.favorites.filter((option) => option.id !== fav.id);
    props.setFavorite(favorite, [fav], 0);
  };
  return _apps.map((app) => {
    return (
      <div className="d-flex align-items-center mb-2 app-list">
        {/* <label> */}
          {favorites && favorites.some((fav) => fav.id === app.id) ? (
            <button className="fav-icon mb-auto pl-0" onClick={() => setUnFavorite(app)} style={buttonColStyle} title="Favorite">
              <i class="fas fa-star fav"></i>
            </button>
          ) : (
            <button className="fav-icon mb-auto pl-0" onClick={() => setFavorite(app)} style={buttonColStyle} title="Make Favorite">
              <i class="far fa-star"></i>
            </button>
          )}
        {/* </label> */}
        <div className="d-flex flex-column flex-grow-1">
          <a
            onClick={() =>
              app.type === "externallink" && app.href ? window.open(app.href, "_blank") : renderApplication(app)
            }
            className="text-hover-primary font-weight-bold font-size-lg">
              {app.label}
              {app.id == 'enhancedsecurityOption' && <span className="text-muted small pr-2">
                {generalConfiguration.enhSecOn ? '  is On': '  is Off'}
              </span>
              } 
			  {app.id == 'RegulatoryBulletin' && <span className="text-muted small pr-2">
                  { ' level is '+ bulletin.regulatoryBulletin}
                	</span>
                  } 
				{app.id == 'LocatorV3package' && <span className="text-muted small pr-2">
                   { ' level is '+ bulletin.locatorBulletin}
	                </span>
	               } 
				{app.id == 'Cyclic' && <span className="text-muted small pr-2">
                  { ' level is '+ bulletin.cyclicBulletin}
                	</span>
                  } 	            
              <br />
            <div className="text-muted small pr-2">
              {app.desc} 
            </div>
          </a>
        </div>
      </div>
    );
  });
};

export function ListsWidget(props) {
  const { className, apps, background } = props;
  return (
    <div className={`card shadow card-fixed-md ${className}`}>
      <div className="card-header">
        <div className="card-title">{apps[0] && apps[0].groupId ? (<span> <i className={apps[0].icon}></i> {apps[0].groupId} </span>) : "noGroupId"}</div>
      </div>
      <div className="card-body">{renderAppsList(props)}</div>
      {/* <div className={background + " card-img-overlay"}></div> */}
      {/* <div className={apps[0].background + " card-img-overlay"}></div>     */}
    </div>
  );
}
