const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60* 1000,
    max: 5,
    message: "Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin."
})

router.post("/login", loginLimiter, authController.login);

module.exports = router;