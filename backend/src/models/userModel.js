const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.getUser = async (id) => {
  const [rows] = await db.query(`
	SELECT
		id,
		username,
		email,
		created_at createdAt,
		updated_at updatedAt
	FROM 
		users
	WHERE id = ?
	LIMIT 1`,
	[id]);
  return rows[0] || null;
};

exports.getAllUsers = async () => {
  const [rows] = await db.query(`
	SELECT
		id,
		username,
		email,
		created_at createdAt,
		updated_at updatedAt
	FROM 
		users`
	);
  return rows;
};

exports.createUser = async (user) => {
  const { username, password, email } = user;

  if (!username || username.length < 3) {
	throw new Error("kullanıcı adı 3 karakterden küçük olamaz.");
  }

  if (!password || password.length < 6) {
	throw new Error("Şifre en az 6 karakter olmalıdır.");
  }

  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (!email || !emailFormat.test(email)) {
	throw new Error("E-posta adresi hatalı. '@' ve alan adı içeren geçerli bir e-posta giriniz.");
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const [result] = await db.query(`
	INSERT INTO users (
		username,
		password,
		email,
		created_at,
		updated_at
	) VALUES (?, ?, ?, NOW(), NOW())
	`,
	[
		username,
		hashPassword,
		email
	]
  );

  return result.insertId;
};