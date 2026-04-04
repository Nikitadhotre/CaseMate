import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ArrowLeft, Calendar, User, FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ViewCaseDetails() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    fetchCaseDetails();
  }, [caseId]);

  const fetchCaseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/cases/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCaseData(response.data.case);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch case details');
      console.error('Error fetching case:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Case</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const allHearingDates = [
    ...(caseData.hearingDates || []).map(date => ({ date, type: 'past' })),
    caseData.nextHearingDate ? { date: caseData.nextHearingDate, type: 'next' } : null
  ].filter(Boolean).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(user.role === 'lawyer' ? '/lawyer-dashboard' : '/client-dashboard')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div>

            <p className="text-slate-600">Complete information about this case</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Case Information */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">{caseData.caseTitle}</h2>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    caseData.caseStatus === 'Open' ? 'bg-green-100 text-green-800' :
                    caseData.caseStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {caseData.caseStatus}
                  </span>
                </div>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {caseData.caseType}
                </span>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Case Description</h3>
                <p className="text-slate-700 leading-relaxed">{caseData.caseDescription}</p>
              </div>
            </motion.div>

            {/* Hearing Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                <Calendar className="w-6 h-6" />
                <span>Hearing Timeline</span>
              </h3>

              {allHearingDates.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No hearing dates scheduled</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                  <div className="space-y-6">
                    {allHearingDates.map((hearing, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative flex items-start space-x-4"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                            hearing.type === 'next' ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                        >
                          {hearing.type === 'next' ? (
                            <Clock className="w-6 h-6 text-white" />
                          ) : (
                            <CheckCircle className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div
                            className={`bg-slate-50 rounded-lg p-4 ${
                              hearing.type === 'next' ? 'ring-2 ring-blue-500' : ''
                            }`}
                          >
                            <p className="font-semibold text-slate-900">
                              {hearing.type === 'next' ? 'Next Hearing' : 'Previous Hearing'}
                            </p>
                            <p className="text-sm text-slate-600">
                              {new Date(hearing.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-8">
            {/* Client Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Client Information</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="text-slate-900 font-medium">{caseData.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-slate-900">{caseData.clientEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-slate-900">{caseData.clientPhone}</p>
                </div>
              </div>
            </motion.div>

            {/* Lawyer Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Lawyer Information</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="text-slate-900 font-medium">{caseData.lawyerId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-slate-900">{caseData.lawyerId?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-slate-900">{caseData.lawyerId?.phone || 'N/A'}</p>
                </div>
                {caseData.lawyerId?.specialization && (
                  <div>
                    <p className="text-sm text-slate-500">Specialization</p>
                    <p className="text-slate-900">{caseData.lawyerId.specialization}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Case Metadata */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Case Information</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Created Date</p>
                  <p className="text-slate-900 font-medium">
                    {new Date(caseData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {caseData.lastUpdated && (
                  <div>
                    <p className="text-sm text-slate-500">Last Updated</p>
                    <p className="text-slate-900 font-medium">
                      {new Date(caseData.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">Case ID</p>
                  <p className="text-slate-900 font-mono text-sm">{caseData._id}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
