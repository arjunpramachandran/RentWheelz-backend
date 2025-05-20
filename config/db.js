const mongoose = require('mongoose')

const connectDB = async()=>{
    const dburl = process.env.MONGODB_URL
       
    try {
        
        await mongoose.connect(dburl)
        console.log('DB Connected Successfulluy');
        
        
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = connectDB