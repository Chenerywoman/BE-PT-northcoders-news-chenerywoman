const express = require('express');
const router = express.Router();
const topicsRouter = require('./topics.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const usersRouter = require('./users.router.js');
const path = require('path');

router.get('/', (req, res, next) => res.sendFile(path.join(__dirname, '..', 'public/index.html')));

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);

module.exports = router;
