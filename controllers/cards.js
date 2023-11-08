const Card = require('../models/card');
const {
  SERVER_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
  SUCCESS_STATUS,
  CREATED_STATUS,
  CAST_ERROR_STATUS,
} = require('../constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(SUCCESS_STATUS).send(cards))
    .catch(() => res
      .status(SERVER_ERROR_STATUS)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(CREATED_STATUS).send(data));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(VALIDATION_ERROR_STATUS)
          .send({ message: 'Карточка с этим айди не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_STATUS).send({ message: err.message });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(CAST_ERROR_STATUS)
          .send({ message: 'карточка с данным айди не найдена' });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(CAST_ERROR_STATUS)
          .send({ message: 'Карточка с данным айди не была найдена' });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(SUCCESS_STATUS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(CAST_ERROR_STATUS)
          .send({ message: 'Карточка с данным айди не была найдена' });
      } else {
        res
          .status(SERVER_ERROR_STATUS)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};
