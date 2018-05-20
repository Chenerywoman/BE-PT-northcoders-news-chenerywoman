const {findAllTopics, findTopicById, findArticlesByTopicId} = require('../queries/topics.queries');
const {findUserById} = require('../queries/users.queries');
const {createArticle} = require('../queries/articles.queries');

exports.getAllTopics = (req, res, next) => {
  return findAllTopics()
  .then(topics => res.status(200).send({topics}))
  .catch(() => next({status: 500, message: 'server error: unable to find topics'}))
};
  
exports.getArticlesByTopicId = (req, res, next) => {
    return findTopicById(req.params.topic_id)
    .then(topic => findArticlesByTopicId(topic._id))
    .then(articles => {
      if (articles.length === 0) throw {status: 404, message: `there are no articles for the topic with id ${req.params.topic_id}`};
      else return res.status(200).send({articles});
    })
    .catch((err) => { 
      if (err.name === 'CastError') return next({status: 400, message: 'please input a valid topic id'});
      else if (err.status === 404) return next(err);
      else return next({status: 500, message: 'server error'})
      });
}; 

exports.postNewArticleToTopic = (req, res, next) => {
  Promise.all([findTopicById(req.params.topic_id), findUserById(req.body.created_by)])
  .then(([topic, user]) => {
    return createArticle(req.body.title, req.body.body, topic._id, user._id)
  })
  .then(article => res.status(201).send({new_article: article}))
  .catch((err) => { 
    console.log('err', err)
    if (err.name === 'CastError') return next({status: 400, message: 'please input a valid topic id'});
    else return next({status: 500, message: 'server error'})
    });
  };
