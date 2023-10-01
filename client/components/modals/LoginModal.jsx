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

import loadingGIF from '../../../assets/loading.gif';

import * as actions from '../../actions/actions';
import '../../styles/LoginModal.scss';

const passwordSymbol = '◓';

const mapStateToProps = state => {
  return {
    isLoggedIn: state.userFunctions.isLoggedIn,
    username: state.userFunctions.username,
    loginLoading: state.userFunctions.loginLoading,
  }
}

const mapDispatchToProps = dispatch => ({
  toggleLoginLoading : () => dispatch(actions.toggleLoginLoading()),
  updateYourTeamKey : (num) => dispatch(actions.updateYourTeamKey(num))
});


const LoginModal = props => {

  const [showUsernameAlert, setShowUsernameAlert] = useState({status: false, message: null});
  const [showPasswordAlert, setShowPasswordAlert] = useState({status: false, message: null});
  const [maskedPassword, setMaskedPassword] = useState('');
  const [password, setPassword] = useState('');


  const showModalClassName = props.show ? "modal display-block" : "modal display-none";

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('inside submitHandler from logging in...')
    
    const username = document.getElementById('login-username').value;

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

    // setting url for fetch requests based on NODE_ENV 
    let backendURL = '/api/login';
    if (process.env.NODE_ENV==='production') backendURL = 'https://pokemon-team-builder-api.vercel.app' + backendURL;

    fetch(backendURL, {
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
          let savedTeams = parseResponse(response.savedTeams);
          console.log('INSIDE LOGIN FETCH REQUEST RESPONSE: ', savedTeams)
          // console.log('before parse function: ', savedTeams.team_1.mon1.moves.move_1.categoryImageUrl)
          savedTeams = parseObjectForState(savedTeams);
          // console.log('after parse function: ', savedTeams.team_1.mon1.moves.move_1.categoryImageUrl)

          props.changeUserState(response.username, savedTeams);
          props.updateYourTeamKey('team_' + (Object.keys(savedTeams).length + 1))
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

  const parseResponse = (savedTeams) => {
    console.log('in parseResponse, ', savedTeams)
    savedTeams = savedTeams.savedTeams;
    savedTeams = JSON.stringify(savedTeams).replace("&apos;", "'");
    savedTeams = JSON.parse(savedTeams);
    for (let i=1; i<=Object.keys(savedTeams).length; i++) {
      const teamKey = 'team_' + i; 
      for (let j=1; j<=6; j++) {
        const monKey = 'mon' + j;
        // console.log(teamKey, monKey)
        // console.log(savedTeams[teamKey][monKey])
        if (!savedTeams[teamKey][monKey]) break;
        savedTeams[teamKey][monKey].activeAbility.description = savedTeams[teamKey][monKey].activeAbility.description.replace("&apos;", "'")
      }
    }
    return savedTeams;
  }

  const parseObjectForState = (savedTeamsObject) => {

    for (let i=1; i<=Object.keys(savedTeamsObject).length; i++) {
      const teamKey = 'team_' + i; 
      for (let j=1; j<=6; j++) {
        const monKey = 'mon' + j;
        if (!savedTeamsObject[teamKey][monKey]) break;
        // console.log('in savedTeamsToDataBase... ', savedTeams[teamKey][monKey])
        savedTeamsObject[teamKey][monKey].activeAbility.description = savedTeamsObject[teamKey][monKey].activeAbility.description.replace(/[\/\(\)\']/g, "&apos;")
        if (savedTeamsObject[teamKey][monKey].item.item) {
          // savedTeams[teamKey][monKey].item.description = savedTeams[teamKey][monKey].item.description.replace(/[\/\(\)\']/g, "&apos;");
          savedTeamsObject[teamKey][monKey].item.url = decodeURIComponent(savedTeamsObject[teamKey][monKey].item.url);
        }
        if (savedTeamsObject[teamKey][monKey].activeMove.moveObj.name) {
          savedTeamsObject[teamKey][monKey].activeMove.moveObj.typeImageUrl = decodeURIComponent(savedTeamsObject[teamKey][monKey].activeMove.moveObj.typeImageUrl);
          savedTeamsObject[teamKey][monKey].activeMove.moveObj.categoryUrl = decodeURIComponent(savedTeamsObject[teamKey][monKey].activeMove.moveObj.categoryUrl);
        }
        if (savedTeamsObject[teamKey][monKey].moves.move_1.name || savedTeamsObject[teamKey][monKey].moves.move_2.name || savedTeamsObject[teamKey][monKey].moves.move_3.name || savedTeamsObject[teamKey][monKey].moves.move_4.name) {
          for (let i=1; i<=4; i++) {
            if (!savedTeamsObject[teamKey][monKey]['moves']['move_'+i].name) continue;
            savedTeamsObject[teamKey][monKey]['moves']['move_'+i].typeImageUrl = decodeURIComponent(savedTeamsObject[teamKey][monKey]['moves']['move_'+i].typeImageUrl);
            savedTeamsObject[teamKey][monKey]['moves']['move_'+i].categoryImageUrl = decodeURIComponent(savedTeamsObject[teamKey][monKey]['moves']['move_'+i].categoryImageUrl);
            // console.log('inside inner for loop... ', savedTeamsObject[teamKey][monKey]['moves']['move_'+i].typeImageUrl, savedTeamsObject[teamKey][monKey]['moves']['move_'+i].categoryImageUrl)
          }
        } 
      }
    }
    return savedTeamsObject;
  }

  // displays empty string for password div and populate passwordSymbol state with matching number of balls 
  function handlePasswordInput(e) {
    const input = e.target.value;
    const length = input.length;
    const maskedValue = passwordSymbol.repeat(length); // Replace with '*' characters

    setMaskedPassword(maskedValue);
    let newStr = password + input[input.length-1];
    setPassword(newStr);
  }

  const closeModal = (e) => {
    props.toggle(false); 
    // setShowUsernameAlert(false);
    // setShowPasswordAlert(false);
  }

  const getUserData = (username) => {
    console.log('inside get userData(), ', username)
    // setting url for fetch requests based on NODE_ENV 
    let backendURL = '/api/users/';
    if (process.env.NODE_ENV==='production') backendURL = 'https://pokemon-team-builder-api.vercel.app' + backendURL;
    fetch(backendURL + username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'PokemonTeamBuilder',
        credentials: 'same-origin',
      },
    })
      .then(data => {

        // console.log(data);
        props.changeUserState(username, data);
        props.toggleShowLoginModal();
        // chage redux state

      })
  }


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
            <label>password: </label>      
            <input type="text" name="password" placeholder="" id="login-password"  onInput={(e) => {handlePasswordInput(e)}}></input>
            <p className="masked-password">{maskedPassword}</p>
        </div>
        {showPasswordAlert.status ? 
              <h4>{showPasswordAlert.message}</h4> :
              null
            }   
        <input type="submit" id="login-button" value="log in" />
      </form>

        <button className='close-button btn-close' onClick={(e) => {closeModal(e)}}></button>
        {/* <button className='test-button' onClick={(e) => {getUserData('123')}}>test</button> */}
        {(props.loginLoading) ?
          <img id='login-loading-gif' src={loadingGIF} alt="" /> :
          null
        }
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);