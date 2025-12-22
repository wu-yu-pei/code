const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const jwtConfig = require('../config/jwt')

/**
 * 注册
 */
exports.register = async (req, res) => {
  const { username, password, confirmPassword } = req.body

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: '参数不能为空' })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: '两次密码不一致' })
  }

  // 校验用户名是否存在
  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE username = ?',
    [username]
  )

  if (rows.length > 0) {
    return res.status(400).json({ message: '用户名已存在' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await pool.execute(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, passwordHash]
  )

  res.json({ message: '注册成功' })
}

/**
 * 登录
 */
exports.login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: '参数不能为空' })
  }

  const [rows] = await pool.execute(
    'SELECT id, password FROM users WHERE username = ?',
    [username]
  )

  if (rows.length === 0) {
    return res.status(400).json({ message: '用户名或密码错误' })
  }

  const user = rows[0]

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: '用户名或密码错误' })
  }

  const token = jwt.sign(
    { userId: user.id, username },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  )

  res.json({
    message: '登录成功',
    token
  })
}
