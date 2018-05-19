const express = require('express');
const router = express.Router();
const topicsRouter = require('./topics.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const usersRouter = require('./users.router.js');

router.get('/', (req, res, next) => {
    return res.send('in api route');
});
// GET /api - serves an HTML page with documentation for all the available endpoints

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter)

module.exports = router;