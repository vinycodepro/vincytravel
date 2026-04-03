import mongoose from 'mongoose';
const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  bestTimeToVisit: String,
  activities: [String],
  priceRange: {
    type: String,
    enum: ['Budget', 'Moderate', 'Luxury']
  },
  featured: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;