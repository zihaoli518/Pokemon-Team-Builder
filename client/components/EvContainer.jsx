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



  return (
    <div className={showModalClassName}>

    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);