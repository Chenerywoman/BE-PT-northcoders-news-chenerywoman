const express = require('express');
const router = express.Router();

const { getAllTopics, getArticlesByTopicId, postNewArticleToTopic } = require('../controllers/topics.controller');

router.get('/', getAllTopics);

router.route('/:topic_id/articles')
.get(getArticlesByTopicId)
.post(postNewArticleToTopic);

module.exports = router;
