const mongoose = require('mongoose');
const {articlesData, commentsData, topicsData, usersData } = require('./devData');
const {seed} = require('./seed');
// need this as not connecting via the app so need to set the node env to dev or production so the config file works
const url = require('../config/index');

// connect to the database using the url brought in from config above
mongoose.connect(url)
// call the seed function inside the then block with the data required in above
.then(() => seed(topicsData, usersData, articlesData, commentsData))
// once the seed function has run and the data has been added to the database, disconnect by calling the disconnect method of mongoose
.then(() => {
    mongoose.disconnect();
    console.log('dev database seeded');
})
.catch(err => console.log(err));
