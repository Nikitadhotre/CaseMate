import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, CreditCard, Bell, Mail, Smartphone, User, Phone, Calendar, Shield, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ClientDashboard() {
  const [profile, setProfile] = useState(null);
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [casesError, setCasesError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingHearings, setUpcomingHearings] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch profile first
        const profileResponse = await axios.get('http://localhost:5000/api/client/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileResponse.data.user);

        // Fetch cases using the client ID from the profile (Client model id)
        const casesResponse = await axios.get(`http://localhost:5000/api/cases/client/${profileResponse.data.user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCases(casesResponse.data.cases || []);

        // Extract upcoming hearings from cases
        const upcoming = (casesResponse.data.cases || [])
          .filter(caseItem => caseItem.nextHearingDate && new Date(caseItem.nextHearingDate) > new Date())
          .map(caseItem => ({
            id: caseItem._id,
            title: caseItem.caseTitle,
            hearingDate: caseItem.nextHearingDate,
            lawyerName: caseItem.lawyerId?.name || 'Not assigned'
          }))
          .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate));

        setUpcomingHearings(upcoming);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'Failed to fetch profile');
        setCasesError(error.response?.data?.message || 'Failed to fetch cases');
      } finally {
        setLoading(false);
        setCasesLoading(false);
      }
    };

    if (user && user.id) {
      fetchData();
    } else {
      setLoading(false);
      setCasesLoading(false);
    }
  }, [user]);



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
          <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-white rounded-full p-4">
                    <User className="w-12 h-12 text-slate-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-slate-200 capitalize">{profile.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="text-slate-700">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="text-slate-700">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profile?.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {profile?.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Member Since</p>
                      <p className="text-slate-700">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">{cases.filter(c => c.caseStatus !== 'Closed').length}</div>
                      <div className="text-xs text-slate-600">Active Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900">{cases.filter(c => c.caseStatus === 'Closed').length}</div>
                      <div className="text-xs text-slate-600">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Content - Right Side */}
          <div className="lg:col-span-2 space-y-8">

            {/* Upcoming Hearings Notification */}
            {upcomingHearings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-blue-200 to-blue-400 text-slate-800 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Bell className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Upcoming Hearings</h3>
                </div>
                <div className="space-y-3">
                  {upcomingHearings.slice(0, 3).map((hearing, index) => (
                    <motion.div
                      key={hearing.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white/60 rounded-lg p-4 backdrop-blur-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-800">{hearing.title}</p>
                          <p className="text-slate-600 text-sm">Lawyer: {hearing.lawyerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-700">
                            {new Date(hearing.hearingDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(hearing.hearingDate).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {upcomingHearings.length > 3 && (
                  <p className="text-slate-600 text-sm mt-3">
                    +{upcomingHearings.length - 3} more upcoming hearings
                  </p>
                )}
              </motion.div>
            )}

        {casesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
          </div>
        ) : casesError ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Cases</h3>
            <p className="text-slate-600">{casesError}</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Cases Found</h3>
            <p className="text-slate-600">You don't have any cases yet.</p>
          </div>
        ) : (
            cases.map((caseItem, index) => {
              // Create mock timeline data for real cases
              const mockTimeline = [
                { date: caseItem.createdAt, event: 'Case Filed', status: 'completed' },
                ...(caseItem.nextHearingDate ? [{ date: caseItem.nextHearingDate, event: 'Next Hearing', status: 'upcoming' }] : []),
                ...(caseItem.hearingDates || []).map(date => ({ date, event: 'Previous Hearing', status: 'completed' })),
              ].sort((a, b) => new Date(a.date) - new Date(b.date));

              return (
                <motion.div
                  key={caseItem._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">{caseItem.caseTitle}</h2>
                      <p className="text-slate-600">Lawyer: {caseItem.lawyerId?.name || 'N/A'}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        caseItem.caseStatus === 'Open' ? 'bg-green-100 text-green-700' :
                        caseItem.caseStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {caseItem.caseStatus}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/view-case/${caseItem._id}`)}
                        className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Case Progress Timeline</h3>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                      <div className="space-y-6">
                        {mockTimeline.map((event, eventIndex) => (
                          <motion.div
                            key={eventIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: eventIndex * 0.1 }}
                            className="relative flex items-start space-x-4"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                                event.status === 'completed'
                                  ? 'bg-green-500'
                                  : event.status === 'upcoming'
                                  ? 'bg-blue-500'
                                  : 'bg-slate-300'
                              }`}
                            >
                              {event.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                              ) : event.status === 'upcoming' ? (
                                <Clock className="w-5 h-5 text-white" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div
                                className={`bg-slate-50 rounded-lg p-4 ${
                                  event.status === 'upcoming' ? 'ring-2 ring-blue-500' : ''
                                }`}
                              >
                                <p className="font-semibold text-slate-900">{event.event}</p>
                                <p className="text-sm text-slate-600">
                                  {new Date(event.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Case Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-600 mb-1">Created Date</p>
                        <p className="text-slate-900 font-medium">
                          {new Date(caseItem.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Case Type</p>
                        <p className="text-slate-900 font-medium">{caseItem.caseType}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Case Fees</p>
                        <p className="text-slate-900 font-medium">₹{caseItem.fees?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/payment', {
                            state: {
                              caseId: caseItem._id,
                              caseTitle: caseItem.caseTitle,
                              fees: caseItem.fees,
                              lawyerName: caseItem.lawyerId?.name || 'Not assigned'
                            }
                          })}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Fees</span>
                        </motion.button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-slate-600 mb-1">Description</p>
                      <p className="text-slate-900">{caseItem.caseDescription}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
