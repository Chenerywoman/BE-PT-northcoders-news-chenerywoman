const {findAllTopics, findTopicById, findArticlesByTopicId} = require('../queries/topics.queries');
const {findUserById, findUserByUserName} = require('../queries/users.queries');
const {createArticle} = require('../queries/articles.queries');

exports.getAllTopics = (req, res, next) => {
  return findAllTopics()
  .then(topics => res.status(200).send({topics}))
  .catch(() => next({status: 500, controller: 'topics'}));
};
  
exports.getArticlesByTopicId = (req, res, next) => {
    return findTopicById(req.params.topic_id)
    .then(topic => findArticlesByTopicId(topic._id))
    .then(articles => {
      if (!articles.length) throw {status: 404, message: `there are no articles for the topic with id ${req.params.topic_id}`};
      else return res.status(200).send({articles});
    })
    .catch((err) => { 
      if (err.name === 'CastError') return next({status: 400, message: 'please input a valid topic id'});
      else if (err.status === 404) return next(err);
      else return next({status: 500, controller: 'topics'});
      });
}; 

exports.postNewArticleToTopic = (req, res, next) => {
  const userId = req.body.created_by ? req.body.created_by : findUserByUserName('tickle122')._id;
  return findTopicById(req.params.topic_id)
  .then(topic =>  Promise.all([topic, findUserById(userId)]))
    // change to a specific default user rather than using one - object posting wouldn't have the created_by
  .then(([topic, user]) => createArticle(req.body.title, req.body.body, topic._id, user._id))
  .then(article => res.status(201).send({new_article: article}))
  .catch((err) => { 
    if (err.name === 'CastError' && err.model.modelName === 'topics') return next({ status: 400,  message: `${req.params.topic_id} is not a valid topic id`});
    else if (err.name === 'CastError' && err.model.modelName === 'users') return next({ status: 400,  message: `${req.body.created_by} is not a valid user id`});
    else return next({status: 500, controller: 'topics'});
    });
  };
