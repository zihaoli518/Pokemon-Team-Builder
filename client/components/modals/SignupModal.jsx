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

const passwordSymbol = '◓';


const SignupModal = props => {
  const [showUsernameAlert, setShowUsernameAlert] = useState({status: false, message: 'please enter an username'});
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [passwordSymbols, setPasswordSymbols] = useState([]);
  const [maskedPassword, setMaskedPassword] = useState('');


  const submitHandler = (e) => {
    e.preventDefault();
    setShowUsernameAlert({status: false, message: 'please enter an username'});
    setShowPasswordAlert(false);
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    console.log('inside submitHandler, ', username, password)
    if (username==='') {
      setShowUsernameAlert({status: true, message: 'please enter an username'});
      return;
    }
    if (password==='') {
      setShowPasswordAlert(true);
      return;
    }
    
    // setting url for fetch requests based on NODE_ENV 
    let backendURL = '/api/signup';
    if (process.env.NODE_ENV==='production') backendURL = 'https://pokemon-team-builder-api.vercel.app/' + backendURL;

    fetch(backendURL, {
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
        } else if (data.status === 'username already exists') {
          setShowUsernameAlert({status: true, message: data.status})
        }
      })
  }

  const closeModal = (e) => {
    console.log('in closeModal')
    console.log(props)
    props.toggle(false); 
    setShowUsernameAlert(false);
    setShowPasswordAlert(false);
    setShowSuccessMessage(false);
  }

  // displays empty string for password div and populate passwordSymbol state with matching number of balls 
  function handlePasswordInput(e) {
    const input = e.target.value;
    const length = input.length;
    const maskedValue = passwordSymbol.repeat(length); // Replace with '*' characters
    
    setMaskedPassword(maskedValue);
  }

  const showModalClassName = props.show ? "modal display-block" : "modal display-none";
  
  return (
    <div className={showModalClassName}>
      <form className='modal-form' id='signup-modal-form' onSubmit={(e) => {submitHandler(e)}}>
        <h2>sign up</h2>
        {showUsernameAlert.status ? 
              <h4>{showUsernameAlert.message}</h4> :
              null
            } 
        <div className="username-div">
            <label>username: </label>       
            <input type="text" name="username" placeholder="" id="signup-username"></input>
        </div>
        <div className="password-div">
            <label>password</label>    

            <input type="text" name="password" placeholder="" id="signup-password" value={maskedPassword} onInput={(e) => {handlePasswordInput(e)}}></input>
            <div className='password-symbols'>
              {passwordSymbols}
            </div>
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