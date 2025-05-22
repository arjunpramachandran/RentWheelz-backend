const express = require('express')
const adminRouter = express.Router()

const {authAdmin} = require('../middleware/authMiddleware')
const {getAllCustomer,getAllHost,getAllVehicles,getAllBookings,getAllReviews,getAllPayments,deleteUserProfile, checkAdmin} = require('../controllers/adminController')
const {AddVehicle,updateVehicle,deleteVehicle,getVehicle,getVehiclebyOwner} = require('../controllers/vehicleController')


adminRouter.get('/check-Admin',authAdmin, checkAdmin )

adminRouter.delete('/delete/:id',authAdmin,deleteUserProfile) //delete profile
adminRouter.get('/getAllCustomers',authAdmin,getAllCustomer) //get all customers
adminRouter.get('/getAllHosts',authAdmin,getAllHost) //get all hosts

adminRouter.get('/getAllBookings',authAdmin,getAllBookings) //get all bookings


adminRouter.get('/getAllReviews',authAdmin,getAllReviews) //get all reviews


adminRouter.get('/getAllPayments',authAdmin,getAllPayments) //get all payments

adminRouter.get('/getAllVehicles',authAdmin,getAllVehicles) //get all vehicles
adminRouter.post('/addVehicle',authAdmin,AddVehicle) //add vehicle
adminRouter.patch('/updateVehicle/:id',authAdmin,updateVehicle) //update vehicle  
adminRouter.delete('/deleteVehicle/:id',authAdmin,deleteVehicle) //delete vehicle
adminRouter.get('/getVehicle/:id',authAdmin,getVehicle) //get vehicle
adminRouter.get('/getVehiclebyOwner/:userid',authAdmin,getVehiclebyOwner) //get vehicle by user



module.exports = adminRouter