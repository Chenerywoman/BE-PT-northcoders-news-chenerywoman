const express = require('express');
const router = express.Router();

const { changeCommentVotes, deleteComment, getCommentById, getComments} = require('../controllers/comments.controller');

router.get('/', getComments);

router.route('/:comment_id')
.get(getCommentById)
.put(changeCommentVotes)
.delete(deleteComment);

module.exports = router;
