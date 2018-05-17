// const {findAllTopics, findArticlesByTopicId} = require('../queries/topics.queries');

exports.getAllTopics = (req, res, next) => {
  return res.send('in getAllTopics');
};

exports.getArticlesByTopicId = (req, res, next) => {
    return res.send('getArticlesByTopicId');
};

exports.postNewArticleToTopic = (req, res, next) => {
  return res.send('in postNewArticlebyTopic');
};
