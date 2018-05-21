const express = require('express');
const router = express.Router();

const { changeCommentVotes, deleteComment, getCommentById} = require('../controllers/comments.controller');

router.get('/:comment_id', getCommentById);

router.put('/:comment_id', changeCommentVotes);

router.delete('/:comment_id', deleteComment);

module.exports = router;
