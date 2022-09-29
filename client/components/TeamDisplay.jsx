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
  }


  render() {
      {console.log('inside team display')}
      {console.log('color for team: ', this.props.team)}
      // {console.log(this.props.currentPokemon.pokemon)}
      let whichTeam;
      if (this.props.team === 'green') {
        whichTeam = this.props.yourTeam
      } else {
        whichTeam = this.props.enemyTeam
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

      return (
        <div className={this.props.team}>
          {teamToBeDisplayed}
        </div>
      );

  }
}

export default connect(mapStateToProps, null)(TeamDisplay)