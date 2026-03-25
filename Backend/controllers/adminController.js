const Admin = require('../models/adminModel');
const Lawyer = require('../models/lawyerModel');
const Client = require('../models/clientModel');

// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboard = async (req, res) => {
  try {
    const totalLawyers = await Lawyer.countDocuments();
    const totalClients = await Client.countDocuments();
    const totalAdmins = await Admin.countDocuments();

    const data = {
      totalUsers: totalLawyers + totalClients + totalAdmins,
      totalLawyers,
      totalClients,
      totalAdmins,
    };

    res.status(200).json({
      success: true,
      message: 'Welcome Admin – Access Granted',
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getProfile = async (req, res) => {
  try {
    const user = await Admin.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'admin',
        verified: user.verified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get system overview for admin
// @route   GET /api/admin/overview
// @access  Private/Admin
const getSystemOverview = async (req, res) => {
  try {
    const totalLawyers = await Lawyer.countDocuments();
    const totalClients = await Client.countDocuments();
    const pendingVerifications = await Lawyer.countDocuments({ verified: false });

    res.status(200).json({
      success: true,
      message: 'System overview retrieved successfully',
      data: {
        totalLawyers,
        totalClients,
        activeCases: 0, // Mock data - would need case model
        pendingVerifications,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all clients
// @route   GET /api/admin/clients
// @access  Private/Admin
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully',
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all lawyers
// @route   GET /api/admin/lawyers
// @access  Private/Admin
const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Lawyers retrieved successfully',
      data: lawyers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'email',
      'phone',
      'profilePicture'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await Admin.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'admin',
        verified: user.verified,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  getSystemOverview,
  getAllClients,
  getAllLawyers,
  updateProfile,
};
