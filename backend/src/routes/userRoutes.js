const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

router.get("/me", auth, userController.getMe)
router.get("/:id", auth, userController.getUserById);
router.get("/", auth, userController.getUsers);
router.post("/", userController.createUser);

module.exports = router;