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

import * as actions from '../../actions/actions';

const mapStateToProps = state => {
  return {
    
  }
}

const mapDispatchToProps = dispatch => ({
  showTypingChart : () => dispatch(actions.showTypingChart()),
});


const LoginModal = props => {

  const showModalClassName = props.show ? "modal display-block" : "modal display-none";

  return (
    <div className={showModalClassName}>
      <h2>LOGIN</h2>


    </div>
  );
}

export default connect(null, mapDispatchToProps)(LoginModal);