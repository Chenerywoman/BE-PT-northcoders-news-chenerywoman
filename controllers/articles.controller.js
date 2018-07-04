const { findAllArticles, findArticleById, updateArticleVote } = require('../queries/articles.queries');
const { findCommentsForArticle, createComment, countCommentsForArticle } = require('../queries/comments.queries');
const { findUserById, findUserByUserName } = require('../queries/users.queries');

async function countComments(article) {
  const newArticle = Object.assign({}, article);
  newArticle.comments = await countCommentsForArticle(article._id);
  return newArticle;
}

exports.countComments = countComments

exports.getAllArticles = (req, res, next) => {
  return findAllArticles()
    .then(articles => Promise.all(articles.map(countComments)))
    .then(articles => res.status(200).send({ articles }))
    .catch(() => next({ status: 500, controller: 'articles' }));
};

exports.getArticleById = (req, res, next) => {
  return findArticleById(req.params.article_id)
    .then(article => countComments(article))
    .then(article => res.status(200).send({ article }))
    .catch((err) => {
      if (err.name === 'CastError') return next({ status: 400, message: 'please input a valid article id' });
      else return next({ status: 500, controller: 'articles' });
    });
};

exports.getCommentsforArticle = (req, res, next) => {
  return findCommentsForArticle(req.params.article_id)
    .then(comments => {
      if (comments.length === 0) throw { status: 404, message: `there are no comments for the article with id ${req.params.article_id}` };
      else res.status(200).send({ comments });
    })
    .catch(err => {
      if (err.status === 404) return next(err);
      else return next({ status: 500, controller: 'articles' });
    });
};

exports.postNewCommentToArticle = async (req, res, next) => {

  const userName = req.body.created_by ? req.body.created_by : 'tickle122';

  return Promise.all([findArticleById(req.params.article_id), findUserByUserName(userName)])
    .then(([article, user]) => {
      if (!user) throw { status: 400, message: `${req.body.created_by} is not a valid username` }
      return Promise.all([createComment(req.body.comment, article._id, user._id), user]);
    })
    .then(([comment, user]) => res.status(201).send({ new_comment: { ...comment.toObject(), created_by: user } }))
    .catch((err) => {
      if (err.name === 'CastError' && err.model.modelName === 'articles') return next({ status: 400, message: `${req.params.article_id} is not a valid article id` });
      else if (err.status === 400) return next(err);
      else return next({ status: 500, controller: 'articles' });
    });
};

exports.changeArticleVotes = (req, res, next) => {
  return findArticleById(req.params.article_id)
    .then(article => updateArticleVote(article._id, req.query.vote))
    .then(article => countComments(article))
    .then(article => res.status(200).send({ updated_article: article }))
    .catch((err) => {
      if (err.name === 'CastError' && err.model.modelName === 'articles') return next({ status: 400, message: `${req.params.article_id} is not a valid article id` });
      else return next({ status: 500, controller: 'articles' });
    });
};
