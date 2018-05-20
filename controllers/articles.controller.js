const {findAllArticles, findArticleById, findCommentsForArticle} = require('../queries/articles.queries');

exports.getAllArticles = (req, res, next) => {
  return findAllArticles()
  .then(articles => res.status(200).send({articles}))
  .catch(() => next({status: 500, message: 'server error: unable to find topics'}))
  };
  
exports.getArticlesById = (req, res, next) => {
  return findArticleById(req.params.article_id)
  .then(article =>  res.status(200).send({article}))
  .catch((err) => { 
    if (err.name === 'CastError') return next({status: 400, message: 'please input a valid article id'});
    else return next({status: 500, message: 'server error'});
    });
  };

exports.getCommentsforArticle = (req, res, next) => {
      return findCommentsForArticle(req.params.article_id)
      .then(comments => {
        if (comments.length === 0) throw {status: 404, message: `there are no comments for the article with id ${req.params.article_id}`};
        else res.status(200).send({comments});
      })
      .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
      })
  };

  exports.postNewCommentToArticle = (req, res, next) => {
    return res.send('postNewCommentToArticle');
};

  exports.changeArticleVotes = (req, res, next) => {
    return res.send('articleVotes');
};
