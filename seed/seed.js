const mongoose = require('mongoose');
const {Topic, User, Article, Comment} = require('../models');

exports.seed = (topicsData, usersData, articlesData, commentsData) =>  {
    return mongoose.connection.dropDatabase()

    .then(() => Promise.all([Topic.insertMany(topicsData), User.insertMany(usersData)]))
    .then(([topicsDocs, usersDocs]) => {
            const articles = articlesData.map(article => {
                const created_by = usersDocs.find(user => user.username === article.created_by)._id;
                const belongs_to = topicsDocs.find(topic => topic.slug === article.topic)._id;
                const votes = Math.floor(Math.random() * 30)
                return { ...article, created_by, belongs_to, votes}
            });
            return Promise.all([topicsDocs, usersDocs, Article.insertMany(articles)]);
       })
       .then(([topicsDocs, usersDocs, articlesDocs]) => {
            const comments = commentsData.map(comment => {
                const belongs_to = articlesDocs.find(article => article.title === comment.belongs_to)._id;
                const created_by = usersDocs.find(user => user.username === comment.created_by)._id;
                return { ...comment, created_by, belongs_to};
            });
            return Promise.all([topicsDocs, usersDocs, articlesDocs, Comment.insertMany(comments)])
       });
    };
