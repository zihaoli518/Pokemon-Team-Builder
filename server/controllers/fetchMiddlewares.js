const fetch = require('node-fetch');
const parse = require('node-html-parser');
const cheerio = require('cheerio')

const fetchMiddlewares = {}; 

fetchMiddlewares.fetchPokeAPI = (req, res, next) => {
  console.log('inside fetchPokeAPI');

  const pokemonName = req.body.pokemon
  fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName.toLowerCase())
    .then(data => data.json())
    .then(data => {
      res.locals.data = data;
      return next();
    })
    .catch(error => {
      return next(error);
    })
}

fetchMiddlewares.fetchWeakness = (req, res, next) => {
  
}

// not up to date with gen 9 

// fetchMiddlewares.fetchSmogon = (req, res, next) => {
//   console.log('inside fetchSmogon');

//   const pokemonName = req.body.pokemon
//   fetch('https://www.porydex.com/stats/2022-09/gen-8-ou/1695/pokemon/' + pokemonName.toLowerCase())
//     .then(res => res.text())
//     // .then(text => console.log(text))
//     // .then(data => data.json())
//     .then(data => {
//       // empty object to store all needed parsed data
//       const resultObject = {};
//       // console.log(typeof(data), data)
//       const dom = cheerio.load(data)
//       console.log(dom)
//       const abilitiesTable = (dom.querySelector('#abilities'))
//       console.log(abilitiesTable.innerHTML, typeof(abilitiesTableß))
//       resultObject['moveSet'] = {};
//       for (let i=0; i<abilitiesTable.length; i++) {
//         resultObject.moveSet[abilitiesTable[i].childrenNodes[0].childNodes[0].innerHTML] = abilitiesTable[i].childrenNodes[1].innerHTML
//       }

//       res.locals.data = resultObject;
//       return next();
//     })
//     .catch(error => {
//       return next(error);
//     })
// }


module.exports= fetchMiddlewares;