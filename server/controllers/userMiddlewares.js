const path = require('path');
require('dotenv').config({path: path.resolve(__dirname+'../../../.env')});


const db = require('../dbModel.js');
const bcrypt = require('bcrypt');
const saltFactor = 10;
const jwt = require('jsonwebtoken')

const userMiddlewares = {};

userMiddlewares.signUp = (req, res, next) => {
  const { username, password } = req.body;
  bcrypt.hash(password, saltFactor, (err, hash) => {
    // save hashed password and username to database
    // const signupQuery = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    // db.query(signupQuery, [username, hash])
    //   .then(() => {
    //     console.log('User created');
    //     const querySave = `INSERT INTO UserTeams ("username", "savedTeams") VALUES ('${username}', '{}')`;
    //     db.query(querySave)
    //     .then(() => {
    //         res.locals.data = {status: 'success'};
    //         return next();
    //       })
    //   })
    //   .catch(error => {
    //     console.log('Username already exists');
    //     return next(error);
    //   });
    checkUserAlreadyExist(username)
      .then(async() => {
        await signUpUser(username, hash);
      })
      .then(async () => {
        await initializeUserTeams();
      })
      .then(() => {
        // console.log(res.locals.signupData)
        return next();
      })

    

    //if problem hashing password return an error
    if (err){
      return next(err);
    }
  });

  async function checkUserAlreadyExist(username) {
    const checkUserQuery = `SELECT * FROM Users WHERE username = '${username}'`
    await db.query(checkUserQuery) 
      .then((dbResponse) => {
        if (dbResponse.rows[0]) {
          res.locals.signupData = {status: "username already exists"};
          return next();
        }
      })
  }

  async function signUpUser(username, hash) {
    const signupQuery = 'INSERT INTO Users (username, password) VALUES ($1, $2)';
    await db.query(signupQuery, [username, hash])
      .then()
  }

  async function initializeUserTeams() {
    const querySave = `INSERT INTO UserTeams ("username", "savedTeams") VALUES ('${username}', '{}')`;
    await db.query(querySave)
      .then(() => {
        res.locals.signupData = {status: 'success'};
      }) 
  }
};

userMiddlewares.logIn = (req, res, next) => {
  const { username } = req.body;
  const query = `SELECT password FROM Users WHERE username = '${username}'`;
  // query database to see if that username exists
  db.query(query)
    .then(dbResponse => {
      if (username==='') {
        res.locals.loginData = {status: 'please enter an username'};
        return next();
      }
      if (dbResponse.rows[0] === undefined) {
        // if nothing is found, return 401 status
        res.locals.loginData = {status: 'username not found'};
        return next();
      } 
      else {
        // if record is found, compare password
        const { password } = dbResponse.rows[0];
        bcrypt.compare(req.body.password, password, (err, result) => { 
          // if bcrypt.compare returns an unknown error, return an error
          if (err) { 
            return next({
              log: `userController.verifyUser: ERROR: Error comparing password: ${err}`,
              message: { err: 'Error comparing password' },
            });
          }
          if (result) {
            //if passwords MATCH
            const query = `SELECT "savedTeams" FROM UserTeams WHERE username = '${username}'`;
            db.query(query)
              .then(dbResponse => {
                const token = jwt.sign({ username: username}, process.env.JWT_SECRET, {
                  expiresIn: process.env.JWT_EXPIRES_IN,  });
    
                res.locals.loginData = {
                  status: 'success',
                  token,
                  username: username,
                  savedTeams: dbResponse.rows[0],
                };
    
                res.cookie('PokemonTeamBuilder', token, { maxAge: 900000, });
                return next();
              })
          }
          else {
            // if passwords don't match, return 401 status
            res.locals.loginData = {status: 'incorrect password'};
            return next();
          }
        });
      }
    })
    .catch(err => {
      return next(err);
    });
};


userMiddlewares.getUserData = (req, res, next) => {
  console.log('inside middleware getUserData,', req.cookies);
  const username = req.params.username;
  const decodedUsername = jwt.verify(req.cookies.PokemonTeamBuilder, process.env.JWT_SECRET);

  console.log(username, decodedUsername)
  if (decodedUsername === username) {
    console.log('SAME JWT TOKEN!')
    // const query = `SELECT savedTeams FROM UserTeams WHERE username = ${username}`;
    // db.query(query)
    //   .then(dbResponse => {
    //     console.log('inside .then dbResponse, ', dbResponse.rows[0])
    //     return next()
    //   })
    res.locals.savedTeams = userData;
  }
  return next()
}


userMiddlewares.saveUserTeams = (req, res, next) => {
  const contentLength = req.get('Content-Length');
  console.log('inside middleware saveUserTeams, request: ', contentLength, ' bytes');
  const username = req.body.username;
  let teams = JSON.stringify(req.body.team); 
  // parse for special characters 
  console.log(teams.includes("'"))
  teams = teams.replace(/[\/\(\)\']/g, "&apos;")
  console.log(teams.includes("'"))


  const querySave = `INSERT INTO UserTeams ("username", "savedTeams") VALUES ('${username}', '${teams}')`;
  const queryUpdate = `UPDATE UserTeams SET "savedTeams" = '${teams}' WHERE "username" = '${username}'`;
  db.query(queryUpdate)
    .then((dbResponse) => {
      console.log(dbResponse.rows)
      return next();
    })
    .catch(error => {
      console.log(error);
      return next(error);
    })
}

module.exports = userMiddlewares;

