const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000; 

const fetchMiddlewares = require('./controllers/fetchMiddlewares.js');
const userMiddlewares = require('./controllers/userMiddlewares.js');
const showdownMiddlewares = require('./controllers/showdownMiddlewares.js')

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

// taking care of CORS
app.use((req, res, next) => {
  console.log('inside first app.use, ');

  res.header('Access-Control-Allow-Origin', '*');
  if (req.cookies.PokemonTeamBuilder)  {
    console.log('if req.cookies');
    // console.log(req.cookies)
    res.header('cookie', req.cookies);
  }
  next();
});

// // statically serve everything in the build folder on the route '/build'
// serve static content 
app.use('/static', 
express.static(path.join(__dirname, '../assets')));

// serve index.html on the route '/'
app.get('/', (req, res) => {
  console.log('get/ complete')
  return res.status(200).sendFile(path.join(__dirname, '../index.html'));
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
})


app.listen(PORT); 

