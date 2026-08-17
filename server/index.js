require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files statically

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const posRoutes = require('./routes/pos');
const statsRoutes = require('./routes/stats');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Teerop POS API is running');
});

// Global Error Handler
app.use(errorHandler);


// Sync Database and Start Server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) // Build tables automatically on cold start
  .then(() => {
    console.log('Database synced successfully');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });

module.exports = app;
