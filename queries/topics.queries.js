const {Topic, Article} = require('../models/');

exports.findAllTopics = () => Topic.find().lean();

exports.findTopicById = (id) => Topic.findById(id).lean();

exports.findArticlesByTopicId = (belongs_to) => Article.find({belongs_to}).select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username']).lean();
