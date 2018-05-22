const {Article} = require('../models');

exports.findAllArticles = () => Article.find().lean().select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username']).lean();

exports.findArticleById = (id) => Article.findById(id).select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username']);

exports.createArticle = (title, body, belongs_to, created_by) => Article.create({title, body, belongs_to, created_by});

exports.updateArticleVote  = (_id, vote) => {
    // change variable takes a ternary operator if 'vote' (req.query.vote passed in as an argument in the changeCommentVotes in the controller)
    // up 1, down -1 anything else - 0, i.e. doesn't change
    const change = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;
    // pass the variable change to the increment function 
    // {new:true} returns the updated version
    return Article.findByIdAndUpdate(_id, {$inc: {votes: change}}, {new: true});
};
