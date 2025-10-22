const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    address: String
  },
  travelers: {
    adults: {
      type: Number,
      default: 1
    },
    children: {
      type: Number,
      default: 0
    }
  },
  travelDate: {
    type: Date,
    required: true
  },
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);