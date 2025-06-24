const express = require('express')
const customerRouter = express.Router()
const {register,login,checkUser, profile,logout,updateProfile,addReview,getAllReviews, deleteMyReview,UpdatePassword} = require('../controllers/customerController')
const {authUser} = require('../middleware/authMiddleware')
const { getAllVehicles } = require('../controllers/adminController')
const { getVehicle } = require('../controllers/vehicleController')
const upload = require('../middleware/multer')
const { createBooking, getBooking, deleteMyBooking } = require('../controllers/bookingController')
const { createCheckoutSession } = require('../controllers/paymentController')




customerRouter.post('/register',upload.fields([{name:'profilepic'},{name:'licenseProof'},{name:'addressProof'}]), register)   //   register/signUp
customerRouter.post('/login',login)         //  login

customerRouter.get('/getAllVehicles',getAllVehicles) //get all vehicles
customerRouter.get('/getVehicle/:id',getVehicle) //get vehicle by id


customerRouter.get('/profile',authUser,profile) //profile
customerRouter.get('/logout',authUser,logout) //logout

customerRouter.get('/checkUser' , authUser ,checkUser)

customerRouter.patch('/update',authUser,upload.fields([{name:'profilepic'},{name:'licenseProof'},{name:'addressProof'}]),updateProfile) //update profile
customerRouter.patch('/updatePassword',authUser,UpdatePassword) //update password


customerRouter.post('/review',authUser, addReview)
customerRouter.get('/getAllReviews',getAllReviews) //get all reviews
customerRouter.delete('/deleteMyReview/:id',authUser, deleteMyReview) //delete my review


customerRouter.post('/createBooking/:vehicleId', authUser,createBooking) //create booking
customerRouter.get('/getBooking', authUser, getBooking ) //get booking by user id
customerRouter.delete('/deleteMyBooking/:id', authUser,deleteMyBooking) //delete booking by id



customerRouter.post('/create-checkout-session' , authUser,createCheckoutSession)





module.exports = customerRouter