const mongoose = require('mongoose');

// Case Schema for legal case management
const caseSchema = new mongoose.Schema({
  caseTitle: {
    type: String,
    required: [true, 'Case title is required'],
    trim: true,
  },
  caseDescription: {
    type: String,
    required: [true, 'Case description is required'],
    trim: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required'],
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    trim: true,
  },
  clientPhone: {
    type: String,
    required: [true, 'Client phone is required'],
    trim: true,
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lawyer',
    required: [true, 'Lawyer ID is required'],
  },
  caseType: {
    type: String,
    required: [true, 'Case type is required'],
    enum: ['criminal', 'civil', 'family', 'corporate', 'property', 'cyber', 'other'],
    trim: true,
  },
  caseStatus: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  hearingDates: [{
    type: Date,
  }],
  nextHearingDate: {
    type: Date,
    required: [true, 'Next hearing date is required'],
  },
  fees: {
    type: Number,
    required: [true, 'Case fees is required'],
    min: [0, 'Fees cannot be negative'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
caseSchema.index({ lawyerId: 1, clientId: 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ caseType: 1 });

module.exports = mongoose.model('Case', caseSchema);
