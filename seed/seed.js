const mongoose = require('mongoose');
const {Topic, User, Article, Comment} = require('../models');

// n.b. when the seed function is called, will already be connected to the database:
    // devSeed will connect to dev database & call the seed function with dev data
    // spec file will connect to the test database & call the seed function with test data
    // run seedProd will connect to the mlab database & calls the seed function with the dev data

exports.seed = (topicsData, usersData, articlesData, commentsData) =>  {
    return mongoose.connection.dropDatabase()
    // insertMany creates a new topic/user for each item in those arrays & inserts them into their respective collections
    .then(() => Promise.all([Topic.insertMany(topicsData), User.insertMany(usersData)]))
    .then(([topicsDocs, usersDocs]) => {
        // map over articlesData 
            const articles = articlesData.map(article => {
                // sets up a new variable called created_by. The value is the id of a user whose username is the same as the created_by property of the article (in each iteration of map), using js find() method.  
                const created_by = usersDocs.find(user => user.username === article.created_by)._id;
                // creates a variable called belongs_to & sets the value to the id of the topic where the topic slug is the same as article topic, using js find() method
                const belongs_to = topicsDocs.find(topic => topic.slug === article.topic)._id;
                //creates a variable called votes & assigned it as a random number for each iteration of article
                const votes = Math.floor(Math.random() * 30)
                // creates a new object which contains all the key-value pairs of the original article (using spread operator) and the three new variables, created-by, belongs-to &amp; votes
                return { ...article, created_by, belongs_to, votes}
            });

            // returns the topicDocs, userDocs and the promise from inserting all the articles into the database
            return Promise.all([topicsDocs, usersDocs, Article.insertMany(articles)]);
       })
       .then(([topicsDocs, usersDocs, articlesDocs]) => {
           // map over commentsData
            const comments = commentsData.map(comment => {
                // creates a new variable belongs_to with the value as the id the article title where the article.title has the same&nbsp;value as the comment.belongs_to property
                const belongs_to = articlesDocs.find(article => article.title === comment.belongs_to)._id;
                // creates a new variable created_by, where the value is set to the id of the user where the user’s username property is has&nbsp;the same value as the comment’s created_by property
                const created_by = usersDocs.find(user => user.username === comment.created_by)._id;
                // returns a new object&nbsp;which has all the&nbsp;key-value pairs of that iteration’s comment variable, plus the new created_by &amp; belongs_to comments
                return { ...comment, created_by, belongs_to};
            });
            // returns the topicDocs, userDocs, articleDocs and the promise from inserting all the comments into the database
            return Promise.all([topicsDocs, usersDocs, articlesDocs, Comment.insertMany(comments)])
       });
    };
