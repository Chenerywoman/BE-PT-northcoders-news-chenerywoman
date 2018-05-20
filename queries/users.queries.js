const {User} = require('../models');

exports.findAllUsers = () => User.find();

exports.findUserById = (id) => User.findById(id);

exports.findUserByUserName = (username) => User.findOne({username});

