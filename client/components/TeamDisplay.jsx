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

const mapStateToProps = (state) => {
  return {
    currentPokemon: state.pokemon.currentPokemon,
    yourTeam: state.pokemon.yourTeam,
    enemyTeam: state.pokemon.enemyTeam,
  };
};


class TeamDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {color: this.props.team, selectedTeam: {}, selectedTeamName: '', title: '', teamToBeDisplayed:[]}
  }
  
  componentWillMount = () => {
    console.log('inside componentWillMount')
    console.log(this.props.yourTeam)
    this.populateTeam(this.color)
    console.log(this.props.yourTeam)
  }

  shouldComponentUpdate() {
    console.log('inside componentWillUpdate - TeamDisplay')
    console.log(this.props.yourTeam)
    this.populateTeam(this.color)
    console.log(this.props.yourTeam)
    return true
  }

  populateTeam(team) {
    {console.log('inside populateTeam')}
    // {console.log('color for team: ', this.color)}
    
    // let selectedTeam;
    // let selectedTeamName;
    // let title;
    
    if (this.props.team === 'green') {
      this.state.selectedTeam = this.props.yourTeam;
      this.state.selectedTeamName = 'yourTeam';
      this.state.title = 'Your Team'
    } else {
      this.state.selectedTeam = this.props.enemyTeam
      this.state.selectedTeamName = 'enemyTeam';
      this.state.title = 'Enemy Team'
    }
    
    console.log(this.state)
    console.log(this.props.yourTeam)
    // console.log(selectedTeam)

    const newTeamToBeDisplayed = [];
    for (let i=1; i<=6; i++) {
      let selectedMon = 'mon' + i.toString();
      // console.log('inside TeamDisplay for loop: ')
      // console.log(selectedTeam, selectedMon);
      if (this.state.selectedTeam[selectedMon]) {
        newTeamToBeDisplayed.push(
            <TeamMember
              key={i}
              selectedTeamName={this.state.selectedTeamName}
              selectedTeam={this.state.selectedTeam}
              selectedMon={selectedMon}
              pokemonData={this.state.selectedTeam[selectedMon]}
              pokemonName={this.state.selectedTeam[selectedMon]['pokemon']}
            />)
      };
      // updating state
      this.setState({...this.state, teamToBeDisplayed: [newTeamToBeDisplayed]});
    }
    // console.log('END of populateTeam() ', {title: title, teamToBeDisplayed: teamToBeDisplayed})
  }

  render() {
      return (
        <div className={this.props.team}>
          <h4>{this.state.title}</h4>
          <div className='team-members'>
            {this.state.teamToBeDisplayed}
          </div>
        </div>
      );
  }
}

export default connect(mapStateToProps, null)(TeamDisplay)