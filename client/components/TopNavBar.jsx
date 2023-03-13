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
    setShowSignupModal(false);
    const currentState = document.getElementById('main-div');
    console.log('inside toggleShowLoginModal, ', currentState.className)
    props.toggleMainDivState(currentState.className);
  }

  const toggleShowSignupModal = () => {
    setShowSignupModal(!showSignupModal);
    setShowLoginModal(false);
  }


  return (
    <div className='top-nav-bar'>

        <button onClick={toggleShowLoginModal}>login</button> 
        <button onClick={toggleShowSignupModal}>signup</button> 
        <LoginModal show={showLoginModal} toggle={toggleShowLoginModal} />
        <SignupModal show={showSignupModal} toggle={setShowSignupModal}/>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(TopNavBar);