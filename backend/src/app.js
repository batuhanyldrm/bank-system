const express = require("express");
const cors = require("cors");

const accountRoutes = require("./routes/accountRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/accounts", accountRoutes)
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;