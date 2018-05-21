const express = require('express');
const router = express.Router();

const { changeCommentVotes, deleteComment, getCommentById, getComments} = require('../controllers/comments.controller');

router.get('/', getComments);

router.get('/:comment_id', getCommentById);

router.put('/:comment_id', changeCommentVotes);

router.delete('/:comment_id', deleteComment);

module.exports = router;
