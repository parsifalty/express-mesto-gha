const Card = require("../models/card");
const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { SUCCESS_STATUS, CREATED_STATUS } = require("../constants");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.status(SUCCESS_STATUS).send(cards))
    .catch((err) => next(err));
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) =>
      Card.findById(card._id)
        .populate("owner")
        .then((data) => {
          res.status(CREATED_STATUS).send(data);
        })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError("Карточка другого пользователя");
      }
      Card.deleteOne(card)
        .orFail()
        .then(() => {
          res.status(SUCCESS_STATUS).send({ message: "карточка была удалена" });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(`Неккоректный айди ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не была найдена");
      }
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(`Неккоректный айди ${req.params.cardId}`));
      } else {
        next();
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не была найдена");
      }
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(`Неккоректный айди ${req.params.cardId}`));
      } else {
        next();
      }
    });
};
