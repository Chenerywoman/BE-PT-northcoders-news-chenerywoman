const {findCommentById, updateCommentVote, deleteComment, findComments} = require('../queries/comments.queries');

exports.getComments = (req, res, next) => {
  return findComments()
    .then(comments => res.status(200).send({comments}))
    .catch(() =>  next({status: 500, message: 'server error - unable get comments'}));
};

exports.getCommentById = (req, res, next) => {
  return findCommentById(req.params.comment_id)
    .then(comment  => res.status(200).send({comment}))
    .catch(err => {
      if (err.name === 'CastError' && err.model.modelName === 'comments') return next({ status: 400,  message: `${req.params.comment_id} is not a valid comment id`});
      else return next({status: 500, message: 'server error - unable to delete'});
    });
};

exports.changeCommentVotes = (req, res, next) => {
    return findCommentById(req.params.comment_id)
    .then(comment => {
      return updateCommentVote(comment._id, req.query.vote);
      })
    .then(comment => {
      // n.b. if invalid key or value put into query string parameter, just returns the original comment unchanged
      res.status(200).send({updated_comment: comment});
    })
    .catch(err => { 
      if (err.name === 'CastError' && err.model.modelName === 'comments') return next({ status: 400,  message: `${req.params.comment_id} is not a valid comment id`});
      else return next({status: 500, message: 'server error'});
      });
};

exports.deleteComment = (req, res, next) => {
  return findCommentById(req.params.comment_id)
    .then(comment => {
      if (!comment) throw {status:404, message: `comment with id ${req.params.comment_id} does not exist`};
      else return deleteComment(comment._id);
      })
    .then(comment  => res.status(200).send({deleted_comment: comment}))
    .catch(err => {
      if (err.status === 404) return next(err);
      else if (err.name === 'CastError' && err.model.modelName === 'comments') return next({ status: 400,  message: `${req.params.comment_id} is not a valid comment id`});
      else return next({status: 500, message: 'server error - unable to delete'});
    });
};
