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
import App from './client/App.jsx';
import background from './background-merged.jpeg'

// importing redux depedencies 
import store from './client/store.js';
import { Provider } from 'react-redux';


render(
  <Provider store={store}>
    <BrowserRouter>

        <App />

    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);

{/* <div className='background' style={{ 
  backgroundImage: `url(${background})` }}> 
   <App />
 </div> */}