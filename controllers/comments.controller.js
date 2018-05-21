const {findCommentById, updateCommentVote} = require('../queries/comments.queries');

exports.changeCommentVotes = (req, res, next) => {
    return findCommentById(req.params.comment_id)
    .then(comment => {
      return updateCommentVote(comment._id, req.query.vote);
      })
    .then(comment => {
      // n.b. if invalid key or value put into query string parameter, just returns the original comment unchanged
      res.status(200).send({updated_comment: comment});
    })
    .catch((err) => { 
      if (err.name === 'CastError' && err.model.modelName === 'comments') return next({ status: 400,  message: `${req.params.comment_id} is not a valid comment id`});
      else return next({status: 500, message: 'server error'});
      });
};

exports.deleteComment = (req, res, next) => {
    return res.send('delete vote');
};
