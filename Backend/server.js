const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const sendHearingReminders = require('./send-hearing-reminders');

// Load env vars
dotenv.config();

// Load all models to ensure they are registered
require('./models/clientModel');
require('./models/lawyerModel');
require('./models/adminModel');
require('./models/caseModel');
require('./models/reviewModel');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow frontend origins
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/lawyer', require('./routes/lawyerRoutes'));
app.use('/api/client', require('./routes/clientRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('CaseMate API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Schedule hearing reminders to run every minute for testing (change back to '0 9 * * *' for production)
  cron.schedule('* * * * *', () => {
    console.log('Running scheduled hearing reminders...');
    sendHearingReminders();
  });

  console.log('Hearing reminder cron job scheduled for every minute (testing mode)');
});
