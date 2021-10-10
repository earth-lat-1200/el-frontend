import React, { Component } from 'react';
import * as config from '../Config.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Join extends Component {

  constructor () {
    super()
    this.state = {
      isHidden: true, //if the imprint info is displayed or not
      // expanded: 'panelj1'
    }
  }

  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden //shows imprint-box
    })
  }

  handleChange(expand, panel){
    console.log(panel);
    console.log(expand);
    this.setState({
      expanded: expand ? panel: false,
    });
  };

  render() {
    return (
      <div className="Join">
        <img id="joinPolygonOrange" src={config.imagePath+"/polygons/join_orange.png"}/>
        <div id="heading">
          <h1>Join us!</h1>
          <h2>+ Observe the wandering 1200-line.</h2>
          <h2>+ Get in <a href="mailto:contact@earthlat1200.org">contact</a> and tell your story.</h2>
          <h2>+ Register your sundial webcam.</h2>
        </div>
        <div id="exsummary">
          <ExpansionPanel expanded={this.state.expanded === 'panelj1'} onChange={(expanded) => this.handleChange(expanded, 'panelj1')}>
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
          <ExpansionPanel expanded={this.state.expanded === 'panelj2'} onChange={(expanded) => this.handleChange(expanded, 'panelj2')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <h2>Partners</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div id="exdetail">
                <p>Get/download the <a href={config.filePath+"/EarthLAT1200_Folder_V63.pdf"} target="_blank" rel="noopener noreferrer">project folder</a>.</p>
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
                  <li>Thailand - at least 1</li>
                  <li>Spain - at least 1.</li>
                </ul></p>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={this.state.expanded === 'panelj3'} onChange={(expanded) => this.handleChange(expanded, 'panelj3')}>
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
        <div id="jimg">
          <img src={config.imagePath+"/land.png"}/>
        </div>
        <div id="footer">
          <h1 id="Imprint" onClick={this.toggleHidden.bind(this)}>Imprint</h1>
        </div>
        {!this.state.isHidden && <Imprint/>}
      </div>
    );
  }
}

const Imprint = () => (
  <div id="imprintInfo">
    <h2>Imprint</h2>
    <p>Regarding §§ 24f Mediengesetzes (AT)</p>
    <h3>Owner of media</h3>
    <p>Stadtgemeinde Grieskirchen, Stadtplatz 9, A-4710 Grieskirchen</p>
    <h3>Responsible for the content</h3>
    <p>DI. Kurt Niel<br/>
    Stadtplatz 9, 4710 Grieskirchen, Austria<br/>
    E-Mail: contact@earthlat1200.org</p>
    <h3>Design & Implementation</h3>
    <p>Julian Zeilinger, Michael Mayrhofer, HTL Grieskirchen, Austria</p>
    <h3>Disclosure lt. § 25 Abs. 4 des Mediengesetzes (AT)</h3>
    <p>This website gives information to the project <b>Earth L.A.T. 12:00.</b></p>
    <h3>Data Protection Statement</h3>
    <p>
      This website stores webcam images which are sent by partner stations for a given period of time (e.g. 48 hours). The partner station information which is sent by partner stations is stored permanently. Every partner station can resign the given partner station agreement by mail – their data will be deleted within an appropriate time. The access to this site uses Google Analytics data. No other especial individual data of users are stored by the system.
    </p>
    <h3>Place of Jurisdiction</h3>
    <p>Grieskirchen, Austria.</p>
  </div>
)

export default Join;
