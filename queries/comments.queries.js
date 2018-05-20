const {Comment} = require('../models');

exports.findCommentsForArticle = (belongs_to) => Comment.find({belongs_to});