import React, { Component } from 'react';
import Landing from './components/Landing.js';
// import Live from './components/Live.js';
import LiveSimple from './components/LiveSimple';
import About from './components/About.js';
import Join from './components/Join.js';
// import Play from './components/Play.js';

//all different site parts get connected together in this App-Component

class App extends Component {
  render() {
    return (
      <div>
        <Landing/>
        {/* <Live/> */}
        <LiveSimple/>
        <About/>
        <Join/>
        {/* <Play/> */}
      </div>
    );
  }
}

export default App;
