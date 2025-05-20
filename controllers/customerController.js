const User = require('../models/User')
const bcrypt = require('bcrypt')
const createToken = require('../utils/generateToken')


//REGISTER

const register = async (req,res,next)=>{
    try {
        const {name,email,password,phone,role,licenseNumber,addressProof,profilepic} = req.body || {}
        
        if(!name || !email || !password || !phone || (role === "customer" && !licenseNumber) ||  (role !== 'admin' && !addressProof) ){
            return res.status(400).json({error:"All Fields are Required"})
        }
        const userExistsEmail = await User.findOne({email})
        if(userExistsEmail) return res.status(400).json({error:'User Already Exists with same email ID'})
        
        const userExistsPhone = await User.findOne({phone})
        if(userExistsPhone) return res.status(400).json({error:'User Already Exists with Same PhoneNumber'})
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        

        const newUser = new User({name,email,password:hashedPassword,phone,role,licenseNumber,addressProof,profilepic})

        const savedUser = await newUser.save()

        const userData = savedUser.toObject()
        delete userData.password
        res.status(201).json({message:'Account Created ',userData})
  



        
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
    }
}


// LOGIN 


const login = async (req,res,next)=>{
    try {
        const {email,password} = req.body || {}
        
        if(!email || !password){
            return res.status(400).json({error:"All Fields are Required"})
        }
        const userExists = await User.findOne({email})
        if(!userExists) return res.status(400).json({error:'Customer Not Found'})
        
        const passwordMatch = await bcrypt.compare(password,userExists.password)
        if(!passwordMatch) return res.status(400).json({error:"Invalid Password"})
        
        const token = createToken(userExists._id,userExists.role)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'production',
            sameSite: 'strict',
            //maxAge: 3 * 24 * 60 * 60 * 1000 
        });
        
        const userObject = userExists.toObject()
        delete userObject.password

        return res.status(200).json({message:"Login succesfull",userObject})

        
        
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
    }
}

const profile = async(req,res,next)=>{
    try {

            const userId = req.user.id
            const userData = await User.findById(userId).select('-password')
            if(!userData) return res.status(400).json({error:'Customer Not Found'})
            const userObject = userData.toObject()
            delete userObject.password
            return res.status(200).json({message:"Profile Retrieved",userObject})



       
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
    }
}

const logout = async (req,res,next)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({message:"Logout Successfull"})
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
        
    }    
}

const updateProfile = async (req,res,next)=>{
    try {
        const userId = req.user.id
       
        
        const {name,email,phone,licenseNumber,addressProof,profilepic} = req.body || {}
        
        
        
      if(email) 
        { 
            userExistsEmail = await User.findOne({email})
            if(userExistsEmail) return res.status(400).json({error:'User Already Exists with same email ID'})
        }
        
        if(phone)
        {
            const userExistsPhone = await User.findOne({phone})
            if(userExistsPhone) return res.status(400).json({error:'User Already Exists with Same PhoneNumber'})
        }
        
            // Password Update
        // const salt = await bcrypt.genSalt(10)
        // const hashedPassword = await bcrypt.hash(password,salt)
        

        const updatedUser = await User.findByIdAndUpdate(userId,{name,email,phone,licenseNumber,addressProof,profilepic},{new:true}).select('-password')    
         

        if(!updatedUser) return res.status(400).json({error:'Customer Not Found'})
        res.status(201).json({message:'Profile Updated ',updatedUser})}
    catch (error) {
        console.log(error);
        res.status(error.status || 500).json({error:error.message || "Internal Server Message"})
    }
}


module.exports = {register,login,profile,logout,updateProfile}