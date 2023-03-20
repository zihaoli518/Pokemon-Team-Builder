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

import { Redirect } from 'react-router';

import * as actions from '../../actions/actions';


const mapStateToProps = state => {
  return {
    isLoggedIn: state.loginFunctions. isLoggedIn,
    username: state.loginFunctions.username
  }
}

// const mapDispatchToProps = dispatch => ({
//   changeUserState : () => dispatch(actions.changeUserState()),
// });


const LoginModal = props => {

  const showModalClassName = props.show ? "modal display-block" : "modal display-none";

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('inside submitHandler from logging in...')
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({username: username, password: password})
    })
      .then(response => response.json())
      .then((response) => {
        console.log('inside LoginModal submitHandler, ', response.username); 
        // getUserData(response.username)
      })
  }

  const closeModal = (e) => {
    console.log('in closeModal')
    props.toggle(false); 
    // setShowUsernameAlert(false);
    // setShowPasswordAlert(false);
  }

  const getUserData = (username) => {
    console.log('inside get userData(), ', username)
    fetch(`/api/users/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'PokemonTeamBuilder',
        credentials: 'same-origin',
      },
    })
      .then(data => {
        console.log(data.status)
        props.changeUserState(username)
        props.toggleShowLoginModal()
      })
  }

  return (
    <div className={showModalClassName}>
      <form className='modal-form' onSubmit={(e) => {submitHandler(e)}}>
        <h2>login</h2>
        <div className="username-div">
            <label>username: </label>        
            <input type="text" name="username" placeholder="" id="login-username"></input>
        </div>
        <div className="password-div">
            <label>password</label>      
            <input type="text" name="password" placeholder="" id="login-password"></input>
        </div>
        <input type="submit" id="login-button" value="log in" />
      </form>

        <button className='close-button' onClick={(e) => {closeModal(e)}}>close</button>
        <button className='test-button' onClick={(e) => {getUserData('123')}}>test</button>
    </div>
  );
}

export default connect(mapStateToProps, null)(LoginModal);