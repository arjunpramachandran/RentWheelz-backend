const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    email: {
        type: String,
        required: [true, 'Name is Required'],
        unique: [true, 'email already exist']
    },
    password: {
        type: String,
        required: [true, 'Password Required'],
        minLength: [8, "password must contain 8 charecters"],
        maxLength: [128, "password must lessthan 128 charecters"]
    },
    phone: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'host', 'admin'],
       default: 'customer'
    },

    licenseNumber: {
        type: String,
    },
    addressProofId: {
        type: String,
    },
    profilepic: {
        type: String,
        
    },
    licenseProof: {
        type: String
    },

    addressProof: {
        type: String
    },

},
    {
        timestamps: true
    })
userSchema.pre('validate', function (next) {
    if (this.role === 'customer' && !this.licenseNumber) {
        this.invalidate('licenseNumber', 'License number is required for customers');
    }

    // if (this.role !== 'admin' && !this.addressProof) {
    //     this.invalidate('addressProof', 'Address proof is required for non-admin users');
    // }

    next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;