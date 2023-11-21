const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ConflictError } = require("../errors/ConflictError");

const User = require("../models/user");
const { SUCCESS_STATUS, CREATED_STATUS } = require("../constants");

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.status(SUCCESS_STATUS).send(users))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(`Неккоректный айди ${req.params.userId}`));
      } else {
        next(err);
      }
    });
};

module.exports.addUser = (req, res, next) => {
  const { name, about, avatar, password, email } = req.body;

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
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError("Такая почта уже существует"));
      } else {
        next(err);
      }
    });
};

module.exports.editUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: "true", runValidators: true }
  )
    .then((user) => res.status(SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: "true", runValidators: true }
  )
    .then((user) => res.status(SUCCESS_STATUS).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.send({
        token,
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь не был найден");
      }
      return res.status(SUCCESS_STATUS).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};
