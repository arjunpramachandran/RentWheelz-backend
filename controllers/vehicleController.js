const Vehicle = require('../models/Vehicle')




const AddVehicle = async (req,res,next)=>{
    try {
        const userId = req.user.id
        const role = req.user.role
        const {type,brand,model,year,registrationNumber,images,pricePerDay,isApproved,status,location} = req.body || {}
        if(isApproved || status){
            if(role !== 'admin') return res.status(401).json({error:"User not authorised"})
        }
        if(!type || !brand || !model || !year || !registrationNumber ||  !pricePerDay || !location || !images){
            return res.status(400).json({error:"All Fields are Required"})
        }
        vehicleExists = await Vehicle.findOne({registrationNumber})
        if(vehicleExists) return res.status(400).json({error:'Vehicle Already Exists'})

        const newVehicle = new Vehicle({
            ownerId: userId,
            type,
            brand,
            model,
            year,
            registrationNumber,
            images,
            pricePerDay,
            isApproved,
            status,
            location
            //  location:{
            //     type: 'Point',
            //     // coordinates: [location.longitude, location.latitude]  for geojson
            //     coordinates: [Number] 
            // }
        })
        const savedVehicle = await newVehicle.save()
        res.status(201).json({message:'Vehicle Added Successfully',vehicle:savedVehicle})   

        
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
    }
}

const updateVehicle = async (req,res,next)=>{
    try {
        const {id} = req.params
        const role = req.user.role
        const {type,brand,model,year,registrationNumber,images,pricePerDay,isApproved,status,location} = req.body || {}
        if(isApproved || status){
            if(role !== 'admin') return res.status(401).json({error:"User not authorised"})
        }
       
        
        const updatedVehicle = await Vehicle.findByIdAndUpdate(id,{
            type,
            brand,
            model,
            year,
            registrationNumber,
            images,
            pricePerDay,
            isApproved,
            status,
            location
            // location: {                                    for geojson
            //     type: 'Point',
            //     coordinates: [location.longitude, location.latitude]
            // }
        },{new:true})
        res.status(200).json({message:'Vehicle Updated Successfully',vehicle:updatedVehicle})   

        
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
    }
}
const deleteVehicle = async (req,res,next)=>{
    try {
        const {id} = req.params
        const deletedVehicle = await Vehicle.findByIdAndDelete(id)
        if(!deletedVehicle) return res.status(404).json({message:"Vehicle Not Found"})
        res.status(200).json({message:'Vehicle Deleted Successfully'})   
        
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
    }
}
const getVehicle = async (req,res,next)=>{
    try {
        const {id} = req.params
        const vehicle = await Vehicle.findById(id)
        if(!vehicle) return res.status(404).json({message:"Vehicle Not Found"}) 
        res.status(200).json({message:'Vehicle Found',vehicle})
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
    }
}
const getVehiclebyOwner = async (req,res,next)=>{
    try {
        const {userid} = req.params
        const vehicle = await Vehicle.find({ownerId:userid})
        if(!vehicle) return res.status(404).json({message:"Vehicle Not Found"}) 
        res.status(200).json({message:'Vehicle Found',vehicle})
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
    }
}
module.exports = {
    AddVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
    getVehiclebyOwner
    
}