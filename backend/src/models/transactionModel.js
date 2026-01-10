const db = require("../config/db");

exports.getAccountTransaction = async ({ accountNumber, userId }) => {
  const [result] = await db.query(
    `
    SELECT
      transactions.id,
      transactions.from_account_number AS fromAccountNumber,
      sender.username       AS senderUsername,
      transactions.to_account_number   AS toAccountNumber,
      receiver.username     AS receiverUsername,
      transactions.amount,
      transactions.transaction_date    AS transactionDate,
      transactions.status,
      transactions.description,

      CASE
        WHEN transactions.to_account_number = ? THEN 'IN'
        WHEN transactions.from_account_number = ? THEN 'OUT'
      END AS direction

    FROM transactions transactions

    LEFT JOIN accounts from_acc
      ON from_acc.number = transactions.from_account_number
    LEFT JOIN users sender
      ON sender.id = from_acc.user_id

    LEFT JOIN accounts to_acc
      ON to_acc.number = transactions.to_account_number
    LEFT JOIN users receiver
      ON receiver.id = to_acc.user_id

    WHERE (transactions.from_account_number = ? OR transactions.to_account_number = ?)
      AND (
        from_acc.user_id = ?
        OR to_acc.user_id = ?
      )

    ORDER BY transactions.transaction_date DESC
    `,
    [
      accountNumber, // direction IN
      accountNumber, // direction OUT
      accountNumber,
      accountNumber,
      userId,
      userId,
    ]
  );

  return result;
};

exports.tranferMoney = async ({ fromAccountNumber, toAccountNumber, amount}) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Gönderen hesabı kilitler
        const [[fromAccount]] = await db.query(`
            SELECT balance
            FROM accounts
            WHERE number = ? AND is_active = 1
            FOR UPDATE
        `, [fromAccountNumber]);

        if (!fromAccount) {
            throw new Error("Gönderen hesap bulunamadı veya aktif değil.");
        }

        if (fromAccount.balance < amount) {
            throw new Error("Yetersiz bakiye.");
        }

        if (fromAccountNumber === toAccountNumber) {
            throw new Error("Aynı hesaba transfer yapılamaz.");
        }

        // Alıcı hesabı
        const [[toAccount]] = await connection.query(`
            SELECT id
            FROM accounts
            WHERE number = ? AND is_active = 1
        `, [toAccountNumber]);

        if (!toAccount) {
            throw new Error("Alıcı hesap bulunamadı veya aktif değil.");
        }

        // Gönderen bakiyesini düş
        await connection.query(`
            UPDATE accounts
            SET balance = balance - ?
            WHERE number = ?
        `, [amount, fromAccountNumber]);

        // Alıcı bakiyesini artır
        await connection.query(`
            UPDATE accounts
            SET balance = balance + ?
            WHERE number = ?
        `, [amount, toAccountNumber]);

        // işlem logu
        await connection.query(`
            INSERT INTO transactions(
                from_account_number,
                to_account_number,
                amount,
                transaction_date,
                status
            ) VALUES (?, ?, ?, NOW(), 'SUCCESS')
        `, [fromAccountNumber, toAccountNumber, amount]);

        await connection.commit();

    } catch (err) {
        await connection.rollback();

        // FAILED log
        await connection.query(`
            INSERT INTO transactions (
                from_account_number,
                to_account_number,
                amount,
                status
            ) VALUES (?, ?, ?, 'FAILED')
            `, [fromAccountNumber, toAccountNumber, amount]
        );

        throw err;
    } finally {
        connection.release();
    }
}