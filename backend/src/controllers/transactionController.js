const Transaction = require("../models/transactionModel");

exports.getAccountTransactions = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const userId = req.user.id;

    const { filterDirection, filterPeriod, page = 1, limit = 10 } = req.query;

    const transactions = await Transaction.getAccountTransaction({
      accountNumber,
      userId,
      filterDirection,
      filterPeriod,
      page: Number(page),
      limit: Number(limit),
    });

    return res.json(transactions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { fromAccountNumber, toAccountNumber, amount, description } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Geçersiz transfer tutarı." });
    }

    await Transaction.tranferMoney({ fromAccountNumber, toAccountNumber, amount, description });

    res.status(201).json({ message: "Transfer başarıyla gerçekleşti." });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};