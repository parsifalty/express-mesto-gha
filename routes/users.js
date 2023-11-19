const router = require("express").Router();

const {
  getUser,
  getUserById,
  addUser,
  editUserData,
  editUserAvatar,
  login,
  getCurrentUser,
} = require("../controllers/users");

router.get("/", getUser);
router.get("/me", getCurrentUser);
router.get("/:userId", getUserById);
router.patch("/me", editUserData);
router.patch("/me/avatar", editUserAvatar);
router.post("/signin", login);
router.post("/signup", addUser);

module.exports = router;
