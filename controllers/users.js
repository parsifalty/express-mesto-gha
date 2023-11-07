const User = require('../models/user');
const {
  BAD_REQUEST_STATUS,
  SERVER_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
} = require('../constants');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res
      .status(SERVER_ERROR_STATUS)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(BAD_REQUEST_STATUS)
          .send({ message: 'Пользователь с этим айди не найден' });
      } else {
        res.send(user);
      }
    })
    .catch(() => res
      .status(SERVER_ERROR_STATUS)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(VALIDATION_ERROR_STATUS).send({ message: err.message }));
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: 'true', runValidators: true },
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(VALIDATION_ERROR_STATUS).send({ message: err.message });
        } else {
          res
            .status(BAD_REQUEST_STATUS)
            .send({ message: 'Пользователь с данным айди не найден' });
        }
      });
  } else {
    res
      .status(SERVER_ERROR_STATUS)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.editUserAvatar = (req, res) => {
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: 'true', runValidators: true },
    )
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(VALIDATION_ERROR_STATUS).send({ message: err.message });
        } else {
          res
            .status(BAD_REQUEST_STATUS)
            .send({ message: 'Пользователь с данным айди не найден' });
        }
      });
  } else {
    res
      .status(SERVER_ERROR_STATUS)
      .send({ message: 'На сервере произошла ошибка' });
  }
};
