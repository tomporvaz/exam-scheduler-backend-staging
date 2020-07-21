// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const bodyParser  = require('body-parser');
var cors        = require('cors');
const helmet = require('helmet');
const fileupload = require('express-fileupload');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');


var apiRoutes         = require('./routes/api.js');

//middlewares
app.use(cors({origin: '*'})); //copied from FCC project; update to use githubpages frontend only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());  //for security
app.use(fileupload());

//Auth
var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://porkpotato.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://exam-scheduler.glitch.me/',
  issuer: 'https://porkpotato.auth0.com/',
  algorithms: ['RS256']
});

app.use(jwtCheck);

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

//Routing for API 
apiRoutes(app);  

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
  .type('text')
  .send('Not Found');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});


module.exports = app; //for testing