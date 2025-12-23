
const pool = require('../config/db')
const axios = require('axios');
const key = 'ctNxAG9jR75mXy16JMTDPGKnWZYEhXMp'

/**
 * 列表
 */
exports.list = async (req, res) => {
  const { userId } = req.user
  // userID 必须再数据库中有
  const [rows] = await pool.query('SELECT id FROM users WHERE id = ?', [userId])
  if (rows.length === 0) {
    return res.status(400).json({ message: '用户不存在' })
  }

  const list = await pool.query('SELECT phone FROM phones WHERE user_id = ? AND status = 1 ORDER BY create_at DESC', [userId])

  const userInfo = await pool.query('SELECT money FROM users WHERE id = ?', [userId])

  res.status(200).json({ phones: list[0], userInfo: userInfo[0] })
}


// 获取一个号码
exports.get = async (req, res) => {
  const { userId } = req.user
  const { feature, province, cardtype } = req.query

  if (!feature) return res.status(400).json({ message: '请填写特征码!' })

  // 如果用户已经有5条正在用的号码,那么就不再获取号码
  const [rows] = await pool.query('SELECT id FROM phones WHERE user_id = ? AND status = 1', [userId])
  if (rows.length >= 5) {
    return res.status(400).json({ message: '您已达到最大使用号码数,请先移除部分号码' })
  }
  // axios https://www.usapi6.com/api/get_number?key=秘钥&feature=特征码
  let url = `http://www.usapi6.com/api/get_number?key=${key}&feature=${feature}`
  if (province) url += `&province=${province}`
  if (cardtype) url += `&cardtype=${cardtype}`
  const response = await axios.get(url)
  const data = response.data

  await pool.query('INSERT INTO phones (user_id, phone, status) VALUES (?, ?, 1)', [userId, data.data])

  res.status(200).json({ phone: data.data })
}

// 移除使用的号码
exports.block = async (req, res) => {
  const { userId } = req.user
  const { phone } = req.query

  // 号码不存在
  const [rows] = await pool.query('SELECT id FROM phones WHERE user_id = ? AND phone = ? AND status = 1', [userId, phone])
  if (rows.length === 0) {
    return res.status(400).json({ message: '号码不存在/已被移除' })
  }

  const result = await axios.get(`http://www.usapi6.com/api/block_del?key=${key}&tel=${phone}`)

  if (result.data.code !== 1) {
    return res.status(500).json({ message: '移除号码失败,请稍后再试' })
  }

  await pool.query('UPDATE phones SET status = 0 WHERE user_id = ? AND phone = ?', [userId, phone])

  res.status(200).json({ message: '移除号码成功' })
}

// 获取验证码
exports.code = async (req, res) => {
  const { userId } = req.user
  const { phone } = req.query

  // 号码不存在
  const [rows] = await pool.query('SELECT id FROM phones WHERE user_id = ? AND phone = ? AND status = 1', [userId, phone])
  if (rows.length === 0) {
    return res.status(400).json({ message: '号码不存在/已被移除' })
  }

  const result = await axios.get(`http://www.usapi6.com/api/get_message?key=${key}&tel=${phone}`)
  const data = result.data

  if (data.code !== 1) {
    return res.status(500).json({ message: '获取验证码失败,请稍后再试' })
  }
  // 扣钱
  
  res.status(200).json({ message: data.data })
}