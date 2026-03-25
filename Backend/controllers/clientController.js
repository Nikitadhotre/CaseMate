const Client = require('../models/clientModel');
const Lawyer = require('../models/lawyerModel');

// @desc    Get lawyer by ID
// @route   GET /api/client/lawyers/:id
// @access  Public
const getLawyerById = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id).select('-password');

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lawyer retrieved successfully',
      lawyer: {
        id: lawyer._id,
        name: lawyer.name,
        email: lawyer.email,
        phone: lawyer.phone,
        role: 'lawyer',
        verified: lawyer.verified,
        dateOfBirth: lawyer.dateOfBirth,
        gender: lawyer.gender,
        address: lawyer.address,
        city: lawyer.city,
        profilePicture: lawyer.profilePicture,
        specialization: lawyer.specialization,
        experience: lawyer.experience,
        barLicenseNumber: lawyer.barLicenseNumber,
        certificate: lawyer.certificate,
        availabilityStatus: lawyer.availabilityStatus,
        rating: lawyer.rating,
        reviews: lawyer.reviews,
        createdAt: lawyer.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get client profile
// @route   GET /api/client/profile
// @access  Private/Client
const getProfile = async (req, res) => {
  try {
    const user = await Client.findById(req.user.id).select('-password');

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
        role: 'client',
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

// @desc    Update client profile
// @route   PUT /api/client/profile
// @access  Private/Client
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'email',
      'phone',
      'dateOfBirth',
      'gender',
      'address',
      'city',
      'profilePicture'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await Client.findByIdAndUpdate(
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
        role: 'client',
        verified: user.verified,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        city: user.city,
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

// @desc    Get all lawyers
// @route   GET /api/client/lawyers
// @access  Public
const getLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find().select('-password -verified -dateOfBirth -gender -address -city -profilePicture -barLicenseNumber -certificate -availabilityStatus -createdAt -updatedAt');

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

module.exports = {
  getProfile,
  updateProfile,
  getLawyers,
  getLawyerById,
};
