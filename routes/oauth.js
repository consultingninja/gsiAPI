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



/* GET home page. */
router.get('/', async function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    const code = req.query.code;

    console.log('code',code);
    try {
        const redirectURL = "http://127.0.0.1:3000/oauth"
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectURL
          );

        //const r =  await oAuth2Client.getToken(code);
        // Make sure to set the credentials on the OAuth2 client.
        //await oAuth2Client.setCredentials(r.tokens);
        //console.info('Tokens acquired.');
        //const user = oAuth2Client.credentials;
        //console.log('credentials',user);

        //get info with access_token
        //await getUserData(user.access_token);

        //get info with id_token
        //await testOpen(user.id_token);

        const ticket = await oAuth2Client.verifyIdToken({idToken:code,audience:process.env.CLIENT_ID,});

        console.log('ticket',ticket);

        res.status(200);
        res.json(JSON.stringify(ticket))


      } catch (err) {
        console.log('Error logging in with OAuth2 user', err);
    }



  

});

module.exports = router;