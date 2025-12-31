const db = require("../config/db");

exports.tranferMoney = async ({ fromAccountId, toAccountId, amount}) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Gönderen hesabı kilitler
        const [[fromAccount]] = await db.query(`
            SELECT balance
            FROM accounts
            WHERE id = ? AND is_active = 1
            FOR UPDATE
        `, [fromAccountId]);

        if (!fromAccount) {
            throw new Error("Gönderen hesap bulunamadı veya aktif değil.");
        }

        if (fromAccount.balance < amount) {
            throw new Error("Yetersiz bakiye.");
        }

        if (fromAccountId === toAccountId) {
            throw new Error("Aynı hesaba transfer yapılamaz.");
        }

        // Alıcı hesabı
        const [[toAccount]] = await connection.query(`
            SELECT id
            FROM accounts
            WHERE id = ? AND is_active = 1
        `, [toAccountId]);

        if (!toAccount) {
            throw new Error("Alıcı hesap bulunamadı veya aktif değil.");
        }

        // Gönderen bakiyesini düş
        await connection.query(`
            UPDATE accounts
            SET balance = balance - ?
            WHERE id = ?
        `, [amount, fromAccountId]);

        // Alıcı bakiyesini artır
        await connection.query(`
            UPDATE accounts
            SET balance = balance + ?
            WHERE id = ?
        `, [amount, toAccountId]);

        // işlem logu
        await connection.query(`
            INSERT INTO transactions(
                from_account_id,
                to_account_id,
                amount,
                transaction_date,
                status
            ) VALUES (?, ?, ?, NOW(), 'SUCCESS')
        `, [fromAccountId, toAccountId, amount]);

        await connection.commit();

    } catch (err) {
        await connection.rollback();

        // FAILED log
        await connection.query(`
            INSERT INTO transactions (
                from_account_id,
                to_account_id,
                amount,
                status
            ) VALUES (?, ?, ?, 'FAILED')
            `, [fromAccountId, toAccountId, amount]
        );

        throw err;
    } finally {
        connection.release();
    }
}