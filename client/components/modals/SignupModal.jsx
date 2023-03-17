/**
 * ************************************
 *
 * @module SignupModal
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


const SignupModal = props => {
  const [showUsernameAlert, setShowUsernameAlert] = useState(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  const submitHandler = (e) => {
    e.preventDefault();
    setShowUsernameAlert(false);
    setShowPasswordAlert(false);
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    console.log('inside submitHandler, ', username, password)
    if (username==='') {
      setShowUsernameAlert(true);
      return;
    }
    if (password==='') {
      setShowPasswordAlert(true);
      return;
    }

    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({username: username, password: password})
    })
      .then(data => data.json())
      .then((data) => {
        console.log('inside SignupModal submitHandler, ', data);
        if (data.status === 'success') {
          alert('signup successful');
          const divToBeDeleted = document.getElementById("signup-modal-form");
          divToBeDeleted.remove();
          setShowSuccessMessage(true);
        }  
      })
  }

  const closeModal = (e) => {
    console.log('in closeModal')
    props.toggle(false); 
    setShowUsernameAlert(false);
    setShowPasswordAlert(false);
    setShowSuccessMessage(false);
  }

  const showModalClassName = props.show ? "modal display-block" : "modal display-none";

  return (
    <div className={showModalClassName}>
      <form className='modal-form' id='signup-modal-form' onSubmit={(e) => {submitHandler(e)}}>
        <h2>sign up</h2>
        {showUsernameAlert ? 
              <h4>please enter an username</h4> :
              null
            } 
        <div className="username-div">
            <label>username: </label>       
            <input type="text" name="username" placeholder="" id="signup-username"></input>
        </div>
        <div className="password-div">
            <label>password</label>    
            <input type="text" name="password" placeholder="" id="signup-password"></input>
        </div>
        {showPasswordAlert ? 
              <h4>please enter a password</h4> :
              null
            }   
        <input type="submit" id="login-button" value="sign up" />
      </form>
      <button className='close-button' onClick={(e) => {closeModal(e)}}>close</button>
      {showSuccessMessage ?
          <h3>account successfully created!</h3> :
          null
      }
    </div>
  );
}

export default connect(null, mapDispatchToProps)(SignupModal);