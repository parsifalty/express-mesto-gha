const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  SERVER_ERROR_STATUS,
  BAD_REQUEST_STATUS,
  SUCCESS_STATUS,
  CREATED_STATUS,
  NOT_FOUND_STATUS,
  EMAIL_EXISTS_STATUS,
  INCORRECT_TOKEN_STATUS,
} = require('../constants');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_STATUS).send(users))
    .catch(() => res
      .status(SERVER_ERROR_STATUS)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_STATUS)
          .send({ message: 'Пользователь не найден с данным айди' });
        return;
      }
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Пользователь с этим айди не найден' });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.addUser = (req, res) => {
  const {
    name, about, avatar, password, email,
  } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => {
      res.status(CREATED_STATUS).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: err.message });
      } else if (err.code === 11000) {
        res
          .status(EMAIL_EXISTS_STATUS)
          .send({ message: 'Такая почта уже существует, войдите в аккаунт' });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: 'true', runValidators: true },
  )
    .then((user) => res.status(SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: err.name });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: 'true', runValidators: true },
  )
    .then((user) => res.status(SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: err.name });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { password, email } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => {
      res.status(INCORRECT_TOKEN_STATUS).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.userId)
    .select('+password')
    .then((user) => {
      if (!user) {
        return res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Пользователь не был найден' });
      }
      return res.status(SUCCESS_STATUS).send({ data: user });
    })
    .catch(() => {
      res.status(BAD_REQUEST_STATUS).send({ message: 'Неверный айди' });
    });
};
