const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: '未提供 token' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, jwtConfig.secret)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: 'token 无效或已过期' })
  }
}
