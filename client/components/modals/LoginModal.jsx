/**
 * ************************************
 *
 * @module LoginModal
 * @author zi 
 * @date
 * @description TopNavBar
 *
 * ************************************
 */

// importing dependencies 
import React, {useState} from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/actions';

const mapStateToProps = state => {
  return {
    
  }
}

const mapDispatchToProps = dispatch => ({
  showTypingChart : () => dispatch(actions.showTypingChart()),
});


const LoginModal = props => {

  const showModalClassName = props.show ? "modal display-block" : "modal display-none";

  return (
    <div className={showModalClassName}>
      <div className='login-modal'>
        <h2>LOGIN</h2>
        <h3>username:</h3>
        <input type="text" />
        <h3>password:</h3>
        <input type="text" />
        <button onClick={() => {props.toggle(false)}}>Close</button>
      </div>

    </div>
  );
}

export default connect(null, mapDispatchToProps)(LoginModal);