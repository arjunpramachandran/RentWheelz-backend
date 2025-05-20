const express = require('express')
const customerRouter = express.Router()
const {register,login,profile,logout,updateProfile} = require('../controllers/customerController')
const {authUser} = require('../middleware/authMiddleware')
const { getAllVehicles } = require('../controllers/adminController')
const { getVehicle } = require('../controllers/vehicleController')



customerRouter.post('/register',register)   //   register/signUp
customerRouter.post('/login',login)         //  login

customerRouter.get('/getAllVehicles',getAllVehicles) //get all vehicles
customerRouter.get('/getVehicle/:id',getVehicle) //get vehicle by id


customerRouter.get('/profile',authUser,profile) //profile
customerRouter.get('/logout',authUser,logout) //logout
customerRouter.patch('/update',authUser,updateProfile) //update profile









module.exports = customerRouter