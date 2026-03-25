import { useState, useEffect } from 'react';
import { Plus, Calendar, FileText, Bell, Clock, AlertCircle, LogOut, User, Edit, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UpdateHearingModal from '../components/UpdateHearingModal';

export default function LawyerDashboard() {
  const [showAddCase, setShowAddCase] = useState(false);
  const [showHearingModal, setShowHearingModal] = useState(false);
  const [selectedCaseForHearing, setSelectedCaseForHearing] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    caseTitle: '',
    caseDescription: '',
    caseType: '',
    clientIdentifier: '',
    nextHearingDate: '',
    fees: '',
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/cases/lawyer/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(response.data.cases || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch cases');
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateHearing = (caseItem) => {
    setSelectedCaseForHearing(caseItem);
    setShowHearingModal(true);
  };

  const handleHearingUpdate = (updatedCase) => {
    setCases(cases.map(c => c._id === updatedCase._id ? updatedCase : c));
  };

  const upcomingHearings = cases
    .filter(caseItem => caseItem.nextHearingDate && new Date(caseItem.nextHearingDate) > new Date())
    .map(caseItem => ({
      id: caseItem._id,
      title: caseItem.caseTitle,
      hearingDate: caseItem.nextHearingDate,
      clientName: caseItem.clientName || 'Unknown'
    }))
    .sort((a, b) => new Date(a.hearingDate) - new Date(b.hearingDate));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/cases/add', {
        ...formData,
        lawyerId: user.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCases([...cases, response.data.case]);
      setFormData({ caseTitle: '', caseDescription: '', caseType: '', clientIdentifier: '', nextHearingDate: '', fees: '' });
      setShowAddCase(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add case');
      console.error('Error adding case:', error);
    } finally {
      setSubmitting(false);
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
          <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Lawyer Dashboard</h1>
            <p className="text-slate-600">Manage your cases and hearings</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddCase(!showAddCase)}
              className="bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Case</span>
            </motion.button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Upcoming Hearings Notification */}
        {upcomingHearings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-200 to-blue-400 text-slate-800 rounded-2xl p-6 shadow-lg mb-8"
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
                      <p className="text-slate-600 text-sm">Client: {hearing.clientName}</p>
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

        <AnimatePresence>
          {showAddCase && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Case</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Case Title
                    </label>
                    <input
                      type="text"
                      value={formData.caseTitle}
                      onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                      placeholder="Enter case title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Case Type
                    </label>
                    <select
                      value={formData.caseType}
                      onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="civil">Civil</option>
                      <option value="criminal">Criminal</option>
                      <option value="corporate">Corporate</option>
                      <option value="family">Family</option>
                      <option value="property">Property</option>
                      <option value="cyber">Cyber</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Client Email or Phone
                    </label>
                    <input
                      type="text"
                      value={formData.clientIdentifier}
                      onChange={(e) => setFormData({ ...formData, clientIdentifier: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                      placeholder="Enter client's email or phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Next Hearing Date
                    </label>
                    <input
                      type="date"
                      value={formData.nextHearingDate}
                      onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Case Fees (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.fees}
                      onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                      placeholder="Enter case fees"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Case Description</label>
                  <textarea
                    value={formData.caseDescription}
                    onChange={(e) => setFormData({ ...formData, caseDescription: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                    placeholder="Enter detailed case description"
                    required
                  ></textarea>
                </div>
                <div className="flex space-x-4">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Adding Case...' : 'Add Case'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowAddCase(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">All Cases</h2>
          {cases.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No cases yet</h3>
              <p className="text-slate-500">Click "Add New Case" to get started</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {cases.map((caseItem, index) => (
                <motion.div
                  key={caseItem._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/update-case/${caseItem._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{caseItem.caseTitle}</h3>
                      <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                        {caseItem.caseType}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      caseItem.caseStatus === 'Open' ? 'bg-green-100 text-green-700' :
                      caseItem.caseStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {caseItem.caseStatus}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Client: {caseItem.clientName || 'Unknown'}</span>
                    </div>
                    {caseItem.nextHearingDate && (
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Next Hearing: {new Date(caseItem.nextHearingDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        Created: {new Date(caseItem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {caseItem.caseDescription && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-slate-600 line-clamp-3">{caseItem.caseDescription}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    {caseItem.nextHearingDate && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateHearing(caseItem);
                        }}
                        className="flex items-center space-x-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Update Hearing</span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <UpdateHearingModal
        isOpen={showHearingModal}
        onClose={() => {
          setShowHearingModal(false);
          setSelectedCaseForHearing(null);
        }}
        caseId={selectedCaseForHearing?._id}
        currentHearingDate={selectedCaseForHearing?.nextHearingDate}
        onUpdate={handleHearingUpdate}
      />
    </div>
  );
}
