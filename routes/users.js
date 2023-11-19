const router = require('express').Router();

const {
  getUsers,
  getUserById,
  addUser,
  editUserData,
  editUserAvatar,
  login,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', editUserData);
router.patch('/me/avatar', editUserAvatar);
router.post('/signin', login);
router.post('/signup', addUser);

module.exports = router;
