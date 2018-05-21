const {findCommentById, updateCommentVote} = require('../queries/comments.queries');

exports.changeCommentVotes = (req, res, next) => {
    return findCommentById(req.params.comment_id)
    .then(comment => {
      const {vote} = req.query;
      if (vote !== 'up' && vote !== 'down') throw {status: 400, message: 'query string parameter "vote" must be "up" or "down"'}
      else if (vote === 'up') comment.votes = comment.votes + 1;
      else if (vote === 'down') comment.votes = comment.votes - 1;
      return updateCommentVote(comment._id, comment.votes);
      })
    .then(comment => findCommentById(comment._id))
    .then(comment => res.status(200).send({updated_comment: comment}))
    .catch((err) => { 
      if (err.name === 'CastError' && err.model.modelName === 'comments') return next({ status: 400,  message: `${req.params.comment_id} is not a valid comment id`});
      else if (err.status === 400) return next(err);
      else return next({status: 500, message: 'server error'});
      });
};

exports.deleteComment = (req, res, next) => {
    return res.send('delete vote');
};
