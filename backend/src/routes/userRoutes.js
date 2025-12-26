const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

router.get("/:id", auth, userController.getUserById);
router.get("/", userController.getUsers);
router.post("/", userController.createUser);

module.exports = router;