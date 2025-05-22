const Vehicle = require('../models/Vehicle')

const getHostVehicle = async (req, res, next) => {
    try {
        userId = req.user.id


        const vehicle = await Vehicle.find({ ownerId: userId })
        if (!vehicle) return res.status(404).json({ message: "Vehicle Not Found" })
        res.status(200).json({ message: 'Vehicle Found', vehicle })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}
const checkHost = async (req, res, next) => {
    try {
        res.json({ message: "Host Authorised", loggedinUser: req.user.id })
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}
module.exports = {
    getHostVehicle,checkHost
}