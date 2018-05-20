// this sets the node environment either to its current setting i.e. if set to test 
// or if the env is undefined (if not running from spec file) it is set to dev
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' ;
const url = require('./config/index');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const { json } = require('body-parser');
const apiRouter = require('./routers/api.router.js');

// this sets up the connection to the mongoose database - to a particular collection - see config/index.js for url
// removed useMongoClient inside connect line 14 & removing mongoose.Promise line 15 as not required with updated mongoose
mongoose.connect(url);

app.use(json());

app.use('/api', apiRouter);

app.use((err, req, res) => {
  if (res.status !== 500) {
    return res.status(err.status).send({
      error: err.error
    });
  }
});

// catch all error handler - any 500 errors
app.use(function (err, req, res) {
  return res.status(500).send({error: err.error});
});

module.exports = app;
