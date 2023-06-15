var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file


//This function will get the current Discovery Doc from Google, then extract out the URI for obtaining current public keys to use if needing to implement your own auth for some unknown reason.
async function getKeys(){
  //first get Discovery Doc for jwks_uri 
  const response = await fetch(`https://accounts.google.com/.well-known/openid-configuration`);
  //console.log('response',response);
  const data = await response.json();
  console.log('Discovery Doc',data);

  //Use jwks_uri to get current keys
  const jwtCerts = await fetch(data.jwks_uri);
  const jwtData = await jwtCerts.json();
  //console.log('Certs',jwtData);

  return jwtData
  
}

/* GET home page. */
router.get('/', async function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    const keys = await getKeys();

    console.log("Keys ",keys)

    res.status(200);
    res.json(keys);
  

});

module.exports = router;