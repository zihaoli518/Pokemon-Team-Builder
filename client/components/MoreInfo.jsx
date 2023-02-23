/**
 * ************************************
 *
 * @module MoreInfo
 * @author zi 
 * @date
 * @description displays pokemon info from fetch request 
 *
 * ************************************
 */

// importing dependencies 
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// importing files 
import * as actions from '../actions/actions';
import PokemonSprite from './PokemonSprite.jsx';



const mapStateToProps = state => ({
  currentPokemon : state.pokemon.currentPokemon,
})


function MoreInfo(props) {
  console.log("inside MoreInfo")
  const [teammates, setTeammates] = useState({});
  const [counters, setCounters] = useState({});
  
  function getTeammates() {
    let teammateMap = {};
    for (let i = 0; i < 3; i++) {
      // break in case pokemon only has 1 ability
      // if (Object.keys(this.props.currentPokemon.teammates)[i] === undefined) {
      //   break;
      // }
      let currentTeammate = Object.keys(props.currentPokemon.teammates)[i];
      let currentPercentage =
        props.currentPokemon.teammates[currentTeammate];
      teammateMap[i] = [currentTeammate, currentPercentage];
    }
    console.log('inside getTeammates()')
    console.log(teammateMap)
    setTeammates(teammateMap);
    console.log(teammates)
  }

  function getCounters() {
    let counterMap = {};
    for (let i = 0; i < 3; i++) {
      // if (Object.keys(this.props.currentPokemon.teammates)[i] === undefined) {
      //   break;
      // }
      let currentCounter = Object.keys(props.currentPokemon.checks)[i];
      let currentPercentage =
        props.currentPokemon.checks[currentCounter].ko;
        counterMap[i] = [currentCounter, currentPercentage];
    }
    // console.log(abilityMap)
    setCounters(counterMap);
  }

  // initial 
  console.log('initial: ')
  console.log(props.currentPokemon)
  getTeammates();
  getCounters();
  console.log('after functions: ')
  console.log(teammates, counters)

  // running whenever currentPokemon updates 
  useEffect(() => {
    console.log('inside useEffect: ')
    getTeammates();
    getCounters();
  }, [props.currentPokemon]); 





    return (
      <div className='more-info-container'>
      <div className="more-info">
        <div className="common-teammates">
          <h4>Top Teammates</h4>
          <div className="common-teammates-inner">
            <div className="teammate1">
              <h5>{teammates[0][0]}</h5>
              <p>{teammates[0][1]}</p>
              <PokemonSprite pokemon={teammates[0][0]}/>
            </div>
            <div className="teammate2">
              <h5>{teammates[1][0]}</h5>
              <p>{teammates[1][1]}</p>
              <PokemonSprite pokemon={teammates[1][0]}/>
            </div>
            <div className="teammate3">
              <h5>{teammates[2][0]}</h5>
              <p>{teammates[2][1]}</p>
              <PokemonSprite pokemon={teammates[2][0]}/>
            </div>
          </div>
        </div>
        <div className="common-counters">
          <h4>Top Counters</h4>
          <div className="common-counters-inner">
            <div className="counter1">
              <h5>{counters[0][0]}</h5>
              <p>KO Rate: {counters[0][1]}</p>
              <PokemonSprite pokemon={counters[0][0]}/>
            </div>
            <div className="counter2">
              <h5>{counters[1][0]}</h5>
              <p>{counters[1][1]}</p>
              <PokemonSprite pokemon={counters[1][0]}/>
            </div>
            <div className="counter3">
              <h5>{counters[2][0]}</h5>
              <p>{counters[2][1]}</p>
              <PokemonSprite pokemon={counters[2][0]}/>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
}

export default connect(mapStateToProps, null)(MoreInfo)