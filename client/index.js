/**
 * ************************************
 *
 * @module  index.js
 * @author  zi
 * @date
 * @description entry point for application. Hangs React app off of #app in index.html
 *
 * ************************************
 */

// importing react dependencies
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// importing App component 
import App from './App.jsx';
import background from '../assets/background-merged.jpeg'

// importing redux depedencies 
import store from './store.js';
import { Provider } from 'react-redux';

// importing bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.scss';


render(
  <Provider store={store}>
    <BrowserRouter>

        <App />

    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
