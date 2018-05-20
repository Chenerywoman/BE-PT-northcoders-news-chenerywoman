const {Article} = require('../models');

exports.findAllArticles = () => Article.find();

exports.findArticleById = (id) => Article.findById(id);

exports.createArticle = (title, body, belongs_to, created_by) => Article.create({title, body, belongs_to, created_by});

exports.updateArticleVote  = (_id, votes) => Article.findByIdAndUpdate(_id, {votes});
