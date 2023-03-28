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
    isLoggedIn: state.userFunctions.isLoggedIn,
    username: state.userFunctions.username,
    loginLoading: state.userFunctions.loginLoading,
  }
}

const mapDispatchToProps = dispatch => ({
  toggleLoginLoading : () => dispatch(actions.toggleLoginLoading()),
});


const LoginModal = props => {

  const [showUsernameAlert, setShowUsernameAlert] = useState({status: false, message: null});
  const [showPasswordAlert, setShowPasswordAlert] = useState({status: false, message: null});

  const showModalClassName = props.show ? "modal display-block" : "modal display-none";

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('inside submitHandler from logging in...')
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (username==='') {
      setShowPasswordAlert({status:false, message: null})
      setShowUsernameAlert({status:true, message: 'please enter an username'});
      return;
    }
    if (password==='') {
      setShowUsernameAlert({status: false, message: null})
      setShowPasswordAlert({status:true, message: 'please enter a password'});
      return;
    }
    // triggers loading animation 
    props.toggleLoginLoading();

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
        console.log('inside LoginModal submitHandler, ', response); 
        // if success 
        if (response.status==='success') {
          props.changeUserState(response.username, response.savedTeams);
          props.toggleLoginLoading();
          props.toggleShowLoginModal();
        }
        // if username does not exist 
        else if (response.status==='username not found' || response.status==='please enter an username') {
          setShowUsernameAlert({status:true, message: response.status});
        }
        // if password is wrong 
        else if (response.status==='incorrect password') {
          props.toggleLoginLoading();

          setShowPasswordAlert({status:true, message: response.status});
        }

        
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
        console.log(data);
        props.changeUserState(username, data);
        props.toggleShowLoginModal();
        // chage redux state

      })
  }

  console.log('inside loginModal, ', showUsernameAlert, showPasswordAlert)

  return (
    <div className={showModalClassName}>
      <form className='modal-form' onSubmit={(e) => {submitHandler(e)}}>
        <h2>login</h2>
        {showUsernameAlert.status ? 
              <h4>{showUsernameAlert.message}</h4> :
              null
            } 
        <div className="username-div">
            <label>username: </label>        
            <input type="text" name="username" placeholder="" id="login-username"></input>
        </div>
        <div className="password-div">
            <label>password</label>      
            <input type="text" name="password" placeholder="" id="login-password"></input>
        </div>
        {showPasswordAlert.status ? 
              <h4>{showPasswordAlert.message}</h4> :
              null
            }   
        <input type="submit" id="login-button" value="log in" />
      </form>

        <button className='close-button' onClick={(e) => {closeModal(e)}}>close</button>
        {/* <button className='test-button' onClick={(e) => {getUserData('123')}}>test</button> */}
        {(props.loginLoading) ?
          <img id='login-loading-gif' src='/static/loading.gif' alt="" /> :
          null
        }
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);