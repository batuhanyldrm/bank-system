const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const accountController = require("../controllers/accountController");

router.get("/:id", auth, accountController.getAccount)
router.post("/", auth, accountController.createAccount)
router.put("/:id", auth, accountController.updateAccountName)
router.delete("/:id", auth, accountController.deleteAccount)

module.exports = router;