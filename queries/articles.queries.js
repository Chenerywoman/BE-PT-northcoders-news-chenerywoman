const {Article} = require('../models');

exports.findAllArticles = () => Article.find();

exports.findArticleById = (id) => Article.findById(id);

exports.createArticle = (title, body, belongs_to, created_by) => Article.create({title, body, belongs_to, created_by});

// article
// {   "_id": "583412925905f02e4c8e6e00", CREATED BY mongoDB
//     "title": "Living in the shadow of a  great man",
//     "topic": "mitch", //  NEED TO CHANGE TO A TOPIC IDn & CHANGE NAME TO BELONGS TO
//     "created_by": "butter_bridge", // NEED TO CHANGE TO A USER ID
//     "body": "I find this existence challenging"
//      "belongs_to NEED TO ADD A NEW FIELD & put topic id
//      "__v": 0 - added by mongoosedb
//   }
//     "votes": 77,  DEFAULT in SCHEMA IS 0
//     "comments": 13  ADD THIS
//   },
