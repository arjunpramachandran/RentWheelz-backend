const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Booking', required: true 
    },
  userId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User', required: true 
    },
  hostId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User', required: true 
    },
  amount: {
     type: Number, required: true 
    },
  paymentMethod: {
     type: String, enum: ['card', 'upi', 'wallet'], 
     required: true 
    },
  status: {
     type: String, enum: ['success', 'failed', 'refunded'],
      default: 'success' 
    },
  transactionId: {
     type: String, 
     required: true 
    },
  
},
{
    timestamps:true
}
);

module.exports = mongoose.model('Payment', paymentSchema);
