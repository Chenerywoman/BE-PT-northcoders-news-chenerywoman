const express = require('express');
const router = express.Router();

const { getAllArticles, getArticlesById, getCommentsforArticle, postNewCommentToArticle,changeArticleVotes} = require('../controllers/articles.controller');

router.get('/', getAllArticles);

router.get('/:article_id', getArticlesById);

router.get('/:article_id/comments', getCommentsforArticle);

router.post('/:article_id/comments', postNewCommentToArticle);

router.put('/:article_id', changeArticleVotes);

module.exports = router;
