const User = require('../models/user');
const {
  SERVER_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
  SUCCESS_STATUS,
  CREATED_STATUS,
  CAST_ERROR_STATUS,
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
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(CAST_ERROR_STATUS)
          .send({ message: 'Пользователь с этим айди не найден' });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_STATUS).send({ data: user }))
    .catch((err) => res.status(VALIDATION_ERROR_STATUS).send({ message: err.message }));
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
      if (err.name === 'CastError') {
        res
          .status(CAST_ERROR_STATUS)
          .send({ message: 'Пользователь с данным айди не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_STATUS).send({ message: err.name });
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
      if (err.name === 'CastError') {
        res
          .status(CAST_ERROR_STATUS)
          .send({ message: 'Пользователь с данным айди не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_STATUS).send({ message: err.name });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};
