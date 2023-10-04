//const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { STATUS_CODES } = require('../utils/constants');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(201).send({ users }))
    .catch((err) => res.status(500).send(err.message));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send(err.message));
};


const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send(err.message));
};



module.exports = {
  getUsers,
  createUser,
  getUserById,

};