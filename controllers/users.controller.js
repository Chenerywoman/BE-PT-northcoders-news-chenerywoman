const {findAllUsers, findUserById, findUserByUserName} = require('../queries/users.queries');

exports.getAllUsers = (req, res, next) => {
    return findAllUsers()
  .then(users => res.status(200).send({users}))
  .catch(() => next({status: 500, controller: 'users'}));
};

exports.getUserProfileFromUserName = (req, res, next) => {
    return findUserByUserName(req.params.username)
  .then(user =>  {
    if (!user) throw {status: 404, message: 'username does not exist'};
    else res.status(200).send({user});
  })
  .catch((err) => { 
    if (err.status === 404) return next(err);
    else return next({status: 500, controller: 'users'});
    });
};

exports.getUserProfile = (req, res, next) => {
    return findUserById(req.params._id)
  .then(user =>  res.status(200).send({user}))
  .catch((err) => { 
    if (err.name === 'CastError') return next({status: 400, message: 'please input a valid user id'});
    else return next({status: 500, controller: 'users'});
    });
};

