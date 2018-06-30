const {Comment} = require('../models');
                                            // select removes the __v key, belongs_to is populated with the _id & title (of the article), created_by is populated with the _id & username (of the user)
exports.findComments = () => Comment.find().select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username', 'avatar_url']).lean();

exports.findCommentById = (_id) => Comment.findById(_id).select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username', 'avatar_url']).lean();


exports.findCommentsForArticle = (belongs_to) => Comment.find({belongs_to}).select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username', 'avatar_url']).lean();

// adding lean creates a server error
exports.createComment = (body, belongs_to, created_by) => Comment.create({body, belongs_to, created_by});

exports.updateCommentVote  = (_id, vote) => {
    const change = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;
    return Comment.findByIdAndUpdate(_id, {$inc: {votes: change}}, {new: true}).lean();
};

exports.deleteComment = (_id) => Comment.findByIdAndRemove(_id).lean();

exports.countCommentsForArticle = (belongs_to) => Comment.count({belongs_to}).lean();
