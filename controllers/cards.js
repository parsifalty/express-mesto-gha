const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate("owner")
        .then((data) => res.status(201).send(data))
        .catch(() =>
          res.status(404).send({ message: "Карточка с этим айди не найдена" })
        );
    })
    .catch((err) => {
      if (err.name === "ValidationErorr") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res
            .status(404)
            .send({ message: "Карточка с данным айди не найдена" });
        } else {
          res.send({ message: "Карточка удалена" });
        }
      })
      .catch(() =>
        res
          .status(404)
          .send({ message: "Карточка с данным айди не была найдена" })
      );
  } else {
    res
      .status(400)
      .send({ message: "Неправильный айди карточки был введен вами" });
  }
};

module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
      .populate(["owner", "likes"])
      .then((card) => {
        if (!card) {
          res
            .status(404)
            .send({ message: "Карточка с данным айди не была найдена" });
        } else {
          res.status(200).send(card);
        }
      })
      .catch(() =>
        res
          .status(404)
          .send({ message: "Карточка с данным айди не была найдена" })
      );
  } else {
    res
      .status(400)
      .send({ message: "Карточка с указанным айди не была найдена" });
  }
};

module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
      .populate(["owner, likes"])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: "Неправильный айди у карты" });
          return;
        } else {
          res.status(200).send(card);
        }
      })
      .catch(() =>
        res
          .status(404)
          .send({ message: "Карточка с данным айди не была найдена" })
      );
  } else {
    res.status(404).send({ message: "Неправильный айди у карты" });
  }
};
