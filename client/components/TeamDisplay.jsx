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
  // yourTeam : state.pokemon.yourTeam,
  // enemyTeam: state.pokemon.enemyTeam
})

class TeamDisplay extends Component {
  constructor(props) {
    super(props);
  }

  populateTeam(team) {
    {console.log('inside team display')}
    {console.log('color for team: ', this.props.team)}
    // {console.log(this.props.actualTeam)}
    let whichTeam;
    let title;
    if (this.props.team === 'green') {
      whichTeam = this.props.actualTeam;
      title = 'Your Team'
    } else {
      whichTeam = this.props.actualTeam
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
    return [title, teamToBeDisplayed]
  }

  render() {

      return (
        <div className={this.props.team}>
          <h4>{this.populateTeam()[0]}</h4>
          {this.populateTeam()[1]}
        </div>
      );

  }
}

export default connect(mapStateToProps, null)(TeamDisplay)