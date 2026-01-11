const db = require("../config/db");

const buildDateCondition = (filterPeriod) => {
  const days = Number(filterPeriod);

  if (!Number.isInteger(days) || days <= 0 || days > 365) {
    return null;
  }

  return `transactions.transaction_date >= DATE_SUB(NOW(), INTERVAL ${days} DAY)`;
};

exports.getAccountTransaction = async ({
  accountNumber,
  userId,
  filterDirection,
  filterPeriod,
  page,
  limit,
}) => {
  const offset = (page - 1) * limit;

  const whereConditions = [];
  const params = [];

  whereConditions.push("(transactions.from_account_number = ? OR transactions.to_account_number = ?)");
  params.push(accountNumber, accountNumber);

  whereConditions.push("(from_acc.user_id = ? OR to_acc.user_id = ?)");
  params.push(userId, userId);

  if (filterDirection === "IN") {
    whereConditions.push("transactions.to_account_number = ?");
    params.push(accountNumber);
  }

  if (filterDirection === "OUT") {
    whereConditions.push("transactions.from_account_number = ?");
    params.push(accountNumber);
  }

  const dateCondition = buildDateCondition(filterPeriod);
  if (dateCondition) {
    whereConditions.push(dateCondition);
  }

  const whereSQL = `WHERE ${whereConditions.join(" AND ")}`;

  const [rows] = await db.query(
    `
    SELECT
      transactions.id,
      transactions.from_account_number AS fromAccountNumber,
      sender.username AS senderUsername,
      transactions.to_account_number AS toAccountNumber,
      receiver.username AS receiverUsername,
      transactions.amount,
      transactions.transaction_date AS transactionDate,
      transactions.status,
      transactions.description,

      CASE
        WHEN transactions.to_account_number = ? THEN 'IN'
        WHEN transactions.from_account_number = ? THEN 'OUT'
      END AS filterDirection

    FROM transactions

    LEFT JOIN accounts from_acc
      ON from_acc.number = transactions.from_account_number
    LEFT JOIN users sender
      ON sender.id = from_acc.user_id

    LEFT JOIN accounts to_acc
      ON to_acc.number = transactions.to_account_number
    LEFT JOIN users receiver
      ON receiver.id = to_acc.user_id

    ${whereSQL}

    ORDER BY transactions.transaction_date DESC
    LIMIT ? OFFSET ?
    `,
    [
      accountNumber,
      accountNumber,
      ...params,
      limit,
      offset,
    ]
  );

  const [[{ total }]] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM transactions

    LEFT JOIN accounts from_acc
      ON from_acc.number = transactions.from_account_number
    LEFT JOIN accounts to_acc
      ON to_acc.number = transactions.to_account_number

    ${whereSQL}
    `,
    params
  );

  return {
    data: rows,
    pagination: { page, limit, total },
  };
};

exports.tranferMoney = async ({ fromAccountNumber, toAccountNumber, amount, description}) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Gönderen hesabı kilitler
        const [[fromAccount]] = await connection.query(`
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

        const ACCOUNT_NUMBER_REGEX = /^[A-Z0-9]{18}$/;

        if (!ACCOUNT_NUMBER_REGEX.test(fromAccountNumber)) {
        throw new Error("Gönderen hesap numarası geçersiz.");
        }

        if (!ACCOUNT_NUMBER_REGEX.test(toAccountNumber)) {
        throw new Error("Alıcı hesap numarası geçersiz.");
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
                description,
                transaction_date,
                status
            ) VALUES (?, ?, ?, ?, NOW(), 'SUCCESS')
        `, [fromAccountNumber, toAccountNumber, amount, description]);

        await connection.commit();

    } catch (err) {
        await connection.rollback();

        // FAILED log
        await connection.query(`
            INSERT INTO transactions (
                from_account_number,
                to_account_number,
                amount,
                description,
                status
            ) VALUES (?, ?, ?, ?, 'FAILED')
            `, [fromAccountNumber, toAccountNumber, amount, description]
        );

        throw err;
    } finally {
        connection.release();
    }
}