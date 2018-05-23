const {Topic, Article} = require('../models/');

exports.findAllTopics = () => Topic.find();

exports.findTopicById = (id) => Topic.findById(id);

exports.findArticlesByTopicId = (belongs_to) => Article.find({belongs_to}).select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username']);
