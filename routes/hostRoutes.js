const express = require('express')
const hostRouter = express.Router()
const {AddVehicle, updateVehicle, deleteVehicle} = require('../controllers/vehicleController')
const {getHostVehicle,getHostStats} = require('../controllers/hostController')
const {authHost} = require('../middleware/authMiddleware')
const upload = require('../middleware/multer')
const { getBookingByOwner } = require('../controllers/bookingController')
const { checkUser } = require('../controllers/customerController')



hostRouter.post('/addVehicle', authHost,upload.array('images'), AddVehicle) // add vehicle
hostRouter.patch('/updateVehicle/:id', authHost,upload.array('images'), updateVehicle) // update vehicle
hostRouter.delete('/deleteVehicle/:id', authHost, deleteVehicle) // delete vehicle
hostRouter.get('/getHostVehicle', authHost, getHostVehicle) // get vehicle
hostRouter.get('/check-Host',authHost, checkUser)
hostRouter.get('/hostDashboard' , authHost ,getHostStats )

hostRouter.get('/getBookingByOwner', authHost, getBookingByOwner) // get booking by owner id





module.exports = hostRouter