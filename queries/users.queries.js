const {User} = require('../models');

exports.findAllUsers = () => User.find().lean();

exports.findUserById = (id) => User.findById(id).lean();

exports.findUserByUserName = (username) => User.findOne({username}).lean();

