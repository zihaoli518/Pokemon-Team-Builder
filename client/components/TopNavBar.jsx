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
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'

import { connect } from 'react-redux';

import * as actions from '../actions/actions';

import SignupModal from './modals/SignupModal.jsx';
import LoginModal from './modals/LoginModal.jsx';


const mapStateToProps = state => {
  return {
    isLoggedIn: state.loginFunctions. isLoggedIn,
    username: state.loginFunctions.username
  }
}


const mapDispatchToProps = dispatch => ({
  toggleMainDivState : (str) => dispatch(actions.toggleMainDivState(str)),
  changeUserState : (username) => dispatch(actions.changeUserState(username)),
});


const TopNavBar = props => {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [redirectUser, setRedirectUser] = useState(true);

  const nav = useNavigate();



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

  if (props.isLoggedIn && redirectUser) {
    console.log('props.isLoggedIn')
    setRedirectUser(false);
    nav("/users/" + props.username)
  }

  return (
    
    <div className='top-nav-bar'>
      <div className='top-nav-bar-buttons'>
      {(props.isLoggedIn)? <h3>{props.username}</h3>:
        <div>
          <button onClick={() => {console.log('login clicked'); toggleShowLoginModal()}}>login</button> 
          <button onClick={() => {console.log('sign up clicekd'); toggleShowSignupModal()}}>signup</button> 
        </div>
        }
      </div>
          <LoginModal show={showLoginModal} toggle={toggleShowLoginModal} changeUserState={props.changeUserState} toggleShowLoginModal={toggleShowLoginModal}/>
          <SignupModal show={showSignupModal} toggle={toggleShowSignupModal}/>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TopNavBar);