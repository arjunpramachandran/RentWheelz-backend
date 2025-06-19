const express = require('express')
const adminRouter = express.Router()

const {authAdmin} = require('../middleware/authMiddleware')
const {getAllCustomer,getAllHost,getAllVehicles,getAllReviews,getAllPayments,deleteUserProfile} = require('../controllers/adminController')
const {AddVehicle,updateVehicle,deleteVehicle,getVehicle,getVehiclebyOwner} = require('../controllers/vehicleController')
const { getBookingById , getAllBookings, updateBookingStatus, deleteBooking} = require('../controllers/bookingController')
const { checkUser } = require('../controllers/customerController')


adminRouter.get('/check-Admin',authAdmin, checkUser )

adminRouter.delete('/delete/:id',authAdmin,deleteUserProfile) //delete profile
adminRouter.get('/getAllCustomers',authAdmin,getAllCustomer) //get all customers
adminRouter.get('/getAllHosts',authAdmin,getAllHost) //get all hosts

adminRouter.get('/getAllBookings',authAdmin,getAllBookings) //get all bookings
adminRouter.get('/getBooking/:id',authAdmin,getBookingById) //get booking by id
adminRouter.patch('/updateBookingStatus/:id',authAdmin,updateBookingStatus) //update booking by id
adminRouter.delete('/deleteBooking/:id',authAdmin,deleteBooking) //delete booking by id


adminRouter.get('/getAllReviews',authAdmin,getAllReviews) //get all reviews


adminRouter.get('/getAllPayments',authAdmin,getAllPayments) //get all payments

adminRouter.get('/getAllVehicles',authAdmin,getAllVehicles) //get all vehicles
adminRouter.post('/addVehicle',authAdmin,AddVehicle) //add vehicle
adminRouter.patch('/updateVehicle/:id',authAdmin,updateVehicle) //update vehicle  
adminRouter.delete('/deleteVehicle/:id',authAdmin,deleteVehicle) //delete vehicle
adminRouter.get('/getVehicle/:id',authAdmin,getVehicle) //get vehicle
adminRouter.get('/getVehiclebyOwner/:userid',authAdmin,getVehiclebyOwner) //get vehicle by user



module.exports = adminRouter