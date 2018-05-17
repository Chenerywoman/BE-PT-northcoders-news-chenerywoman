// const {findAllArticles, findArticlesByTopicId} = require('../queries/articles.queries');

exports.getAllArticles = (req, res, next) => {
    return res.send('in getAllTArticles');
  };
  
exports.getArticlesById = (req, res, next) => {
      return res.send('getArticlesById');
  };

exports.getCommentsforArticle = (req, res, next) => {
      return res.send('getCommentsforArticle');
  };

  exports.postNewCommentToArticle = (req, res, next) => {
    return res.send('postNewCommentToArticle');
};

  exports.changeArticleVotes = (req, res, next) => {
    return res.send('articleVotes');
};
