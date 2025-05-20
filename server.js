const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()

const connectDB = require('./config/db')
require('dotenv').config()
const port = process.env.PORT
const router = require('./routes/index')

app.get('/',(req,res)=>{
  res.send('Hello World')
})
app.use(express.json())
app.use(cookieParser())
app.use('/api',router)

connectDB()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})