'use strict'

const jwt = require("express-jwt");
const jwks = require('jwks-rsa');


//Auth0 code for authorization
module.exports = jwtCheck = jwt({
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
  