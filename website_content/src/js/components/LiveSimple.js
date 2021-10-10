import React, { Component } from 'react';
import * as stationService from '../services/StationServiceSimple.js';
import * as config from '../Config.js';
import { SyncLoader } from 'react-spinners';

class Live extends Component {
  constructor () {
    super()
    this.state = {
      isHidden: true, //if the station info is displayed or not
      tutorial: false //if the tutorial is in focus or not
    }
  }

  //gets called when this Component mounted
  componentDidMount(){
    console.log('Loaded');
    stationService.start(); //starts live-mechanism
    document.getElementById('tutVid').play(); //starts the eye-catcher
  }

  //is called when the info-button is getting clicked
  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden //shows info-box
    })
    stationService.getStationInfo('http://52.169.163.30:5000/api/stations/current'); //retreives station-info
  }

  //is called when the eye-catcher is clicked
  toggleTutorial () {
    console.log('click');
    this.setState({
      tutorial: !this.state.tutorial //shows tutorial
    });
    document.getElementById('stationName').innerHTML = 'Tutorial';
    document.getElementById('stationCountry').innerHTML = '';
    stationService.getStationInfo('http://52.169.163.30:5000/api/stations/current');
  }

  render() {
    return (
      <div className="Live">
        <div className="notVisible" id="loaded">
          <h1 id="stationName" className={this.state.tutorial ? "" : "getsData"}>HTL Grieskirchen</h1><h1 id="stationCountry" className={this.state.tutorial ? "" : "getsData"}>Austria</h1>
          <img className={this.state.tutorial ? "notVisible" : ""} id="info" src={config.imagePath+"/live_info_button.svg"} onClick={this.toggleHidden.bind(this)}/>
          <img className={this.state.tutorial?'small':'big'}  onClick={this.toggleTutorial.bind(this)} id="live" src={config.imagePath+"/test.jpg"}/>
            <video autoPlay muted loop className={this.state.tutorial?'big':'small'} id="tutVid" onClick={this.toggleTutorial.bind(this)}>
              <source src={config.imagePath+"/sundial.mp4"} type="video/mp4" />
            </video>
            <h1 id="tutText">{'<  '}click for {this.state.tutorial?'live':'tutorial'}</h1>
          {!this.state.isHidden && <StationInfo/>}
        </div>
        <div id="tutorialInfo" className={this.state.tutorial ? "" : "notVisible"}>
          <h2>Info</h2>
          <p>
            As the sun moves by the shadow cast opposits
          by moving the other direction. In fact the
          sun stands still and the earth rotates. Because
          this rotation is very regular we can take the
          shadow position as a measure of time. See the
          straight hour lines. Follow the link for more:
          </p>
          <p><b><a href="http://kepleruhr.at/en/operation/38-base-en/operation-en/93-reading-the-time" target="_blank">KEPLERUHR - how to read the sundial</a></b></p>
      </div>
        <div className="visible" id="loader">
          <SyncLoader
            sizeUnit={"px"}
            size={20}
            margin={"10px"}
            color={'#4FB3FF'}
          />
        </div>
        <img id="livePolygonOrange" src={config.imagePath+"/polygons/live_orange.png"}/>
        <img id="landingPolygonBlue" src={config.imagePath+"/polygons/landing_blue.png"}/>
      </div>
    );
  }

}

const StationInfo = () => (
  <div id="stationInfo">
    <h2>Website:</h2>
    <p><b><a id="stationInfoWebsite" target="_blank"></a></b></p>
    <h2>Organisation:</h2>
    <p id="stationInfoOrganisation"></p>
    <h2>Team:</h2>
    <p id="stationInfoTeam"></p>
    <h2>About us:</h2>
    <p id="stationInfoAboutUs"></p>
    <h2>Type of Webcam:</h2>
    <p id="stationInfoCamType"></p>
    <h2>Type of Transfer:</h2>
    <p id="stationInfoTransferType"></p>
    <h2>Nearby Public Institution:</h2>
    <p id="stationInfoNearbyPublicInstituation"></p>
  </div>
)



export default Live;
