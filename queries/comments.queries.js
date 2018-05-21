const {Comment} = require('../models');

exports.findCommentById = (_id) => Comment.findById(_id);

exports.findCommentsForArticle = (belongs_to) => Comment.find({belongs_to});

exports.createComment = (body, belongs_to, created_by) => Comment.create({body, belongs_to, created_by});

exports.updateCommentVote  = (_id, vote) => {
    // change variable takes a ternary operator if 'vote' (req.query.vote passed in as an argument in the changeCommentVotes in the controller)
    // up 1, down -1 anything else - 0, i.e. doesn't change
    const change = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;
    // pass the variable change to the increment function 
    // {new:true} returns the updated version
    return Comment.findByIdAndUpdate(_id, {$inc: {votes: change}}, {new: true});
};

exports.deleteComment = (_id) => Comment.findByIdAndRemove(_id);
