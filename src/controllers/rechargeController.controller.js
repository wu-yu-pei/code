const pool = require('../config/db')
const payMap = new Map();
exports.recharge = async (req, res) => {
  const userId = req.query.userId;
  const amount = req.query.amount * 1000;
  const uuid = req.query.uuid;

  if (!userId || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: '参数错误' });
  }

  if (uuid) {
    if (payMap.get(uuid)) {
      return res.status(400).json({ message: '该充值链接已被使用' });
    } else {
      payMap.set(uuid, true);
    }
  }

  try {

    // 查询用户是否存在
    const [rows] = await pool.execute('SELECT money FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 更新 money
    const newMoney = rows[0].money + amount;
    await pool.execute('UPDATE users SET money = ? WHERE id = ?', [newMoney, userId]);


    res.json({ message: '充值成功', userId, money: newMoney });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
}
