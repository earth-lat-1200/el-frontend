import axios from 'axios';
import * as imageService from './ImageService';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

//here the Live-mechanism gets started
export function start() {
  //a connection to the signalr-server is getting build
  const hubConnectionBuilder = new HubConnectionBuilder();
  const url = 'http://52.169.163.30:5000';
  const hubConnection = hubConnectionBuilder
    .withUrl(url + '/notify')
    .build();

  console.log(hubConnection);

  //the connection is started
  hubConnection.start()
    .then(() => console.log('Connection started!'))
    .catch((err) => {
      console.log('Connection failed!');
    });

  //this listener waits for a new image or station
  hubConnection.on('newCurrent', function (message) {
    console.log('new Current');
    if (message == "picture") {
      //if it is an image the current image is getting retreived and set to the live-element
      imageService.setImage2Element(url + '/api/picture/current', document.getElementById('live'));
    }
    else {
      //if it is a station the new station is retreived from the REST-service and also displayed
      getStationInfo(url + '/api/stations/current');
    }
    console.log('GET CURRENT LAT');
  });

  //after the first start it trys to display the current image and station
  imageService.setImage2Element(url + '/api/picture/current', document.getElementById('live'));
  getStationInfo(url + '/api/stations/current');
}

function handleConnectionError(err) {
  console.log("Connection failed!");
  console.log(err.message.length);
  console.log("ERROR MESSAGE: " + err.message + "!");
}

export function getStationInfo(url) {
  axios.get(url)
    .then(function (response) {
      console.log(response);
      setInfo(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function setInfo(info) {
  console.log('SETTING INFO');
  let element = document.getElementById('stationName');
  console.log(element);
  if(element.classList.contains('getsData')){
    element.innerHTML = info.name;
  }
  element = document.getElementById('stationCountry');
  if(element.classList.contains('getsData')){
    element.innerHTML = info.country;
  }
  document.getElementById('stationInfoWebsite').innerHTML = info.websiteLink;
  document.getElementById('stationInfoWebsite').href = 'http://'+info.websiteLink;
  document.getElementById('stationInfoOrganisation').innerHTML = info.organisation;
  document.getElementById('stationInfoTeam').innerHTML = info.team;
  document.getElementById('stationInfoAboutUs').innerHTML = info.text;
  document.getElementById('stationInfoCamType').innerHTML = info.camType;
  document.getElementById('stationInfoTransferType').innerHTML = info.transferType;
  document.getElementById('stationInfoNearbyPublicInstituation').innerHTML = info.nearbyInstitution;
}
