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
import TeamMember from './TeamMember.jsx';

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
    {console.log('color for team: ', this.color)}

    let selectedTeam;
    let selectedTeamName;
    let title;

    if (this.props.team === 'green') {
      selectedTeam = this.props.yourTeam;
      selectedTeamName = 'yourTeam';
      title = 'Your Team'
    } else {
      selectedTeam = this.props.enemyTeam
      selectedTeamName = 'enemyTeam';
      title = 'Enemy Team'
    }

    // console.log(selectedTeam)

    const teamToBeDisplayed = [];
    for (let i=1; i<=6; i++) {
      let selectedMon = 'mon' + i.toString();
      console.log('inside TeamDisplay for loop: ')
      console.log(selectedTeam, selectedMon);
      if (selectedTeam[selectedMon]) {
        teamToBeDisplayed.push(
            <TeamMember
              key={i}
              selectedTeamName={selectedTeamName}
              selectedTeam={selectedTeam}
              selectedMon={selectedMon}
              pokemonData={selectedTeam[selectedMon]}
              pokemonName={selectedTeam[selectedMon]['pokemon']}
            />)
      }
    }
    console.log('END of populateTeam() ', {title: title, teamToBeDisplayed: teamToBeDisplayed})
    return {title: title, teamToBeDisplayed: teamToBeDisplayed}
  }

  render() {
    if (this.props.team==="green") {
      return (
        <div className="green">
          <h4>{this.populateTeam('green')['title']}</h4>
          {this.populateTeam('green')['teamToBeDisplayed']}
        </div>
      );
    } else {
      return (
        <div className="red">
          <h4>{this.populateTeam('red')['title']}</h4>
          {this.populateTeam('red')['teamToBeDisplayed']}
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, null)(TeamDisplay)