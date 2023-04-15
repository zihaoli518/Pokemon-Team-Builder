/**
 * ************************************
 *
 * @module TopNavBar
 * @author zi 
 * @date
 * @description TopNavBar
 *
 * ************************************
 */

// importing dependencies 
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'

import { connect } from 'react-redux';

import * as actions from '../actions/actions';

import SignupModal from './modals/SignupModal.jsx';
import LoginModal from './modals/LoginModal.jsx';


const mapStateToProps = state => {
  return {
    isLoggedIn: state.userFunctions. isLoggedIn,
    username: state.userFunctions.username
  }
}


const mapDispatchToProps = dispatch => ({
  toggleMainDivState : (str) => dispatch(actions.toggleMainDivState(str)),
  changeUserState : (username, responseObj) => dispatch(actions.changeUserState(username, responseObj)),
});


const TopNavBar = props => {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [redirectUser, setRedirectUser] = useState(true);

  const nav = useNavigate();

  useEffect(() => {
    checkLoggedIn();
  }, [props.isLoggedIn])



  const toggleShowLoginModal = () => {
    setShowLoginModal(!showLoginModal);
    const currentState = document.getElementById('main-div').className;
    console.log('inside toggleShowLoginModal, ', currentState)
    if (showSignupModal) {
      setShowSignupModal(false);
      return;
    }
    props.toggleMainDivState(currentState);
  }

  const toggleShowSignupModal = () => {
    setShowSignupModal(!showSignupModal);
    const currentState = document.getElementById('main-div').className;
    console.log('inside toggleShowSignupModal, ', currentState)
    if (showLoginModal) {
      setShowLoginModal(false);
      return;
    }
    props.toggleMainDivState(currentState);
  }

  const logout = () => {
    console.log('inside logout ')
    document.cookie = 'PokemonTeamBuilder=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    nav("../../");
    location.reload();

  }

  const checkLoggedIn = () => {
    if (props.isLoggedIn && redirectUser) {
      setRedirectUser(false);
      nav("/users/" + props.username)
    }

  }

  return (
    
    <div className='top-nav-bar'>
      <div className='top-nav-bar-buttons'>
      {(props.isLoggedIn)? 
        <div className='after-login-username-display'> 
          <h2>welcome back! </h2>
          <h3>{props.username}</h3> 
          <button onClick={() => {console.log('logout clicked'); logout()}}>log out</button> 
        </div>
        :
        <div className='top-nav-bar-buttons-inner'>
          <button onClick={() => {toggleShowLoginModal()}}>login</button> 
          <button onClick={() => {toggleShowSignupModal()}}>signup</button> 
        </div>
        }
      </div>
          <LoginModal show={showLoginModal} toggle={toggleShowLoginModal} changeUserState={props.changeUserState} toggleShowLoginModal={toggleShowLoginModal}/>
          <SignupModal show={showSignupModal} toggle={toggleShowSignupModal}/>
    </div>
  );
}



export default connect(mapStateToProps, mapDispatchToProps)(TopNavBar);