const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle', required: true
    },

    pickupLocation: {
        type: {
            type: String,
        }
    },

    address:{
        type:String
    },
    pickupDateTime: {
        type: Date,
        required: true
    },
    dropoffDateTime: {
        type: Date,
        required: true
    },
    driverRequired:{
        type:Boolean
    },
    totalBill: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    

},
{
    timestamps:true
})


module.exports = mongoose.model('Booking', bookingSchema);