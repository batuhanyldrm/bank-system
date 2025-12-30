const Account = require("../models/accountModel");

exports.createAccount = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        if (!name || name.length < 3) {
            return res.status(400).json({
                message: "Hesap adı en az 3 karakter olmalıdır."
            });
        }

        const account = await Account.createAccount({
        userId,
        name
        });

        res.status(201).json({
            message: "Hesap başarıyla oluşturuldu.",
            account
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateAccountName = async (req, res) => {
  try {
    const updated = await Account.updatedAccountName({
      accountId: req.params.id,
      userId: req.user.id,
      name: req.body.name
    });

    if (!updated) {
      return res.status(404).json({
        message: "Hesap bulunamadı veya yetkiniz yok."
      });
    }

    res.json({ message: "Hesap adı güncellendi." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
    try {
        const deletedAccount = await Account.deletedAccount({
            accountId: req.params.id,
            userId: req.user.id
        });

        if (!deletedAccount) {
            return res.status(400).json({
                message: "Hesap silinemedi. Bakiyesi sıfır olmayabilir veya hesap bulunamadı."
            });
        }

        res.json({ message: "Hesap başarıyla kapatıldı." });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

