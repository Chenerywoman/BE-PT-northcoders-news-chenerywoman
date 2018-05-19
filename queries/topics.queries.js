const {Topic, Article} = require('../models/');


exports.findAllTopics = () => Topic.find();

exports.findTopicById = (id) => Topic.findById(id);

exports.findArticlesByTopic = (belongs_to) => Article.find({belongs_to})