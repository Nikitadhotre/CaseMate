import { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Bell,
  Mail,
  User,
  Phone,
  Calendar,
  Shield,
  Eye,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ClientDashboard() {
  const [profile, setProfile] = useState(null);
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [casesError, setCasesError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingHearings, setUpcomingHearings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
    const [activeView, setActiveView] = useState('cases');
  // Removed tabs per user request

  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const filter = searchParams.get('filter');
    setActiveFilter(filter || 'all');
    const view = searchParams.get('view');
    const newView = view === 'notifications' ? 'notifications' : 'cases';
    setActiveView(newView);
    
    // Clear notifications if viewing notifications
    if (newView === 'notifications') {
      const clearNotifications = () => {
        localStorage.setItem('caseMateNotifications', JSON.stringify({ hearings: 0, payments: 0 }));
        window.hearingCount = 0;
        window.paymentNotifications = [];
      };
      clearNotifications();
    }
  }, [searchParams]);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        setCasesLoading(true);
        setError(null);
        setCasesError(null);

        const localUserId = user?._id || user?.id;

        if (!user || !localUserId) {
          setError('No user data available. Please login.');
          return;
        }

        if (user?.role !== 'client') {
          setError('Access denied. This dashboard is for clients only.');
          return;
        }

        console.log('Using local user data:', user.role, localUserId);

        // Fetch client profile
        const profileResponse = await axios.get('http://localhost:5000/api/client/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const clientProfile = profileResponse.data?.user || profileResponse.data;
        setProfile(clientProfile);
        console.log('Client profile loaded:', clientProfile);

        const clientId = clientProfile?._id || clientProfile?.id || localUserId;
        console.log('Client ID used for cases:', clientId);

        // Fetch cases
        const casesResponse = await axios.get(
          `http://localhost:5000/api/cases/client/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        console.log('Cases response:', casesResponse.data);

        const clientCases = casesResponse.data?.cases || [];
        setCases(clientCases);
        console.log(`Loaded ${clientCases.length} cases`);

        const upcomingHearingsLocal = clientCases
          .filter(
            (caseItem) =>
              caseItem?.nextHearingDate &&
              new Date(caseItem.nextHearingDate) > new Date()
          )
          .map((caseItem) => ({
            id: caseItem._id || caseItem.id,
            type: 'hearing',
            title: caseItem.caseTitle,
            hearingDate: caseItem.nextHearingDate,
            lawyerName: caseItem.lawyerId?.name || 'Not assigned',
            caseId: caseItem._id || caseItem.id,
          }))
          .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate));

        const paymentDues = clientCases
          .filter(caseItem => caseItem.fees > 0) // Assume unpaid if fees exist
          .map(caseItem => ({
            id: `pay-${caseItem._id || caseItem.id}`,
            type: 'payment',
            title: caseItem.caseTitle,
            amount: caseItem.fees,
            lawyerName: caseItem.lawyerId?.name || 'Not assigned',
            caseId: caseItem._id || caseItem.id,
          }))
          .sort((a, b) => a.title.localeCompare(b.title));

        setUpcomingHearings(upcomingHearingsLocal);
        window.paymentNotifications = paymentDues; // Raw data always

        // Respect notification cleared state from localStorage
        const savedCounts = JSON.parse(localStorage.getItem('caseMateNotifications') || '{}');
        window.hearingCount = savedCounts.hearings !== undefined ? savedCounts.hearings : upcomingHearingsLocal.length;
        window.paymentNotifications = savedCounts.payments !== undefined ? [] : paymentDues; // Hide if cleared

        console.log(`Found ${upcomingHearingsLocal.length} upcoming hearings, ${paymentDues.length} payment dues`);
      } catch (error) {
        console.error('Dashboard initialization failed:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });

        if (error.code === 'ERR_NETWORK') {
          setError('Backend server not reachable. Please ensure backend server is running on localhost:5000');
        } else if (error.response?.status === 401) {
          setError('Session expired. Please login again.');
        } else if (error.response?.status === 403) {
          setError('Access denied. Please login with a client account.');
        } else if (error.response?.status === 404) {
          setError('API endpoint not found. Check backend routes.');
        } else {
          setError(error.response?.data?.message || `Failed to load dashboard: ${error.message}`);
        }

        setCasesError(error.response?.data?.message || 'Failed to load cases');
      } finally {
        setLoading(false);
        setCasesLoading(false);
      }
    };

    if (user) {
      initializeDashboard();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-800"></div>
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

  const filteredCases =
    activeFilter === 'all'
      ? cases
      : cases.filter((caseItem) => caseItem.caseStatus === activeFilter);

  return (
    <div className="min-h-screen">
      <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="p-6 max-w-7xl mx-auto">  

          <div className="lg:col-span-2 space-y-8">
            {activeView === 'notifications' && (
              <div className="min-h-screen pb-10 ">
                <div className="space-y-4 px-4 max-w-none sm:px-6 lg:px-8 mx-auto">
                  {/* Hearings */}
                  {upcomingHearings.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-7 h-7 text-blue-500 bg-blue-100 p-2 rounded-2xl" />
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Upcoming Hearings</h3>
                          <p className="text-slate-600">Prepare for your next court dates</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {upcomingHearings.map((hearing, index) => (
                          <motion.div
                            key={hearing.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200 hover:shadow-xl transition-all hover:-translate-y-1"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-slate-900 text-lg">{hearing.title}</h4>
                                <p className="text-slate-600">Lawyer: {hearing.lawyerName}</p>
                              </div>
                              <div className="text-right">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                  {new Date(hearing.hearingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-blue-100">
                              <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Add to Calendar
                              </button>
                              <button 
                                onClick={() => navigate(`/view-case/${hearing.caseId}`)}
                                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all"
                              >
                                View Case
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Payments */}
                  {window.paymentNotifications?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="w-7 h-7 text-orange-500 bg-orange-100 p-2 rounded-2xl" />
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Payment Due</h3>
                          <p className="text-slate-600">Outstanding fees for your cases</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {window.paymentNotifications.map((payment, index) => (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                            className="group bg-gradient-to-r from-orange-50 to-red-50 p-5 rounded-2xl border border-orange-200 hover:shadow-xl transition-all hover:-translate-y-1"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-slate-900 text-lg">{payment.title}</h4>
                                <p className="text-slate-600">Lawyer: {payment.lawyerName}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-orange-600">₹{payment.amount?.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-orange-100">
                              <button 
                                onClick={() => navigate('/payment', { 
                                  state: { 
                                    caseId: payment.caseId, 
                                    caseTitle: payment.title, 
                                    fees: payment.amount,
                                    lawyerName: payment.lawyerName 
                                  } 
                                })}
                                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-xl hover:bg-orange-700 transition-all font-semibold text-center"
                              >
                                Pay Now
                              </button>
                              <button 
                                onClick={() => navigate(`/view-case/${payment.caseId}`)}
                                className="text-sm bg-slate-600 text-white px-4 py-3 rounded-xl hover:bg-slate-700 transition-all"
                              >
                                View Case
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Empty State */}
                  {upcomingHearings.length === 0 && (!window.paymentNotifications || window.paymentNotifications.length === 0) && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20 px-8"
                    >
                      <Bell className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">No Notifications</h3>
                      <p className="text-slate-600 text-lg mb-6 max-w-md mx-auto">
                        You're all caught up! No upcoming hearings or pending payments at this time.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button 
                          onClick={() => navigate(-1)}
                          className="bg-slate-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-slate-700 transition-all shadow-lg"
                        >
                          Back to Dashboard
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
            {activeView === 'cases' && (
              casesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
                </div>
              ) : casesError ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Cases</h3>
                  <p className="text-slate-600">{casesError}</p>
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Cases Found</h3>
                  <p className="text-slate-600">You don't have any cases yet.</p>
                </div>
              ) : filteredCases.map((caseItem, index) => {
                  const mockTimeline = [
                    { date: caseItem.createdAt, event: 'Case Filed', status: 'completed' },
                    ...(caseItem.nextHearingDate
                      ? [{ date: caseItem.nextHearingDate, event: 'Next Hearing', status: 'upcoming' }]
                      : []),
                    ...((caseItem.hearingDates || []).map((date) => ({
                      date,
                      event: 'Previous Hearing',
                      status: 'completed',
                    })))
                  ].sort((a, b) => new Date(a.date) - new Date(b.date));

                  return (
                    <motion.div
                      key={caseItem._id || caseItem.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            {caseItem.caseTitle}
                          </h2>
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="text-sm">Lawyer:</span>
                            <span className="text-sm font-medium text-slate-800">
                              {caseItem.lawyerId?.name || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                              caseItem.caseStatus === 'Open'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : caseItem.caseStatus === 'In Progress'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {caseItem.caseStatus}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/view-case/${caseItem._id || caseItem.id}`)}
                            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </motion.button>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                          Case Progress
                        </h3>
                        <div className="relative">
                          <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                          <div className="space-y-4">
                            {mockTimeline.map((event, eventIndex) => (
                              <motion.div
                                key={eventIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: eventIndex * 0.1 }}
                                className="relative flex items-start gap-3"
                              >
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 ${
                                    event.status === 'completed'
                                      ? 'bg-emerald-500'
                                      : event.status === 'upcoming'
                                      ? 'bg-blue-500'
                                      : 'bg-slate-300'
                                  }`}
                                >
                                  {event.status === 'completed' ? (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  ) : event.status === 'upcoming' ? (
                                    <Clock className="w-4 h-4 text-white" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div className="flex-1 pt-0.5">
                                  <div
                                    className={`rounded-lg p-3 border ${
                                      event.status === 'upcoming'
                                        ? 'bg-blue-50 border-blue-200'
                                        : 'bg-slate-50 border-slate-200'
                                    }`}
                                  >
                                    <p className="text-sm font-medium text-slate-900">{event.event}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      {new Date(event.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>Case Information</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">Created Date</p>
                            <p className="text-sm text-slate-900 font-medium">
                              {caseItem.createdAt
                                ? new Date(caseItem.createdAt).toLocaleDateString()
                                : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">Case Type</p>
                            <p className="text-sm text-slate-900 font-medium">
                              {caseItem.caseType || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">Case Fees</p>
                            <p className="text-sm text-slate-900 font-semibold">
                              ₹{caseItem.fees?.toLocaleString() || 'N/A'}
                            </p>
                          </div>
                          <div className="flex justify-end items-end">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                navigate('/payment', {
                                  state: {
                                    caseId: caseItem._id || caseItem.id,
                                    caseTitle: caseItem.caseTitle,
                                    fees: caseItem.fees,
                                    lawyerName: caseItem.lawyerId?.name || 'Not assigned',
                                  },
                                })
                              }
                              className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Now</span>
                            </motion.button>
                          </div>
                        </div>
                        {caseItem.caseDescription && (
                          <div className="pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-500 mb-1">Description</p>
                            <p className="text-sm text-slate-700">{caseItem.caseDescription}</p>
                          </div>
                        )}
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

