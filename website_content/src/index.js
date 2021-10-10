import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';
import 'babel-polyfill';
import App from './js/App';

//here the ReactDOM-render Method gets called

window.scroll({
  top: 0,
  left: 0,
  behavior: 'smooth'
});

ReactDOM.render(<App />, document.getElementById('app'));
