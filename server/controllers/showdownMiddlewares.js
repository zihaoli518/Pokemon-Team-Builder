const fs = require('fs');
const fetch = require('node-fetch');
const parse = require('node-html-parser');
const path = require('path');
const axios = require('axios');

const { Dex } = require('pokemon-showdown');

const showdownMiddlewares = {}; 



showdownMiddlewares.getAllSpecies = (req, res, next) => {
  console.log('inside getAllSpecies middleware')

  const arrayOfSpecies= Dex.species.all();
  res.locals.data = arrayOfSpecies

  return next();
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
    let moveName = arrayOfMoves[i].name.toLowerCase().replace('-', ' ');
    // const parsedItemName = moveName.replace('-', '-');

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

showdownMiddlewares.getAllMons = (req, res, next) => {
  console.log('inside getAllMons middleware');

  const arrayOfMons = Dex.species.all();

  const monsDataObject = new Map();

  for (let i=0; i<arrayOfMons.length; i++) {
    const monObj = arrayOfMons[i];
    let monName = monObj.name;

    console.log('..........', i, '/', arrayOfMons.length, '..........')

    console.log('writing JSON data for: ', monName);
    monsDataObject.set(monName, {
      name: monName,
      baseStats: monObj.baseStats,
      types: monObj.types,
      tier: monObj.tier,
      pokedexId: monObj.num,
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${monObj.num}.png`
    });
    
  }
  
  const monsDataJSON = JSON.stringify(Array.from(monsDataObject));

  fs.writeFile("mons-data.json", monsDataJSON, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
    console.log("JSON file has been saved.");
  });
  
  res.locals.data = monsDataJSON;
  return next()
}

showdownMiddlewares.getTypesImages = (req, res, next) => {
  const typesArray = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];
 
  // Function to download image for each type
  async function downloadImages(types) {
    for (const type of types) {
      const imageUrl = `https://play.pokemonshowdown.com/sprites/types/${capitalizeFirstLetter(type)}.png`;
      const imagePath = path.join(__dirname, `../../assets/types-images/${type}.png`);

      try {
        const response = await axios.get(imageUrl, { responseType: 'stream' });
        const writer = fs.createWriteStream(imagePath);

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        console.log(`Image downloaded for type ${type}`);
      } catch (error) {
        console.error(`Error downloading image for type ${type}:`, error);
      }
    }
  }

  downloadImages(typesArray);
  return next();
}

// helper functions 
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}



module.exports= showdownMiddlewares;

