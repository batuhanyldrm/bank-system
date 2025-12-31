const Transaction = require("../models/transactionModel");

exports.getAccountTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user.id;

    const transactions = await Transaction.getAccountTransaction({
      accountId,
      userId
    });

    return res.json(transactions);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Geçersiz transfer tutarı." });
    }

    await Transaction.tranferMoney({ fromAccountId, toAccountId, amount });

    res.status(201).json({ message: "Transfer başarıyla gerçekleşti." });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};