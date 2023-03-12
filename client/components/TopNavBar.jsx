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
  showTypingChart : () => dispatch(actions.showTypingChart()),
});


const TopNavBar = props => {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setshowSignupModal] = useState(false);

  const toggleShowLoginModal = () => {
    setShowLoginModal(!showLoginModal)
  }

  const toggleShowSignupModal = () => {
    setshowSignupModal(!showSignupModal)
  }

  return (
    <div className='top-nav-bar'>

        <button onClick={toggleShowLoginModal}>login</button> 
        <button onClick={toggleShowSignupModal}>signup</button> 
        <SignupModal show={showSignupModal}/>
        <LoginModal show={showLoginModal}/>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(TopNavBar);