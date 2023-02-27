function reOrder(team) {
  // cache existing mon in a queue 
  let queue = [];

  for (let i=1; i<=6; i++) {
    let currentString = 'mon' + i;
    if (team[currentString]) queue.push(team[currentString]);
  };

  const newTeam = {
    size: team.size,
    mon1: null,
    mon2: null,
    mon3: null,
    mon4: null,
    mon5: null,
    mon6: null
  };

  for (let i=0; i<queue.length; i++) {
    let currentString = 'mon' + (i+1).toString();
    console.log('inside reOrder() second for loop: ')
    console.log(currentString)
    newTeam[currentString]= queue[i];
  }

  return newTeam
};

export default reOrder