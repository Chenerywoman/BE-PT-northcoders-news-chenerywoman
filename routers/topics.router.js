const express = require('express');
const router = express.Router();

const { getAllTopics, getArticlesByTopicId, postNewArticleToTopic } = require('../controllers/topics.controller');

router.get('/', getAllTopics);

router.get('/:topic_id/articles', getArticlesByTopicId);

router.post('/:topic_id/articles', postNewArticleToTopic);

module.exports = router;
