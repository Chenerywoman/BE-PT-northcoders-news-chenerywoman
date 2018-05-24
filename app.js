// this sets the node environment either to its current setting i.e. if set to test 
// or if the env is undefined (if not running from spec file) it is set to dev
// heroku will set it to 'production'
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' ;
const mongoose = require('mongoose');
const express = require('express');
let url  = '';
const app = express();
const { json } = require('body-parser');
const apiRouter = require('./routers/api.router.js');

// if deploying to Heroku, heroku treats as prodution so sets the url to the properyty MONGO_URL, which has been set to the madl url on heroku
if (process.env.NODE_ENV === 'production') {url = process.env.MONGO_URL;}
// this is if the env is not production & it is test or dev - had to change from requiring in at the top, as heroku was trying to read the config file which is not on heroku, so it crashes the app
else url = require('./config/index');
// this sets up the connection to the mongoose database - to a particular collection - see config/index.js for url
// removed useMongoClient inside connect line 14 & removing mongoose.Promise line 15 as not required with updated mongoose
mongoose.connect(url);

app.use(json());

app.use(express.static('public'));

app.use('/api', apiRouter);

// need to have 'next' as a param or error-handling doesn't work, even if linting doesn't like it!
app.use((err, req, res, next) => {
  if (res.status !== 500) {
    return res.status(err.status).send({error: err.message});
  }
});

// catch all error handler - any 500 errors
app.use(function (err, req, res, next) { 
  return res.status(500).send({error: err.message});
});

module.exports = app;
