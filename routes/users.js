const router = require('express').Router();

const {
  getUser,
  getUserById,
  addUser,
  editUserData,
  editUserAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserById);
router.post('/', addUser);
router.patch('/me', editUserData);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
