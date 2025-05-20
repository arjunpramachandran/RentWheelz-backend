const express = require('express')
const router = express.Router()

const customerRouter = require('./customerRoutes')
const adminRouter = require('./adminRoutes')
const hostRouter = require('./hostRoutes')

router.use('/user',customerRouter);
router.use('/admin',adminRouter);
router.use('/host',hostRouter)













module.exports = router;
