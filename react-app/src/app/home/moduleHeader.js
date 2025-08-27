import {
    CardBody,
  } from "reactstrap";
  export default function ModuleHeader({ headerInfo }) {
    return (
      <div className="card shadow mb-3">
        <CardBody className="row">          
          <div class="row col mr-2 card-detail">                  
            <table cellpadding="0" cellspacing="0" id="Title-Area" role="presentation">
                <tr>
                  <td class="pl-3 pr-3 col"><i className={`${headerInfo.cardIcon} ico-lg`}></i></td>
                  <td width="100%">
                      <div class="card-title">{headerInfo.title} &nbsp;
                        <a target="_blank" id="help_link" href="/help/mac" title="Click here for more info!"><i class="fas fa-question-circle fa-xs pl-1"></i></a>
                      </div>
                      <div class="desc hide-md">{headerInfo.description}</div>
                  </td>
                </tr>
            </table>                  
          </div>
        </CardBody>
      </div>
    );
  }
  