const {Comment} = require('../models');
                                            // select removes the __v key, belongs_to is populated with the _id & title (of the article), created_by is populated with the _id & username (of the user)
exports.findComments = () => Comment.find().select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username']);

exports.findCommentById = (_id) => Comment.findById(_id).select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username']);

exports.findCommentsForArticle = (belongs_to) => Comment.find({belongs_to}).select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username']);

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

exports.countCommentsForArticle = (belongs_to) => Comment.count({belongs_to});
