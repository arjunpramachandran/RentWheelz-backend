const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['car', 'bike'],
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    images: {
        type: [String],
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'inactive'],
        default: 'available'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default:[0,0],
            required: false
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }

},
{
    timestamps:true
}
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
