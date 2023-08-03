
const helpers = {};

helpers.reOrderTeam = team => {
  // cache existing mon in a queue 
  let queue = [];

  for (let i=1; i<=6; i++) {
    let currentString = 'mon' + i;
    if (team[currentString]) queue.push(team[currentString]);
  };

  const newTeam = {
    size: team.size,
    key: team.key,
    name: team.name,
    mon1: null,
    mon2: null,
    mon3: null,
    mon4: null,
    mon5: null,
    mon6: null
  };

  for (let i=0; i<queue.length; i++) {
    let currentString = 'mon' + (i+1).toString();
    // console.log('inside reOrder() second for loop: ')
    // console.log(currentString)
    newTeam[currentString]= queue[i];
  }

  return newTeam
};


helpers.reOrderSavedTeams = (savedTeams) => {
  console.log('insdie helper ')
  let queue = [];
  console.log(Object.keys(savedTeams).length)
  for (let i=1; i<=Object.keys(savedTeams).length+1; i++) {
    let currentString = 'team_' + i;
    console.log(currentString)
    if (savedTeams.hasOwnProperty(currentString) && savedTeams[currentString]) queue.push(savedTeams[currentString]);
    else if (savedTeams.hasOwnProperty(currentString) && savedTeams[currentString]===null) queue.push(null);
  };
  console.log(queue)
  const newSavedTeams = {};

  for (let i=0; i<queue.length; i++) {
    let currentString = 'team_' + (i+1).toString();
    newSavedTeams[currentString]=queue[i];
    newSavedTeams[currentString]['key'] = currentString;
  }
  console.log(newSavedTeams)

  return newSavedTeams
}

helpers.statObjToArray = (statObj) => {
  let array = [];
  const order = ['hp', 'attack', 'defense', 'specialA', 'specialD', 'speed']
  order.forEach(stat => {
    array.push(statObj[stat])
  })
  console.log('END OF STAT->OBJ ', array);
  return array
}

helpers.capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

helpers.capitalizeWords = (str) => {
  return str.replace(/\b\w/g, function(match) {
    return match.toUpperCase();
  }).replace(/-/g, ' ');
}

// helpers.lowerCaseAll = ()

export default helpers