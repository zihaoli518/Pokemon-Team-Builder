const fs = require('fs');
const fetch = require('node-fetch');
const parse = require('node-html-parser');

const { Dex } = require('pokemon-showdown');

const showdownMiddlewares = {}; 

showdownMiddlewares.getAllItems = (req, res, next) => {
  console.log('inside getAllItems middleware')
  const arrayOfItems = Dex.items.all();

  const itemDataObject = {};

  for (let i=0; i<arrayOfItems.length; i++) {
    let itemName = arrayOfItems[i].name.toLowerCase();
    const parsedItemName = itemName.replace(' ', '-');
    console.log(parsedItemName)

    let urlStr = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/' + parsedItemName + '.png'

    if (checkForSprite(urlStr)) {
      itemDataObject[parsedItemName] = arrayOfItems[i];
      itemDataObject[parsedItemName]['nameLowerCase'] = parsedItemName;
      if (checkForSprite) itemDataObject[parsedItemName]['spriteUrl'] = urlStr
    }
  }

  async function checkForSprite(url) {
    await fetch(url)
      .then(data => data.json())
      .then(data => {
        if (data.status===200) {
          return true;
        }
        return false;
      })
  }

  const itemDataJSON = JSON.stringify(itemDataObject);


  console.log(typeof(itemData))
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

module.exports= showdownMiddlewares;