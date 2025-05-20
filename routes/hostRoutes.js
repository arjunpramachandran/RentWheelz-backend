const express = require('express')
const hostRouter = express.Router()
const {AddVehicle, updateVehicle, deleteVehicle} = require('../controllers/vehicleController')
const {getHostVehicle} = require('../controllers/hostController')
const {authHost} = require('../middleware/authMiddleware')



hostRouter.post('/addVehicle', authHost, AddVehicle) // add vehicle
hostRouter.patch('/updateVehicle/:id', authHost, updateVehicle) // update vehicle
hostRouter.delete('/deleteVehicle/:id', authHost, deleteVehicle) // delete vehicle
hostRouter.get('/getHostVehicle/', authHost, getHostVehicle) // get vehicle






module.exports = hostRouter