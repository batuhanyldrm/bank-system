const User = require("../models/userModel");

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.getUser(userId);

    if (!user) {
      return res.status(404).json({message: "Kullanıcı Bulunamadı."})
    }

    res.json(user);
  } catch (error) {
    return res.status(500).json({message: res.message})
  }
}

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Geçersiz kullanıcı ID" });
    }

    const user = await User.getUser(id);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const id = await User.createUser(req.body);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};