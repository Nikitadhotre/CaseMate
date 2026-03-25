const Lawyer = require('../models/lawyerModel');

// @desc    Get lawyer profile
// @route   GET /api/lawyer/profile
// @access  Private/Lawyer
const getProfile = async (req, res) => {
  try {
    const user = await Lawyer.findById(req.user.id).select('-password');

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
        role: 'lawyer',
        verified: user.verified,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        city: user.city,
        profilePicture: user.profilePicture,
        specialization: user.specialization,
        experience: user.experience,
        barLicenseNumber: user.barLicenseNumber,
        certificate: user.certificate,
        availabilityStatus: user.availabilityStatus,
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

// @desc    Get lawyer cases
// @route   GET /api/lawyer/cases
// @access  Private/Lawyer
const getCases = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome Lawyer – Access Granted',
    data: {
      activeCases: 0,
      completedCases: 0,
      pendingCases: 0,
    },
  });
};

// @desc    Update lawyer profile
// @route   PUT /api/lawyer/profile
// @access  Private/Lawyer
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
      'profilePicture',
      'specialization',
      'experience',
      'availabilityStatus'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await Lawyer.findByIdAndUpdate(
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
        role: 'lawyer',
        verified: user.verified,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        city: user.city,
        profilePicture: user.profilePicture,
        specialization: user.specialization,
        experience: user.experience,
        barLicenseNumber: user.barLicenseNumber,
        certificate: user.certificate,
        availabilityStatus: user.availabilityStatus,
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
  getProfile,
  getCases,
  updateProfile,
};
