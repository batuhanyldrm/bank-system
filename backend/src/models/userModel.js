const db = require("../config/db");

exports.getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM user");
  return rows;
};

exports.createUser = async (user) => {
  const { name, email } = user;
  const [result] = await db.query(
    "INSERT INTO user (name, email) VALUES (?, ?)",
    [name, email]
  );
  return result.insertId;
};