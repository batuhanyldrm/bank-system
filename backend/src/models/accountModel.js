const db = require("../config/db");

const { v4: uuidv4 } = require("uuid");

exports.createAccount = async ({ userId, name }) => {
    const id = uuidv4();

    const number = "AC" + Date.now() + Math.floor(Math.random() * 1000);

    try {
        const [result] = await db.query(`
            INSERT INTO accounts (
                id,
                user_id,
                number,
                name,
                balance,
                created_at,
                updated_at
            ) VALUES(?, ?, ?, ?, 0.00, NOW(), NOW()) 
        `, [id, userId, number, name]
        );

        if (result.affectedRows !== 1) {
            throw new Error("Hesap oluşturulamadı.");
        }

        return {
            id,
            number,
            name,
            balance: 0.00
        };

    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            throw new Error("Bu hesap adı zaten mevcut.");
        }
        throw err;
    }

}

exports.updatedAccountName = async ({ accountId, userId, name }) => {
    try {
        const [result] = await db.query(`
            UPDATE accounts
            SET name = ?,
            updated_at = NOW()
            WHERE id = ? AND user_id = ?
        `, [name, accountId, userId]);

        if (result.affectedRows === 0) {
            return false;
        }

        return true;

    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            throw new Error("Bu hesap adı zaten mevcut.");
        }
        throw err;
    }
}

exports.deletedAccount = async ({ accountId, userId }) => {
    try {
        const [result] = await db.query(`
            UPDATE accounts
            SET is_active = 0,
                updated_at = NOW()
            WHERE id = ?
                AND user_id = ?
                AND balance = 0
                AND is_active = 1
            
        `, [accountId, userId]);

        return result.affectedRows === 1;
    } catch (err) {
        throw err;
    }
}