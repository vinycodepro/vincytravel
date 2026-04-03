import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dns from 'dns';
import dotenv from 'dotenv';
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve('uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vincyweb-travel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
//import routes
import destinationsRoutes from './routes/destinations.js';
import packagesRoutes from './routes/Package.js';
import blogRoutes from './routes/blog.js';
import commentsRoutes from './routes/comments.js';
import bookingsRoutes from './routes/bookings.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';

// Routes
app.use('/api/destinations', destinationsRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});