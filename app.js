// checks the node environment and sets it to dev if undefined
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' ;
const mongoose = require('mongoose');
const express = require('express');
let url  = process.env.NODE_ENV === 'production' ? process.env.MONGO_URL : require('./config/index');
const app = express();
const { json } = require('body-parser');
const apiRouter = require('./routers/api.router.js');

mongoose.connect(url);

app.use(json());

app.use(express.static('public'));

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  res.status !== 500 ? res.status(err.status).send({error: err.message}) : res.status(500).send({error: err.message});
});

module.exports = app;
