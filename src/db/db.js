const mongoose = require('mongoose');
 

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://sinhaalka:sunday@cluster0.tl1zri9.mongodb.net/Finance');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const getDB = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('MongoDB connection not established');
  }
  return mongoose.connection.db;
};

module.exports = { connectDB, getDB };
