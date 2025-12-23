
const pool = require('../config/db')
const nodemailer = require('nodemailer');
/**
 * 注册
 */
exports.notify = async (req, res) => {
  const { userId } = req.user.userId
  const { amount } = req.query
  // 受用nodemeailer发送通知邮件给 495174699@qq.com
  // 创建 transporter（用你自己的 SMTP 配置）
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',    // SMTP 服务器
    port: 587,                   // 端口
    secure: false,               // true for 465, false for 587
    auth: {
      user: '495174699@qq.com',  // 你的邮箱
      pass: 'byxjgcnunyqtbjje',     // SMTP 授权码或密码
    },
  });

  const uuid = Date.now(); // 简单的唯一 ID 生成方式

  transporter.sendMail({
    from: '"充值通知" <495174699@qq.com>',
    to: '495174699@qq.com',
    subject: '充值通知',
    text: `用户 ${userId} 充值 ${amount} 元`,
    html: `<a href="http://23.94.66.43:8999/api/recharge?userId=${userId}&amount=${amount}&uuid=${uuid}">点击充值</a> | <a href="http://23.94.66.43:8999/api/recharge?userId=${userId}&amount=1">充值1元按钮</a>`
  }).then(info => {
    console.log('邮件发送成功');
  }).catch(err => {
    console.error('邮件发送失败:', err);
  });

  res.status(200).json({ message: '通知发送成功' })
}
