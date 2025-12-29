const db = require("../config/db");
const bcrypt = require("bcrypt");

const { v4: uuidv4 } = require("uuid");

exports.getUserLogin = async (email) => {
	const [rows] = await db.query(`
		SELECT
			id,
			username,
			password
		FROM users
		WHERE email = ?
		LIMIT 1`,
		[email])
	return rows[0] || null;
}

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
  
	const id = uuidv4();
  	const hashPassword = await bcrypt.hash(password, 12);

	try {
		const [result] = await db.query(`
		INSERT INTO users (
			id,
			username,
			password,
			email,
			created_at,
			updated_at
		) VALUES (?, ?, ?, ?, NOW(), NOW())
		`, [id, username, hashPassword, email]);

		if (result.affectedRows !== 1) {
			throw new Error("Kullanıcı oluşturulamadı.");
		}

		return id;

	} catch (err) {
		if (err.code === "ER_DUP_ENTRY") {
		throw new Error("Bu e-posta adresi zaten kayıtlı.");
		}
		throw err;
	}
};