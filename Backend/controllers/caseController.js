const Case = require('../models/caseModel');
const Lawyer = require('../models/lawyerModel');
const Client = require('../models/clientModel');

// @desc    Add a new case
// @route   POST /api/cases/add
// @access  Private/Lawyer
const addCase = async (req, res) => {
  try {
    const { caseTitle, caseDescription, caseType, clientIdentifier, lawyerId, nextHearingDate, fees } = req.body;

    // Find client by email or phone
    const client = await Client.findOne({
      $or: [
        { email: clientIdentifier },
        { phone: clientIdentifier }
      ]
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found with this email or phone number.',
      });
    }

    // Create the new case
    const newCase = await Case.create({
      caseTitle,
      caseDescription,
      caseType,
      clientId: client._id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      lawyerId,
      nextHearingDate,
      fees,
      hearingDates: [], // Initialize empty array
    });

    // Populate the case with lawyer and client details for response
    const populatedCase = await Case.findById(newCase._id)
      .populate('lawyerId', 'name email phone specialization')
      .populate('clientId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      case: populatedCase,
    });
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating case',
    });
  }
};

// @desc    Get all cases for a client
// @route   GET /api/cases/client/:clientId
// @access  Private/Client or Admin
const getClientCases = async (req, res) => {
  try {
    const { clientId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check permissions: client can only view their own cases, admin can view any
    if (userRole === 'client' && clientId !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own cases',
      });
    }

    const cases = await Case.find({ clientId })
      .populate('lawyerId', 'name email phone specialization')
      .sort({ createdAt: -1 });

    console.log('Cases found for client:', clientId, cases.length);
    console.log('User ID:', userId, 'User Role:', userRole);

    res.status(200).json({
      success: true,
      message: 'Client cases retrieved successfully',
      cases,
    });
  } catch (error) {
    console.error('Error fetching client cases:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cases',
    });
  }
};

// @desc    Get all cases for a lawyer
// @route   GET /api/cases/lawyer/:lawyerId
// @access  Private/Lawyer or Admin
const getLawyerCases = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    const cases = await Case.find({ lawyerId })
      .populate('clientId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Lawyer cases retrieved successfully',
      cases,
    });
  } catch (error) {
    console.error('Error fetching lawyer cases:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cases',
    });
  }
};

// @desc    Get all cases (Admin only)
// @route   GET /api/cases/all
// @access  Private/Admin
const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate('clientId', 'name email phone')
      .populate('lawyerId', 'name email phone specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All cases retrieved successfully',
      cases,
    });
  } catch (error) {
    console.error('Error fetching all cases:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cases',
    });
  }
};

// @desc    Update case details
// @route   PUT /api/cases/update/:caseId
// @access  Private/Lawyer (own case only) or Admin
const updateCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { caseDescription, status, nextHearingDate } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the case
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    // Check permissions: lawyer can only update their own cases, admin can update any
    if (userRole === 'lawyer' && caseData.lawyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update your own cases',
      });
    }

    // Update allowed fields
    const updateData = {};
    if (caseDescription !== undefined) updateData.caseDescription = caseDescription;
    if (status !== undefined) updateData.status = status;
    if (nextHearingDate !== undefined) updateData.nextHearingDate = nextHearingDate;

    const updatedCase = await Case.findByIdAndUpdate(caseId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('lawyerId', 'name email phone specialization')
      .populate('clientId', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Case updated successfully',
      case: updatedCase,
    });
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating case',
    });
  }
};

// @desc    Update case details (full update)
// @route   PUT /api/cases/update/:caseId
// @access  Private/Lawyer (own case only) or Admin
const updateCaseDetails = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { caseTitle, caseDescription, caseType, clientPhone, caseStatus, nextHearingDate } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the case
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    // Check permissions: lawyer can only update their own cases, admin can update any
    if (userRole === 'lawyer' && caseData.lawyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update your own cases',
      });
    }

    // Prepare update data
    const updateData = { lastUpdated: new Date() };

    if (caseTitle !== undefined) updateData.caseTitle = caseTitle;
    if (caseDescription !== undefined) updateData.caseDescription = caseDescription;
    if (caseType !== undefined) updateData.caseType = caseType;
    if (clientPhone !== undefined) updateData.clientPhone = clientPhone;
    if (caseStatus !== undefined) updateData.caseStatus = caseStatus;

    // Handle nextHearingDate change: move old date to hearingDates
    if (nextHearingDate !== undefined && caseData.nextHearingDate) {
      updateData.hearingDates = [...(caseData.hearingDates || []), caseData.nextHearingDate];
      updateData.nextHearingDate = nextHearingDate;
    } else if (nextHearingDate !== undefined) {
      updateData.nextHearingDate = nextHearingDate;
    }

    const updatedCase = await Case.findByIdAndUpdate(caseId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('lawyerId', 'name email phone specialization')
      .populate('clientId', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Case updated successfully',
      case: updatedCase,
    });
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating case',
    });
  }
};

// @desc    Update next hearing date (quick update)
// @route   PUT /api/cases/update-hearing/:caseId
// @access  Private/Lawyer (own case only) or Admin
const updateHearingDate = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { nextHearingDate } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the case
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    // Check permissions: lawyer can only update their own cases, admin can update any
    if (userRole === 'lawyer' && caseData.lawyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update your own cases',
      });
    }

    // Move current nextHearingDate to hearingDates array
    const updateData = {
      hearingDates: [...(caseData.hearingDates || []), caseData.nextHearingDate],
      nextHearingDate,
      lastUpdated: new Date(),
    };

    const updatedCase = await Case.findByIdAndUpdate(caseId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('lawyerId', 'name email phone specialization')
      .populate('clientId', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Hearing date updated successfully',
      case: updatedCase,
    });
  } catch (error) {
    console.error('Error updating hearing date:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating hearing date',
    });
  }
};

// @desc    Get case by ID
// @route   GET /api/cases/:caseId
// @access  Private/Lawyer (own case only), Client (own case only), or Admin
const getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the case
    const caseData = await Case.findById(caseId)
      .populate('lawyerId', 'name email phone specialization')
      .populate('clientId', 'name email phone');

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }

    // Check permissions
    if (userRole === 'lawyer' && caseData.lawyerId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own cases',
      });
    }

    if (userRole === 'client' && caseData.clientId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own cases',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Case retrieved successfully',
      case: caseData,
    });
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching case',
    });
  }
};

module.exports = {
  addCase,
  getClientCases,
  getLawyerCases,
  getAllCases,
  updateCase,
  updateCaseDetails,
  updateHearingDate,
  getCaseById,
};
