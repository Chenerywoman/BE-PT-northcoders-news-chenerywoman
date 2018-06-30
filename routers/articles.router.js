const express = require('express');
const router = express.Router();

const { getAllArticles, getArticleById, getCommentsforArticle, postNewCommentToArticle, changeArticleVotes} = require('../controllers/articles.controller');

router.route('/')
.get(getAllArticles);

router.route('/:article_id')
.get(getArticleById)
.put(changeArticleVotes);

router.route('/:article_id/comments')
.get(getCommentsforArticle)
.post(postNewCommentToArticle);

module.exports = router;
