const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const accountController = require("../controllers/accountController");

router.post("/", auth, accountController.createAccount)
router.put("/:id", auth, accountController.updateAccountName)

module.exports = router;