const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');
const Lawyer = require('../models/lawyerModel');
const Client = require('../models/clientModel');
const { sendWelcomeEmail } = require('../utils/emailService');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Validation
  if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  let Model;
  if (role === 'admin') {
    Model = Admin;
  } else if (role === 'lawyer') {
    Model = Lawyer;
  } else if (role === 'client') {
    Model = Client;
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid role',
    });
  }

  // Check if user exists
  const userExists = await Model.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }

  // Create user
  const user = await Model.create({
    name,
    email,
    password,
    phone,
  });

  if (user) {
    // Send welcome email
    try {
      await sendWelcomeEmail(email, name, role);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id, role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: role,
        verified: user.verified,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user data',
    });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password, role } = req.body;

  // Validation
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email, password, and role',
    });
  }

  let Model;
  if (role === 'admin') {
    Model = Admin;
  } else if (role === 'lawyer') {
    Model = Lawyer;
  } else if (role === 'client') {
    Model = Client;
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid role',
    });
  }

  // Check for user
  const user = await Model.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      token: generateToken(user._id, role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: role,
        verified: user.verified,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }
};

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = {
  register,
  login,
};
