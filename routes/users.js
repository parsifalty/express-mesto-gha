const router = require('express').Router();

const {
  getUser,
  getUserById,
  editUserData,
  editUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', editUserData);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
