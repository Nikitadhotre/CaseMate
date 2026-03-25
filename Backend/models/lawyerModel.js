const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const lawyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  // Lawyer-specific fields
  specialization: {
    type: String,
    enum: ['Criminal', 'Civil', 'Family', 'Corporate', 'Tax', 'Immigration', 'Other'],
  },
  experience: {
    type: Number, // in years
    min: 0,
  },
  barLicenseNumber: {
    type: String,
  },
  certificate: {
    type: String, // URL or path to uploaded certificate
  },
  availabilityStatus: {
    type: String,
    enum: ['Online', 'Busy', 'Offline'],
    default: 'Offline',
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
lawyerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
lawyerSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: 'lawyer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Match user entered password to hashed password in database
lawyerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Lawyer', lawyerSchema);
