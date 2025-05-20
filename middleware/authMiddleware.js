const jwt = require('jsonwebtoken')

// for all users
const authUser = (req,res,next)=>{                              
    try {
        const {token}= req.cookies


        if(!token) return res.status(401).json({message:"User not authorised"})

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decodedToken) return res.status(401).json({message:"invalid Token"})
        
        
        req.user = decodedToken
        


        next()
        


        
    } catch (error) {
        console.log(error);
        
    }
}
// for admin
const authAdmin = (req,res,next)=>{
    try {
        const {token}= req.cookies


        if(!token) return res.status(401).json({message:"User not authorised"})

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decodedToken) return res.status(401).json({message:"invalid Token"})
            
            
        if(decodedToken.role !== "admin") return res.status(401).json({message:"User not authorised as admin"})
        req.user = decodedToken
        


        next()
        


        
    } catch (error) {
        console.log(error);
        
    }
}



// for host
const authHost = (req,res,next)=>{
    try {
        const {token}= req.cookies


        if(!token) return res.status(401).json({message:"User not authorised"})

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decodedToken) return res.status(401).json({message:"invalid Token"})
            
            
        if(decodedToken.role !== "host") return res.status(401).json({message:"User not authorised as host"})
        req.user = decodedToken
        


        next()
        


        
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = {authUser,authAdmin,authHost}