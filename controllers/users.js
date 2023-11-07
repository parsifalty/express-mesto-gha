const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const CastError = require("../errors/CastError");
const ValidationError = require("../errors/ValidationError");

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с этим айди не найден");
      } else {
        res.send(user);
      }
    })
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ValidationError(
          "Переданы некорректные данные при создании пользователя"
        );
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: "true", runValidators: true }
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          throw new ValidationError(err.message);
        } else {
          throw new NotFoundError("Пользователь с этим айди не был найден");
        }
      });
  } else {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

module.exports.editUserAvatar = (req, res) => {
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: "true", runValidators: true }
    )
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === "ValidationError") {
          throw new ValidationError(err.message);
        } else {
          throw new NotFoundError("Пользователь с этим айди не был найден");
        }
      });
  } else {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};
