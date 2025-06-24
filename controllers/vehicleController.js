const Vehicle = require('../models/Vehicle')
const { cloudinaryInstance } = require('../config/cloudinary')




const AddVehicle = async (req, res, next) => {
    try {
        const userId = req.user.id
        const role = req.user.role
        const { type, brand, model, fuel, transmission, registrationNumber, location,discription, driverAvailable, rateOfDriver, isApproved, status } = req.body || {}
        const year = parseInt(req.body.year, 10);
        const pricePerDay = parseInt(req.body.pricePerDay, 10);

        const images = req.files || {}
        console.log(' Vehicle Data:', req.body);
        if (isApproved || status) {
            if (role !== 'admin') return res.status(401).json({ error: "User not authorised As Admin" })
        }






        if (!type || !brand || !model || !year || !fuel || !transmission || !registrationNumber || !pricePerDay || !location) {
            console.log(type, brand, model, year, registrationNumber, pricePerDay);
            return res.status(400).json({ error: "All Fields are Required" })
        }
        console.log(location);



        vehicleExists = await Vehicle.findOne({ registrationNumber })
        if (vehicleExists) return res.status(400).json({ error: 'Vehicle Already Exists' })


        let uploadedImages = []
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const uploadImage = await cloudinaryInstance.uploader.upload(images[i].path)
                uploadedImages.push(uploadImage.url)
            }
        } else {
            return res.status(400).json({ error: "Images are Required" })
        }
        const newVehicle = new Vehicle({
            ownerId: userId,
            type,
            brand,
            model,
            year,
            fuel,
            transmission,
            registrationNumber,
            images: uploadedImages,
            pricePerDay,
            isApproved,
            discription,
            status,
            location,
            driverAvailable,
            rateOfDriver

        })
        const savedVehicle = await newVehicle.save()
        res.status(201).json({ message: 'Vehicle Added Successfully', vehicle: savedVehicle })


    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}

const updateVehicle = async (req, res, next) => {
    try {
        userId = req.user.id
        const { id } = req.params
        const role = req.user.role
        console.log(id,req.user);

        const {
            type,
            brand,
            model,
            year,
            pricePerDay,
            isApproved,
            status,
            location,
            discription,
            fuel,
            transmission,
            driverAvailable,
            rateOfDriver
        } = req.body || {};

        const files = req.files || [];

      
        let uploadedImages = [];
        if (files.length > 0) {
            for (let file of files) {
                const uploaded = await cloudinaryInstance.uploader.upload(file.path);
                uploadedImages.push(uploaded.url);
            }
        }
        const updateFields = {
            ownerId: userId,
            type,
            brand,
            model,
            year,
            fuel,
            transmission,
            pricePerDay,
            isApproved,
            status,
            location,
            discription,
            driverAvailable,
            rateOfDriver,
        };


        if (uploadedImages.length > 0) {
            updateFields.images = uploadedImages;
        }
        const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateFields, { new: true })
        res.status(200).json({ message: 'Vehicle Updated Successfully', vehicle: updatedVehicle })


    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}
const deleteVehicle = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedVehicle = await Vehicle.findByIdAndDelete(id)
        if (!deletedVehicle) return res.status(404).json({ message: "Vehicle Not Found" })
        res.status(200).json({ message: 'Vehicle Deleted Successfully' })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}
const getVehicle = async (req, res, next) => {
    try {
        const { id } = req.params
        const vehicle = await Vehicle.findById(id)
        if (!vehicle) return res.status(404).json({ message: "Vehicle Not Found" })
        res.status(200).json({ message: 'Vehicle Found', vehicle })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}
const getVehiclebyOwner = async (req, res, next) => {
    try {
        const { userid } = req.params
        const vehicle = await Vehicle.find({ ownerId: userid })
        if (!vehicle) return res.status(404).json({ message: "Vehicle Not Found" })
        res.status(200).json({ message: 'Vehicle Found', vehicle })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Message" })
    }
}
module.exports = {
    AddVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
    getVehiclebyOwner

}