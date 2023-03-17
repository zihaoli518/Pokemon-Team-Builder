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
    isLoggedIn: state.loginFunctions. isLoggedIn,
    username: state.loginFunctions.username
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
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({username: username, password: password})
    })
      .then(data => data.json())
      .then((data) => {
        console.log('inside LoginModal submitHandler, ', data);
        if (data.status === 'success') {

        }
      })
  }

  const closeModal = (e) => {
    console.log('in closeModal')
    props.toggle(false); 
    // setShowUsernameAlert(false);
    // setShowPasswordAlert(false);
  }

  return (
    <div className={showModalClassName} onSubmit={() => {submitHandler()}}>
      <form className='modal-form'>
        <h2>login</h2>
        <div className="username-div">
            <label>username: </label>        
            <input type="text" name="username" placeholder="" id="username"></input>
        </div>
        <div className="password-div">
            <label>password</label>      
            <input type="text" name="password" placeholder="" id="password"></input>
        </div>
        <input type="submit" id="login-button" value="log in" />
      </form>

        <button className='close-button' onClick={(e) => {closeModal(e)}}>close</button>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(LoginModal);