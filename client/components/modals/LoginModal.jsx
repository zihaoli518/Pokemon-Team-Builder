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
          let savedTeams = parseResponse(response.savedTeams);
          console.log('INSIDE LOGIN FETCH REQUEST RESPONSE: ', savedTeams)
          // console.log('before parse function: ', savedTeams.team_1.mon1.moves.move_1.categoryImageUrl)
          savedTeams = parseObjectForState(savedTeams);
          // console.log('after parse function: ', savedTeams.team_1.mon1.moves.move_1.categoryImageUrl)

          props.changeUserState(response.username, savedTeams);
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