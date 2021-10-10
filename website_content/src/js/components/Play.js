import React, { Component } from 'react';
import * as config from '../Config.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Play extends Component {

  constructor () {
    super()
    this.state = {
      isHidden: true, //if the imprint info is displayed or not
      // expanded: 'panelp1'
    }
  }

  handleChange(expand, panel){
    console.log(panel);
    console.log(expand);
    this.setState ({
      expanded : expand ? panel: false,
    });
  };

  render() {
    return (
      // Page content
      <div className="Play">
        {/* <img id="joinPolygonOrange" src={config.imagePath+"/polygons/join_orange.png"}/> */}
        <div id="heading">
          <h1>Now Play.</h1>
          <h2>+ Observe the wandering 1200-line.</h2>
          <h2>+ Get in <a target="_blank" href="mailto:contact@earthlat1200.org">contact</a> and tell your story.</h2>
          <h2>+ Register your sundial webcam.</h2>
        </div>
        <div id="exsummary">
          <ExpansionPanel expanded={this.state.expanded === 'panelp1'} onChange={(expanded) => this.handleChange(expanded, 'panelp1')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Project Structure</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div id="exdetail">
                <p>There is a core description about the idea, the data flow, the need for the partner stations including some cost estimations. This is the content of <a href={config.filePath+"/EarthLAT1200_Project_V3.pdf"} target="_blank" rel="noopener noreferrer">EarthLAT1200_Project.pdf</a>:</p>
                <p><ul>
                  <li>aim of the project</li>
                  <li>core meeting point</li>
                  <li>data flow structure</li>
                  <li>short outlook of a single partner station</li>
                  <li>different contribution levels for partner sations</li>
                  <li>estimated costs of a partner station.</li>
                </ul></p>
                <p>A more detailed <a href={config.filePath+"/EarthLAT1200_PartnerKEPLERUHR_V3.pdf"} target="_blank" rel="noopener noreferrer">description of a partner station</a> - here KEPLERUHR - contains:</p>
                <p><ul>
                  <li>outlook of a single partner station</li>
                  <li>HW/SW-structure</li>
                  <li>configuration files for automated readout</li>
                  <li>estimated costs of a partner station.</li>
                </ul></p>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={this.state.expanded === 'panelp2'} onChange={(expanded) => this.handleChange(expanded, 'panelp2')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Partners</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div id="exdetail">
                <p>Get/download the <a href={config.filePath+"/FolderEarthLAT1200_V63.pdf"} target="_blank" rel="noopener noreferrer">project folder</a>.</p>
                <p>The schedule is (now, June 2019, we are at 2.):</p>
                <p>1. Embed the first webcam showing a sundial</p>
                <p><strong>2. Present this project at meetings, mailing lists etc.</strong></p>
                <p>3. Open the call for contributions</p>
                <p>4. Embed other webcams and start the automated switching.</p>
                <p>This is the first candidate supporting data for this project:</p>
                <p><strong>KEPLERUHR</strong> – a huge vertical sundial<br /> N 48° 14′ 06,7″ – O 13° 50′ 01,3″<br /> Grieskirchen, AUSTRIA<br /> <a href="https://kepleruhr.eu" target="_blank" rel="noopener noreferrer">https://KEPLERUHR.eu</a></p>
                <p>Due to latest presentations the list of interested teams is growing:</p>
                <p><ul>
                  <li>Malaysia - at least 1</li>
                  <li>Germany - at least 4</li>
                  <li>Romania - at least 1</li>
                  <li>Thailand - at least 1.</li>
                </ul></p>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={this.state.expanded === 'panelp3'} onChange={(expanded) => this.handleChange(expanded, 'panelp3')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Register</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div id="exdetail">
                <p>The registration procedure needs some little paper work:</p>
                <p>1) A new partner station downloads/fills a form.<br /><em>(displayed June 2019 bc §) </em>.</p>
                <p>2) You may send the filled form via e-mail to <a href="mailto:register@earthlat1200.org">register@earthlat1200.org</a>.</p>
                <p>3) The registration will be checked by staff members. They will reply with the according FTP/Login data.</p>
                <p>4) Start your uploading of moving shadow images!</p>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
    );
  }
}

export default Play;
