const fetch = import('node-fetch');
const parse = require('node-html-parser');

const hoshi = require('../../assets/hoshi.json');
const lina = require('../../assets/lina.json');


const fetchMiddlewares = {}; 

fetchMiddlewares.fetchPokeAPI = (req, res, next) => {
  console.log('in fetchMiddlewares.fetchPokeAPI, ', req.body,)
  // Function to process a single Pokémon
  const fetchSinglePokemon = (pokemonName) => {
    pokemonName = pokemonName.toLowerCase().replace(' ', '-');
    console.log('fetchSinglePokemon ', pokemonName)
    return new Promise((resolve, reject) => {
      import('node-fetch')
        .then(fetchModule => fetchModule.default)
        .then(fetch => {
          async function getEvolutionChainUrl(speciesUrl) {
            await fetch(speciesUrl)
              .then(data => data.json())
              .then(data => {
                res.locals.evolutionChainUrl = data.evolution_chain.url;
              });
          }

          async function getEvolutionTree(evolutionChainUrl) {
            await fetch(evolutionChainUrl)
              .then(data => data.json())
              .then(data => {
                res.locals.data.evolution_chain = data.chain;
                resolve(res.locals.data); // Resolve when done
              });
          }

          fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonName.toLowerCase())
            .then(data => data.json())
            .then(data => {
              console.log('poke api success! for: ', pokemonName)
              res.locals.data = data;
            })
            .then(async () => {
              await getEvolutionChainUrl(res.locals.data.species.url);
            })
            .then(async () => {
              await getEvolutionTree(res.locals.evolutionChainUrl);
            })
            .catch(error => {
              reject(error);
            });
        });
    });
  };

  // Function to process an array of Pokémon
  const fetchMultiplePokemons = async (pokemonNames) => {
    try {
      const results = await Promise.all(pokemonNames.map(name => fetchSinglePokemon(name)));
      console.log('after results in fetchMultiple, ', results)
      res.locals.pokemonData = results;
      next();
    } catch (error) {
      next(error);
    }
  };

  // Determine whether to handle a single Pokémon or an array
  console.log('checking req!!  ', res.locals.pokemonNameArray)
  if (Array.isArray(res.locals.pokemonNameArray)) {
    // res.locals.pokemonNameArray.forEach(pokemon => {
    //   fetchMultiplePokemons(pokemon);
    // })
    fetchMultiplePokemons(res.locals.pokemonNameArray)
  } else {
    console.log('inside else')
    // Default behavior for a single Pokémon
    fetchSinglePokemon(req.body.pokemon)
      .then(data => {
        res.locals.data = data;
        next();
      })
      .catch(error => {
        next(error);
      });
  }
};






fetchMiddlewares.fetchWeakness = (req, res, next) => {
  
}

fetchMiddlewares.testForNewerSprites = (req, res, next) => {
  // console.log('inside middleware testForNewerSprites')
  // console.log(req.body.url)

  // input: string, output: boolean, updated url if false 
  async function checkGif (url, pokemon, fetch) {
    // console.log('inside checkGif')
    fetch(url)
      .then((data) => {
        console.log('inside checkGif fetch, ', data.status)
        if (data.status === 200) {
          res.locals.url = url;
          return next();
        } else {
          res.locals.url = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${pokemon}.png`;
          return next();
        } 
      })
      .catch(error => {
        return next(error)
      })
  }

  let url = req.body.url;

  // dynamically importing node fetch
  import('node-fetch')
  .then(fetchModule => fetchModule.default)
  .then(fetch => {
    fetch(url)
      .then((data) => {
        // console.log("inside testForNewerSprites BACK");
        // console.log((data));
        // console.log(data.status)
        if (data.status===200) {
          res.locals.url = url; 
          console.log(res.locals.url)
          return next();
        }
        // if gif from another source is needed
          // reformating hisuian pokemon
        let pokemonName = req.body.pokemon;
        if (pokemonName.slice(pokemonName.length-5, pokemonName.length)==='hisui') pokemonName += 'an';
  
        checkGif(`https://img.pokemondb.net/sprites/legends-arceus/normal/${pokemonName}.png`, pokemonName, fetch)
        // console.log('newUrl: ', newUrl)
        // res.locals.url = newUrl; 
      })
      .catch(error => {
        return next(error)
      })
  })
}


fetchMiddlewares.getEvoluitonData = (req, res, next) => {
  const pokemon = req.body.pokemon;

  async function getSpeciesUrl() {
    await fetch('https://pokeapi.co/api/v2/pokemon/charmeleon')
  }


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