/**
 * ************************************
 *
 * @module TeamDisplay
 * @author zi 
 * @date
 * @description displays a team
 *
 * ************************************
 */

// importing dependencies 
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PokemonSprite from './PokemonSprite.jsx';

const mapStateToProps = state => ({
  currentPokemon : state.pokemon.currentPokemon,
  // grab teams from state
  yourTeam : state.pokemon.yourTeam,
  enemyTeam: state.pokemon.enemyTeam
})


class TeamDisplay extends Component {
  constructor(props) {
    super(props);

    this.color = props.team;
  }

  populateTeam(team) {
    {console.log('inside populateTeam')}
    {console.log('color for team: ', this.props.team)}
    // {console.log(this.props.actualTeam)}
    let whichTeam;
    let title;
    if (this.props.team === 'green') {
      whichTeam = this.props.yourTeam;
      title = 'Your Team'
    } else {
      whichTeam = this.props.enemyTeam
      title = 'Enemy Team'
    }

    console.log(whichTeam)

    const teamToBeDisplayed = [];
    for (let i=0; i<whichTeam.length; i++) {
      teamToBeDisplayed.push(
          <PokemonSprite
            key={i}
            pokemon={Object.keys(whichTeam[i])[0]}
            className="pokemon-class-small"
          />)
    }
    return {title: title, teamToBeDisplayed: teamToBeDisplayed}
  }

  render() {
    if (this.team==="green") {
      return (
        <div className="green">
          <h4>{this.populateTeam()['title']}</h4>
          {this.populateTeam()['teamToBeDisplayed']}
        </div>
      );
    } else {
      return (
        <div className="red">
          <h4>{this.populateTeam()['title']}</h4>
          {this.populateTeam()['teamToBeDisplayed']}
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, null)(TeamDisplay)