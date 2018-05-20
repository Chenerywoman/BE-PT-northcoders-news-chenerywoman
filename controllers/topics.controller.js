const {findAllTopics, findTopicById, findArticlesByTopicId} = require('../queries/topics.queries');

exports.getAllTopics = (req, res, next) => {
  return findAllTopics()
  .then(topics => res.status(200).send({topics}))
  .catch(() => next({status: 500, message: 'server error: unable to find topics'}))
};
  
exports.getArticlesByTopicId = (req, res, next) => {
    return findTopicById(req.params.topic_id)
    .then(topic => findArticlesByTopicId(topic._id))
    .then(articles => {
      if (articles.length === 0) throw {status: 404, message: 'unable to find articles for this topic' };
      else return res.status(200).send({articles});
    })
    .catch((err) => { 
      if (err.name === 'CastError') return next({status: 400, message: 'please input a valid topic id'});
      else if (err.status === 404) return next(err);
      else return next({status: 500, message: 'server error'})
      });
}; 

exports.postNewArticleToTopic = (req, res, next) => {
  return res.send('in postNewArticlebyTopic');
};
