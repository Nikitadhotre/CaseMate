import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ArrowLeft, Save, AlertCircle, Calendar, FileText, Clock, CheckCircle, Clock3 } from 'lucide-react';

export default function UpdateCase() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [caseData, setCaseData] = useState(null);

  const [formData, setFormData] = useState({
    caseTitle: '',
    caseDescription: '',
    caseType: '',
    clientPhone: '',
    caseStatus: '',
    nextHearingDate: '',
  });

  // Status colors matching dashboard
  const statusColors = {
    Open: 'bg-green-100 text-green-800 border-green-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    Closed: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  useEffect(() => {
    fetchCaseDetails();
  }, [caseId]);

  const fetchCaseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/cases/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const caseInfo = response.data.case;
      setCaseData(caseInfo);
      setFormData({
        caseTitle: caseInfo.caseTitle || '',
        caseDescription: caseInfo.caseDescription || '',
        caseType: caseInfo.caseType || '',
        clientPhone: caseInfo.clientPhone || '',
        caseStatus: caseInfo.caseStatus || '',
        nextHearingDate: caseInfo.nextHearingDate ? new Date(caseInfo.nextHearingDate).toISOString().split('T')[0] : '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch case details');
      console.error('Error fetching case:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        ...formData,
        nextHearingDate: formData.nextHearingDate ? new Date(formData.nextHearingDate) : undefined,
      };

      await axios.put(`http://localhost:5000/api/cases/update/${caseId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/lawyer-dashboard');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update case');
      console.error('Error updating case:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center border border-red-100"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Case</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <motion.button
            onClick={fetchCaseDetails}
            whileHover={{ scale: 1.02 }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gradient Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8" />
                <div>
                  <h1 className="text-3xl font-bold">Update Case Details</h1>
                  <p className="text-blue-100">Case ID: <span className="font-mono bg-white/20 px-2 py-1 rounded text-sm">{caseId}</span></p>
                </div>
              </div>
              {caseData && (
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[caseData.caseStatus] || 'bg-gray-100 text-gray-800'}`}>
                    {caseData.caseStatus || 'Unknown'}
                  </span>
                  {caseData.nextHearingDate && (
                    <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(caseData.nextHearingDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <motion.button
              onClick={() => navigate('/lawyer-dashboard')}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100"
        >
          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Case Updated Successfully!</h2>
              <p className="text-slate-600 mb-6">Redirecting to dashboard...</p>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Case Title *
                  </label>
                  <input
                    type="text"
                    value={formData.caseTitle}
                    onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                    placeholder="Enter case title"
                    required
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Case Type *
                  </label>
                  <select
                    value={formData.caseType}
                    onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                    required
                  >
                    <option value="">Select Case Type</option>
                    <option value="civil">Civil</option>
                    <option value="criminal">Criminal</option>
                    <option value="corporate">Corporate</option>
                    <option value="family">Family</option>
                    <option value="property">Property</option>
                    <option value="cyber">Cyber</option>
                    <option value="other">Other</option>
                  </select>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Client Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                    placeholder="Enter client phone number"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Case Status *
                  </label>
                  <select
                    value={formData.caseStatus}
                    onChange={(e) => setFormData({ ...formData, caseStatus: e.target.value })}
                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Next Hearing Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={formData.nextHearingDate}
                    onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                  />
                </div>
                <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                  <Clock3 className="w-3 h-3" />
                  Select future dates only
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Case Description *
                </label>
                <textarea
                  value={formData.caseDescription}
                  onChange={(e) => setFormData({ ...formData, caseDescription: e.target.value })}
                  rows="6"
                  className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-vertical bg-slate-50/50 hover:bg-slate-50"
                  placeholder="Provide detailed description of the case..."
                  required
                />
              </motion.div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                >
                  <AlertCircle className="w-5 h-5 inline ml-1 mb-2" />
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Updating Case...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Update Case</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => navigate('/lawyer-dashboard')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 border-2 border-slate-200 text-slate-700 py-4 px-8 rounded-xl font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                >
                  Cancel
                </motion.button>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
