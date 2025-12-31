const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const transactionController = require("../controllers/transactionController");

router.post("/transfer", auth, transactionController.transfer);

module.exports = router;