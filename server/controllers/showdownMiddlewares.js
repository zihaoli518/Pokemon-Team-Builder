const fs = require('fs');
const fetch = require('node-fetch');
const parse = require('node-html-parser');

const { Dex } = require('pokemon-showdown');

const showdownMiddlewares = {}; 



showdownMiddlewares.getAllSpecies = (req, res, next) => {
  console.log('inside getAllSpecies middleware')

  const arrayOfSpecies= Dex.species.all();
  res.locals.data = arrayOfSpecies

  return next()
}


showdownMiddlewares.getAllItems = (req, res, next) => {
  console.log('inside getAllItems middleware')
  const arrayOfItems = Dex.items.all();

  const itemDataObject = {};

  async function loopThruItems() {
    for (let i=0; i<arrayOfItems.length; i++) {
      let itemName = arrayOfItems[i].name.toLowerCase();
      const parsedItemName = itemName.replace(' ', '-');
      console.log('validating response for: ', parsedItemName)

      let urlStr = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/' + parsedItemName + '.png'

      const validUrlBoolean = await checkForSprite(urlStr);
      console.log(validUrlBoolean)
      console.log('..........', i, '/', arrayOfItems.length, '..........')
      if (validUrlBoolean) {
        console.log('writing JSON data for: ', itemName);
        itemDataObject[parsedItemName] = arrayOfItems[i];
        itemDataObject[parsedItemName]['nameLowerCase'] = itemName;
        if (checkForSprite) itemDataObject[parsedItemName]['spriteUrl'] = urlStr
      }
    }
  } 

  async function checkForSprite(url) {
    let resultBoolean = false;
    await fetch(url)
      // .then(data => data.json())
      .then(data => {
        console.log('status: ', data.status)
        if (data.status===200) resultBoolean = true;
      })
    return resultBoolean
  }

  async function asyncHandler() {
    await loopThruItems();
  
    const itemDataJSON = JSON.stringify(itemDataObject);
   
    console.log(typeof(itemDataJSON))
    fs.writeFile("items-data.json", itemDataJSON, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
      console.log("JSON file has been saved.");
    });
  
    res.locals.data = itemDataObject;
    return next();
  }

  asyncHandler();
}

showdownMiddlewares.getAllMoves = (req, res, next) => {
  console.log('inside getAllMoves middleware')
  const arrayOfMoves = Dex.moves.all();

  const movesDataObject = {};
  // http://pokeapi.co/api/v2/move/close-combat

  for (let i=0; i<arrayOfMoves.length; i++) {
    let moveName = arrayOfMoves[i].name.toLowerCase();
    // const parsedItemName = moveName.replace(' ', '-');

    console.log('..........', i, '/', arrayOfMoves.length, '..........')

    console.log('writing JSON data for: ', moveName);
    movesDataObject[moveName] = arrayOfMoves[i];
    
  }
  
  const movesDataJSON = JSON.stringify(movesDataObject);

  fs.writeFile("moves-data.json", movesDataJSON, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
  });

  res.locals.data = arrayOfMoves
  return next()
}

module.exports= showdownMiddlewares;