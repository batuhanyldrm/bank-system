const db = require("../config/db");

exports.getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM user");
  return rows;
};

exports.createUser = async (user) => {
  const { username, password, email, created_at, updated_at } = user;
  const [result] = await db.query(
    "INSERT INTO user (username, password, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [username, password, email, created_at, updated_at]
  );
  return result.insertId;
};