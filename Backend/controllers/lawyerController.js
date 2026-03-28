const Lawyer = require('../models/lawyerModel');
const Case = require('../models/caseModel');
const mongoose = require('mongoose');

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

// @desc    Get lawyer clients (unique from cases)
// @route   GET /api/lawyer/clients
// @access  Private/Lawyer
const getClients = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    
    const clients = await Case.aggregate([
      { $match: { lawyerId: mongoose.Types.ObjectId(lawyerId) } },
      {
        $group: {
          _id: '$clientId',
          name: { $first: '$clientName' },
          email: { $first: '$clientEmail' },
          phone: { $first: '$clientPhone' },
          cases: { $sum: 1 },
          latestCase: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: '$_id',
          name: { $ifNull: ['$name', '$client.name'] },
          email: { $ifNull: ['$email', '$client.email'] },
          phone: { $ifNull: ['$phone', '$client.phone'] },
          cases: 1,
          clientId: { $ifNull: ['$_id', '$client._id'] }
        }
      },
      { $sort: { latestCase: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully',
      clients
    });
  } catch (error) {
    console.error('Error fetching lawyer clients:', error);
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
  getClients,
};
