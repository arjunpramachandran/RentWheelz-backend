const User = require('../models/User')
const Vehicle = require('../models/Vehicle')
const Booking = require('../models/Booking')
const Review = require('../models/Review')





const deleteUserProfile = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        if (!user) return res.status(404).json({ message: "User not found" })
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}
const getAllCustomer = async (req, res) => {
    try {
        const users = await User.find({role:"customer"}).select("-password")
        if (!users) return res.status(404).json({ message: "No users found" }) 
        res.status(200).json({ message: "Customers retrieved successfully", users })

    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
        
    }
}
const getAllHost = async (req, res) => {
    try {
        const users = await User.find({role:"host"}).select("-password")
        if (!users) return res.status(404).json({ message: "No users found" }) 
        res.status(200).json({ message: "Hosts retrieved successfully", users })

    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
        
    }
}

const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
        if (!vehicles) return res.status(404).json({ message: "No vehicles found" }) 
        res.status(200).json({ message: "Vehicles retrieved successfully", vehicles })

    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
        
    }
}
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
        if (!reviews) return res.status(404).json({ message: "No reviews found" }) 
        res.status(200).json({ message: "Reviews retrieved successfully", reviews })

    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
        
    }
}
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
        if (!payments) return res.status(404).json({ message: "No payments found" }) 
        res.status(200).json({ message: "Payments retrieved successfully", payments })

    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
        
    }
}   
module.exports = { deleteUserProfile ,getAllCustomer,getAllHost,getAllVehicles,getAllReviews,getAllPayments }
