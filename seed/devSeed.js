const mongoose = require('mongoose');
const {articlesData, commentsData, topicsData, usersData } = require('./devData');
const {seed} = require('./seed');
// need this as not connecting via the app so need to set the node env to dev so the config file works
process.env.NODE_ENV = 'dev';  
const url = require('../config/index');
console.log('url', url);

// connect to the database using the url brought in from config above
mongoose.connect(url)
// call the seed function inside the then block with the data required in above
.then(() => seed(topicsData, usersData, articlesData, commentsData))
// once the seed function has run and the data has been added to the database, disconnect by calling the disconnect method of mongoose
.then(() => mongoose.disconnect())
.catch(err => console.log(err));

// Topics
// [ { _id: 5b0006db156ae7793447c70f,
//     title: 'Coding',
//     slug: 'coding',
//     __v: 0 } ]

// users
// [ { _id: 5b000736041f4b796be56656,
//     username: 'tickle122',
//     name: 'Tom Tickle',
//     avatar_url: 'http://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg',
//     __v: 0 },

// article
// {"title": "Living in the shadow of a  great man",
//     "topic": "mitch", //  NEED TO CHANGE TO A TOPIC IDn & CHANGE NAME TO BELONGS TO
//     "created_by": "butter_bridge", // NEED TO CHANGE TO A USER ID
//     "body": "I find this existence challenging"
// NEED TO ADD A NEW FIELD belongs_to & CHANGE NAME TO BELONGS TO
//   }

// comments
// {
//     "body": "The owls are not what they seem.",
//     "belongs_to": "They're not exactly dogs, are they?", ARTICLES TITLE CHANGE T) ARTICLE ID
//     "created_by": "dedekind561",  USERNAME  -CHANGE TO USER _ID
//     "votes": 20,
//     "created_at": 1458224590889
//   }
