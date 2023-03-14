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

  const submitHandler = (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  }

  return (
    <div className={showModalClassName} onSubmit={() => {submitHandler()}}>
      <form className='login-modal'>
        <h2>LOGIN</h2>
        <div className="username-div">
            <label>username: </label>        
            <input type="text" name="username" placeholder="" id="username" required></input>
        </div>
        <div className="password-div">
            <label>password</label>      
            <input type="text" name="password" placeholder="" id="password" required></input>
        </div>
        <input type="submit" id="login-button" value="Log in" />
        <button onClick={() => {props.toggle(false)}}>close</button>
      </form>

    </div>
  );
}

export default connect(null, mapDispatchToProps)(LoginModal);