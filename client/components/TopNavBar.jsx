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
});


const TopNavBar = props => {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const toggleShowLoginModal = () => {
    setShowLoginModal(!showLoginModal);
    const currentState = document.getElementById('main-div').className;
    if (showSignupModal) {
      setShowSignupModal(false);
      return;
    }
    console.log('inside toggleShowLoginModal, ', currentState)
    props.toggleMainDivState(currentState);
  }

  const toggleShowSignupModal = () => {
    setShowSignupModal(!showSignupModal);
    const currentState = document.getElementById('main-div').className;
    if (showLoginModal) {
      setShowLoginModal(false);
      return;
    }
    console.log('inside toggleShowLoginModal, ', currentState)
    props.toggleMainDivState(currentState);
  }


  return (
    <div className='top-nav-bar'>
      <div className='top-nav-bar-buttons'>
        <button onClick={() => {console.log('login clicked'); toggleShowLoginModal()}}>login</button> 
        <button onClick={() => {console.log('sign up clicekd'); toggleShowSignupModal()}}>signup</button> 

      </div>
        <LoginModal show={showLoginModal} toggle={toggleShowLoginModal} />
        <SignupModal show={showSignupModal} toggle={setShowSignupModal}/>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(TopNavBar);