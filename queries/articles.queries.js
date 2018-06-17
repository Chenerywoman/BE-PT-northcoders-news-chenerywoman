const {Article} = require('../models');

exports.findAllArticles = () => Article.find().lean().select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username']).lean();

exports.findArticleById = (id) => Article.findById(id).select('-__v').populate('belongs_to', ['_id', 'title']).populate('created_by', ['_id', 'username']).lean();

// n.b. with .lean() this returns a server error
exports.createArticle = (title, body, belongs_to, created_by) => Article.create({title, body, belongs_to, created_by});

exports.updateArticleVote  = (_id, vote) => {
    const change = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;
    return Article.findByIdAndUpdate(_id, {$inc: {votes: change}}, {new: true}).lean();
};
