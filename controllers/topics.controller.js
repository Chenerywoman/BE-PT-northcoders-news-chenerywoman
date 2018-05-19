const {findAllTopics, findTopicById, findArticlesByTopic} = require('../queries/topics.queries');

exports.getAllTopics = (req, res, next) => {
  return findAllTopics()
  .then(topics => res.status(200).send({topics}))
  .catch(err => next({status: 500, message: 'unable to find topics'}))
};
  
exports.getArticlesByTopicId = (req, res, next) => {
    return findTopicById(req.params.topic_id)
    .then(topic => findArticlesByTopic(topic._id))
    .then(articles => res.status(200).send({articles}))
};

exports.postNewArticleToTopic = (req, res, next) => {
  return res.send('in postNewArticlebyTopic');
};
