const {Comment} = require('../models');

exports.findCommentById = (_id) => Comment.findById(_id);

exports.findCommentsForArticle = (belongs_to) => Comment.find({belongs_to});

exports.createComment = (body, belongs_to, created_by) => Comment.create({body, belongs_to, created_by});

exports.updateCommentVote  = (_id, votes) => Comment.findByIdAndUpdate(_id, {votes});
