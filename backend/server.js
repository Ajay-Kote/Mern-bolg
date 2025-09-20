const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://blog-write-nti8.onrender.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/users', require('./routes/users'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Debug endpoint to confirm which DB we're connected to
app.get('/api/debug/db', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const dbName = db?.databaseName;
    const collections = db ? await db.listCollections().toArray() : [];
    res.json({ dbName, collections: collections.map(c => c.name) });
  } catch (e) {
    res.status(500).json({ message: 'Unable to inspect DB', error: e.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB (supports both MONGO_URI and MONGODB_URI)
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.MONGO_DB_NAME || undefined,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
