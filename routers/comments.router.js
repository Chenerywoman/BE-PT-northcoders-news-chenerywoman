const express = require('express');
const router = express.Router();

const { changeCommentVotes, deleteComment} = require('../controllers/comments.controller');

router.put('/:comment_id', changeCommentVotes);

router.delete('/:comment_id', deleteComment);

module.exports = router;
