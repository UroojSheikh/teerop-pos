const { User } = require('../models');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'createdAt']
    });
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.role = role;
    await user.save();
    
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, updateUserRole };
