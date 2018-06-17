const express = require('express');
const router = express.Router();

const { getAllArticles, getArticlesById, getCommentsforArticle, postNewCommentToArticle, changeArticleVotes} = require('../controllers/articles.controller');

router.route('/')
.get(getAllArticles);

router.route('/:article_id')
.get(getArticlesById)
.put(changeArticleVotes);

router.route('/:article_id/comments')
.get(getCommentsforArticle)
.post(postNewCommentToArticle);

module.exports = router;
