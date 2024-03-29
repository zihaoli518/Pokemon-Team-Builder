const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const PORT = 3000; 

const fetchMiddlewares = require('./controllers/fetchMiddlewares.js');
const userMiddlewares = require('./controllers/userMiddlewares.js');
const showdownMiddlewares = require('./controllers/showdownMiddlewares.js');
const convertTeamFormatMiddlewares = require('./controllers/convertTeamFormatMiddlewares.js')

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json({limit: '50mb'}));

// taking care of CORS
app.use(cors());

app.use((req, res, next) => {
  console.log('inside first app.use, ');

  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )


  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Content-Type', 'application/json');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.header(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // check for user permission with cookies 
  if (req.cookies.PokemonTeamBuilder)  {
    res.header('cookie', req.cookies);
  }
  next();
});

// // increasing request limit so teams can be saved 
// app.use(express.bodyParser({limit: '50mb'}));


// // statically serve everything in the build folder on the route '/build'
// serve static content from the asset folder
app.use('/static', 
express.static(path.join(__dirname, '../assets')));
// serving bundle file output from webpack build in production mode 
app.use('/public', 
express.static(path.join(__dirname, '../public')));

app.use(express.static('public', { 
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));


// serve index.html on the route '/'
app.get('/', (req, res) => {
  console.log('get/ complete')
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});


// routing fetch requests regarding pokemon data 
app.post('/api/fetchPokeAPI', fetchMiddlewares.fetchPokeAPI, (req, res) => {
  console.log('/fetch-pokeAPI complete')
  return res.status(200).send(res.locals.data)
})

app.post('/api/testForNewerSprites', fetchMiddlewares.testForNewerSprites, (req, res) => {
  console.log('/testForNewerSprites complete')
  return res.status(200).send({url: res.locals.url})
})

app.post('/api/fetchEvolutionTree', fetchMiddlewares.getEvoluitonData, (req, res) => {
  console.log('/fetchEvolutionTree complete')
  return res.status(200).send({evolutionTree: res.locals.evolutionTree})
})





// app.post('/api/fetch-smogon', fetchMiddlewares.fetchSmogon, (req, res) => {
//   console.log('/fetch-smogon complete')
//   return res.status(200).send(res.locals.data)
// })

app.post('/api/signup', userMiddlewares.signUp, (req, res) => {
  console.log('/api/signup complete')
  return res.status(200).send(res.locals.signupData)
})

app.post('/api/login', userMiddlewares.logIn, (req, res) => {
  console.log('/api/login complete');
  console.log(res.locals.loginData)
  return res.status(200).send(res.locals.loginData)
})

// if logged in get user data
app.get('/api/users/:username', userMiddlewares.getUserData, (req, res) => {
  console.log('api/users/ complete')
  return res.status(200).json({
    success:true,
    // redirectUrl: `/api/users/${req.params.username}`
    savedTeams: res.locals.savedTeams,
  })
})

// save user's updated teams to database 
app.post('/api/saveUserTeams', userMiddlewares.saveUserTeams, (req, res) => {
  console.log('/api/saveUserTeams complete')
  return res.status(200).send({url: res.locals.url})
})

// get all items 
app.get('/api/getAllItems', showdownMiddlewares.getAllItems, (req, res) => {
  console.log('/api/getAllItems complete')
  return res.status(200).send(res.locals.data)
})

app.get('/api/getAllSmogonData', showdownMiddlewares.getAllMoves, (req, res) => {
  console.log('/api/getAllMoves complete')
  return res.status(200).send(res.locals.data)
});

app.get('/api/getAllMonData', showdownMiddlewares.getAllMons, (req, res) => {
  console.log('/api/getAllMonData complete')
  return res.status(200).send(res.locals.data)
})

app.get('/api/getTypesImages', showdownMiddlewares.getTypesImages, (req, res) => {
  console.log('/api/getTypesImages complete')
  return res.status(200).send(res.locals.data)
})


// handle import and export format conversion requests 
app.post('/api/importMon', convertTeamFormatMiddlewares.importMon, fetchMiddlewares.fetchPokeAPI, (req, res) => {
  console.log('/api/importMon complete')
  return res.status(200).send({pokemonData: res.locals.data, importedSet: res.locals.importedMon})
})

app.post('/api/exportMon', convertTeamFormatMiddlewares.exportMon, (req, res) => {
  console.log('/api/exportMon complete')
  return res.status(200).send({exportedSet: res.locals.exportedSet})
})


// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 444,
    message: {err: 'an error occurred'}
  };
  const errorObj = Object.assign({}, defaultErr);
  errorObj.message.err = err;
  console.log('ERROR: ', err);

  return res.status(errorObj.status).send(errorObj.message);
});


// Handle OPTIONS requests
app.options('*', cors());


app.listen(PORT); 

module.exports = app;