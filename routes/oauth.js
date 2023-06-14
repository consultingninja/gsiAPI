var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const {OAuth2Client} = require('google-auth-library');

async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  //console.log('response',response);
  const data = await response.json();
  console.log('data',data);
}

async function testOpen(id_token){
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
  //console.log('response',response);
  const data = await response.json();
  console.log('Opend ID data',data);
}

//This function will get the current Discovery Doc from Google, then extract out the URI for obtaining current public keys to use if needing to implement your own auth for some unknown reason.
async function getKeys(){
  //first get Discovery Doc for jwks_uri 
  const response = await fetch(`https://accounts.google.com/.well-known/openid-configuration`);
  //console.log('response',response);
  const data = await response.json();
  //console.log('Discovery Doc',data);

  //Use jwks_uri to get current keys
  const jwtCerts = await fetch(data.jwks_uri);
  const jwtData = await jwtCerts.json();
  //console.log('Certs',jwtData);

  return jwtData
  
}





/* GET home page. */
router.get('/', async function(req, res, next) {

    const code = req.query.code;

    console.log(code);
    try {
        const redirectURL = "http://127.0.0.1:3000/oauth"
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectURL
          );
        const r =  await oAuth2Client.getToken(code);
        // Make sure to set the credentials on the OAuth2 client.
        await oAuth2Client.setCredentials(r.tokens);
        console.info('Tokens acquired.');
        const user = oAuth2Client.credentials;
        console.log('credentials',user);

        //get info with access_token
        //await getUserData(user.access_token);

        //get info with id_token
        //await testOpen(user.id_token);
        //const keys = await getKeys();

        const ticket = await oAuth2Client.verifyIdToken({idToken:user.id_token,audience:process.env.CLIENT_ID,});

        console.log('ticket',ticket);


      } catch (err) {
        console.log('Error logging in with OAuth2 user', err);
    }


    res.redirect(303, 'http://localhost:5173/');
  

});

module.exports = router;