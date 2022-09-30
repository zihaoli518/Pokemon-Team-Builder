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
import React, { Component } from 'react';
import { connect } from 'react-redux';

// importing files 
import * as actions from '../actions/actions';
import PokemonSprite from './PokemonSprite.jsx';


const mapStateToProps = state => ({
  currentPokemon : state.pokemon.currentPokemon,
})


class MoreInfo extends Component {
  constructor(props) {
    super(props);
  }

  getTeammates() {
    let teammateMap = {};
    for (let i = 0; i < 3; i++) {
      // break in case pokemon only has 1 ability
      // if (Object.keys(this.props.currentPokemon.teammates)[i] === undefined) {
      //   break;
      // }
      let currentTeammate = Object.keys(this.props.currentPokemon.teammates)[i];
      let currentPercentage =
        this.props.currentPokemon.teammates[currentTeammate];
      teammateMap[i] = [currentTeammate, currentPercentage];
    }
    // console.log(abilityMap)
    return teammateMap;
  }

  getCounters() {
    let counterMap = {};
    for (let i = 0; i < 3; i++) {
      // break in case pokemon only has 1 ability
      // if (Object.keys(this.props.currentPokemon.teammates)[i] === undefined) {
      //   break;
      // }
      let currentCounter = Object.keys(this.props.currentPokemon.checks)[i];
      let currentPercentage =
        this.props.currentPokemon.checks[currentCounter].ko;
        counterMap[i] = [currentCounter, currentPercentage];
    }
    // console.log(abilityMap)
    return counterMap;
  }

  render() {
    console.log("inside Moreinfo");
    console.log(this.props.currentPokemon.checks);
    return (
      <div className='more-info-container'>
      <div className="more-info">
        <div className="common-teammates">
          <h4>Top Teammates</h4>
          <div className="common-teammates-inner">
            <div className="teammate1">
              <h5>{this.getTeammates()[0][0]}</h5>
              <p>{this.getTeammates()[0][1]}</p>
              <PokemonSprite pokemon={this.getTeammates()[0][0]}/>
            </div>
            <div className="teammate2">
              <h5>{this.getTeammates()[1][0]}</h5>
              <p>{this.getTeammates()[1][1]}</p>
              <PokemonSprite pokemon={this.getTeammates()[1][0]}/>
            </div>
            <div className="teammate3">
              <h5>{this.getTeammates()[2][0]}</h5>
              <p>{this.getTeammates()[2][1]}</p>
              <PokemonSprite pokemon={this.getTeammates()[2][0]}/>
            </div>
          </div>
        </div>
        <div className="common-counters">
          <h4>Top Counters</h4>
          <div className="common-counters-inner">
            <div className="counter1">
              <h5>{this.getCounters()[0][0]}</h5>
              <p>KO Rate: {this.getCounters()[0][1]}</p>
              <PokemonSprite pokemon={this.getCounters()[0][0]}/>
            </div>
            <div className="counter2">
              <h5>{this.getCounters()[1][0]}</h5>
              <p>{this.getCounters()[1][1]}</p>
              <PokemonSprite pokemon={this.getCounters()[1][0]}/>
            </div>
            <div className="counter3">
              <h5>{this.getCounters()[2][0]}</h5>
              <p>{this.getCounters()[2][1]}</p>
              <PokemonSprite pokemon={this.getCounters()[2][0]}/>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(MoreInfo)