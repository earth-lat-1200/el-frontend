import React, { Component } from 'react';
import * as config from '../Config.js';

class Landing extends Component {
  
  scrollTo(amount){
    window.scroll({
      top: window.innerHeight*amount,
      left: 0,
      behavior: 'smooth'
    });
  }


  render() {
    return (
      <div className="Landing">
        <nav>
          <img src={config.imagePath+"/logo.png"}/>
          <h1>Earth L.A.T.</h1><h1 id="landingHeadingPartTwo">12:000</h1>
          <div id="landingLinks">
            <button onClick={() => this.scrollTo(1)}>Live</button>
            <button onClick={() => this.scrollTo(2)}>About</button>
            <a href="mailto:contact@earthlat1200.org"><button>Contact</button></a>
            <button onClick={() => this.scrollTo(3)}>Join</button>
            {/* <button onClick={() => this.scrollTo(4)}>Play</button> */}
          </div>
        </nav>
        <div id="landingHeading"><h1>EarthLAT</h1><h1 id="landingHeadingPartTwo">1200</h1></div>
        <h2>watch the rotating earth.</h2>
        <button onClick={() => this.scrollTo(1)} id="landingAction">Watch now</button>
        <div id="landingScrollText">Scroll</div>
        <div id="landingScrollLine"/>
        <img id="landingIllustration" src={config.imagePath+"/illustration.png"}/>
      </div>
    );
  }
}

export default Landing;
