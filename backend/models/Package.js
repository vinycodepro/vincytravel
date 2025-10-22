const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  destinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],
  duration: {
    days: Number,
    nights: Number
  },
  price: {
    type: Number,
    required: true
  },
  inclusions: [String],
  exclusions: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String
  }],
  images: [String],
  featured: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Package', packageSchema);