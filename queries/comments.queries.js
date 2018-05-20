const {Comment} = require('../models');

exports.findCommentsForArticle = (belongs_to) => Comment.find({belongs_to});

exports.createComment = (body, belongs_to, created_by) => Comment.create({body, belongs_to, created_by});
