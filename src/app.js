const express = require('express')
const authRoutes = require('./routes/auth')
const rechargeRoutes = require('./routes/rechargeRoutes')
const notifyRoutes = require('./routes/notifyRoutes')

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/recharge', rechargeRoutes)
app.use('/api/notify', notifyRoutes)

app.listen(8999, () => {
  console.log('🚀 Server running at http://localhost:8999')
})
