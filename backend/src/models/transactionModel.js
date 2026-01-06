const db = require("../config/db");

exports.getAccountTransaction = async ({ accountId, userId }) => {
    const [result] = await db.query(`
        SELECT
            transactions.id,

            from_acc.number AS fromAccountNumber,
            from_user.username AS senderUsername,

            to_acc.number AS toAccountNumber,
            to_user.username AS receiverUsername,

            transactions.amount,
            transactions.transaction_date AS transactionDate,
            transactions.status,
            transactions.description,

            CASE
                WHEN transactions.to_account_id = ? THEN 'IN'
                WHEN transactions.from_account_id = ? THEN 'OUT'
            END AS direction

        FROM transactions transactions

        INNER JOIN accounts from_acc 
            ON from_acc.id = transactions.from_account_id
        INNER JOIN users from_user 
            ON from_user.id = from_acc.user_id

        INNER JOIN accounts to_acc 
            ON to_acc.id = transactions.to_account_id
        INNER JOIN users to_user 
            ON to_user.id = to_acc.user_id

        INNER JOIN accounts user_acc
            ON user_acc.id IN (transactions.from_account_id, transactions.to_account_id)

        WHERE user_acc.id = ?
          AND user_acc.user_id = ?

        ORDER BY transactions.transaction_date DESC
    `, [accountId, accountId, accountId, userId]);

    return result;
}

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