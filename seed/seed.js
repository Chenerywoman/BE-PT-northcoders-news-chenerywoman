// 1. seed topics - done
// 2. seed users - done
// 3. seed articles -done 
    // each article belongs to a topic - ref. id topic id
    // created by a user
// 4.  seed random number of comments for each article 
        // created by a random user - ref. user id 
        // belong to specific article - ref. article id

const mongoose = require('mongoose');
const {Topic, User, Article, Comment} = require('../models');

// n.b. when the seed function is called, will already be connected to the database:
    // devSeed will connect to dev database & call the seed function with dev data
    // spec file will connect to the test database & call the seed function with test data

exports.seed = (topicsData, usersData, articlesData, commentsData) =>  {
    return mongoose.connection.dropDatabase()
    // insertMany creates a new topic/user for each item in those arrays & inserts them into their respective collections
    .then(() => Promise.all([Topic.insertMany(topicsData), User.insertMany(usersData)]))
    .then(([topicsDocs, usersDocs]) => {
        // map over articlesData 
        // 1. substitutes the value of created_by (which is the same as a username for a particular user), for the id of the user
        // 2. adds a belongs_to property & sets the value to the id of the topic where the topic slug is the same as article topic
            const articles = articlesData.map(article => {
                article.created_by = usersDocs.find(user => user.username === article.created_by)._id;
                article.belongs_to = topicsDocs.find(topic => topic.slug === article.topic)._id;
                article.votes = Math.floor(Math.random() * 30);
                return article;
            });
            return Promise.all([topicsDocs, usersDocs, Article.insertMany(articles)])
       })
       .then(([topicsDocs, usersDocs, articlesDocs]) => {
           // map over commentsData
            // 1. where belongs_to is the same as an article title, change belongs_to to the id of that article
            // 2. where created_by is the same as the username of a usser, change created_by to the id of that user
            const comments = commentsData.map(comment => {
                comment.belongs_to = articlesDocs.find(article => article.title === comment.belongs_to)._id;
                comment.created_by = usersDocs.find(user => user.username === comment.created_by)._id;
                return comment;
            });
            return Promise.all([topicsDocs, usersDocs, articlesDocs, Comment.insertMany(comments)])
       });
    };
