const jwt = require('jsonwebtoken')


const createToken = (id,role)=>{
try {
        const token = jwt.sign({id,role},process.env.JWT_SECRET_KEY,{
            expiresIn: '3h'
        })
        return token
} catch (error) {
    console.log(error);
    
}
}


module.exports = createToken