import { useState, useEffect } from 'react';
import { Plus, Calendar, FileText, Bell, Clock, AlertCircle, LogOut, User, Edit, Eye, CheckCircle, XCircle, FolderOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Update activeFilter when URL changes
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) {
      setActiveFilter(filter);
    }
    // Auto-open add case form if navigating from sidebar
    if (searchParams.get('action') === 'add-case') {
      setShowAddCase(true);
    }
  }, [searchParams]);

  const filters = [
    { id: 'all', label: 'All Cases', icon: Layers, count: cases.length },
    { id: 'Open', label: 'Open', icon: FolderOpen, count: cases.filter(c => c.caseStatus === 'Open').length },
    { id: 'In Progress', label: 'In Progress', icon: Clock, count: cases.filter(c => c.caseStatus === 'In Progress').length },
    { id: 'Closed', label: 'Completed', icon: CheckCircle, count: cases.filter(c => c.caseStatus === 'Closed').length },
  ];

  const filteredCases = activeFilter === 'all' 
    ? cases 
    : cases.filter(c => c.caseStatus === activeFilter);

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

  const handleMarkAsCompleted = async (caseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/cases/update/${caseId}`, 
        { caseStatus: 'Closed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCases(cases.map(c => c._id === caseId ? { ...c, caseStatus: 'Closed' } : c));
    } catch (error) {
      console.error('Error marking case as completed:', error);
    }
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
    <>
      <div className="pt-24 pb-16 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Lawyer Dashboard</h1>
              <p className="text-slate-600">Manage your cases and hearings professionally</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddCase(!showAddCase)}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center space-x-2 shadow-xl hover:bg-blue-700 transition-all duration-300 border-2 border-blue-500"
              >
                <Plus className="w-6 h-6" />
                <span className="text-lg">Add New Case</span>
              </motion.button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Layout with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar */}
            <div className="lg:w-80 lg:flex-shrink-0">
              <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8 h-fit border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-slate-700" />
                  Case Filters
                </h2>
                <div className="space-y-3">
                  {filters.map((filter) => (
                    <motion.button
                      key={filter.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`group w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-300 border-2 ${
                        activeFilter === filter.id
                          ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white border-slate-700 shadow-xl shadow-slate-900/20 hover:shadow-2xl'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-100 hover:shadow-lg'
                      }`}
                    >
                      <filter.icon className={`w-7 h-7 flex-shrink-0 transition-all duration-300 ${
                        activeFilter === filter.id 
                          ? 'text-white drop-shadow-lg' 
                          : 'text-slate-500 group-hover:text-slate-700'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-lg block leading-tight">{filter.label}</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                          activeFilter === filter.id 
                            ? 'bg-white/20 backdrop-blur-sm text-white' 
                            : 'bg-slate-200 text-slate-800'
                        }`}>
                          {filter.count}
                        </span>
                      </div>
                      {activeFilter === filter.id && (
                        <div className="w-2 h-12 bg-white/30 rounded-full flex-shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Main Content */}
            <div className="flex-1 min-w-0">
              {/* Upcoming Hearings Notification */}
              {upcomingHearings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-3xl p-8 shadow-2xl mb-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Bell className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Upcoming Hearings</h3>
                  </div>
                  <div className="space-y-4">
                    {upcomingHearings.slice(0, 3).map((hearing, index) => (
                      <motion.div
                        key={hearing.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white/10 rounded-2xl p-6 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <Calendar className="w-10 h-10 text-blue-200 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg text-white mb-1 truncate">{hearing.title}</h4>
                            <p className="text-blue-100 mb-3">Client: <span className="font-semibold">{hearing.clientName}</span></p>
                            <div className="flex gap-4 text-sm">
                              <span className="bg-white/20 px-3 py-1 rounded-xl backdrop-blur-sm">
                                {new Date(hearing.hearingDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className="bg-white/20 px-3 py-1 rounded-xl backdrop-blur-sm">
                                {new Date(hearing.hearingDate).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {upcomingHearings.length > 3 && (
                      <p className="text-blue-200 text-lg font-semibold text-center pt-4 border-t border-white/20">
                        +{upcomingHearings.length - 3} more hearings
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {showAddCase && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl mb-8 border border-slate-200"
                  >
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Add New Case</h2>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-4">
                          Case Title
                        </label>
                        <input
                          type="text"
                          value={formData.caseTitle}
                          onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          placeholder="Enter case title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-4">
                          Case Type
                        </label>
                        <select
                          value={formData.caseType}
                          onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
                        <label className="block text-lg font-semibold text-slate-700 mb-4">
                          Client Email or Phone
                        </label>
                        <input
                          type="text"
                          value={formData.clientIdentifier}
                          onChange={(e) => setFormData({ ...formData, clientIdentifier: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          placeholder="Enter client's email or phone number"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-4">
                          Next Hearing Date
                        </label>
                        <input
                          type="date"
                          value={formData.nextHearingDate}
                          onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-4">
                          Case Fees (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.fees}
                          onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          placeholder="Enter case fees"
                          min="0"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-lg font-semibold text-slate-700 mb-4">Case Description</label>
                        <textarea
                          value={formData.caseDescription}
                          onChange={(e) => setFormData({ ...formData, caseDescription: e.target.value })}
                          rows="5"
                          className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 text-lg shadow-lg hover:shadow-xl transition-all duration-300 resize-vertical"
                          placeholder="Enter detailed case description"
                          required
                        ></textarea>
                      </div>
                      <div className="md:col-span-2 flex gap-4 pt-2">
                        <motion.button
                          type="submit"
                          disabled={submitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-slate-900 hover:to-slate-950 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Adding Case...' : 'Add Case'}
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setShowAddCase(false)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-white border-2 border-slate-300 text-slate-700 py-5 px-8 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-400 hover:shadow-xl transition-all duration-300"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cases List */}
              {filteredCases.length === 0 ? (
                <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl">
                  <FileText className="w-24 h-24 text-slate-300 mx-auto mb-8" />
                  <h3 className="text-3xl font-bold text-slate-600 mb-4">
                    {activeFilter === 'all' ? 'No cases yet' : `No ${activeFilter} cases`}
                  </h3>
                  <p className="text-xl text-slate-500 max-w-md mx-auto">
                    {activeFilter === 'all' ? 'Click "Add New Case" to get started' : 'No cases match this filter'}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredCases.map((caseItem, index) => (
                    <motion.div
                      key={caseItem._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden hover:border-slate-300"
                      onClick={() => navigate(`/update-case/${caseItem._id}`)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-100">
                        <div className="flex-1 pr-4">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-all line-clamp-2 mb-2">
                            {caseItem.caseTitle}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-4 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-sm font-semibold rounded-xl">
                              {caseItem.caseType}
                            </span>
                            <span className={`px-4 py-1.5 text-sm font-bold rounded-xl ${
                              caseItem.caseStatus === 'Open' 
                                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200' 
                                : caseItem.caseStatus === 'In Progress' 
                                ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-2 border-slate-200'
                            }`}>
                              {caseItem.caseStatus}
                            </span>
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 flex items-center justify-center transition-all duration-300">
                          <FileText className="w-7 h-7 text-slate-600" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-slate-700">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-500" />
                          </div>
                          <div>
                            <span className="text-sm text-slate-500 block">Client</span>
                            <span className="font-semibold text-lg">{caseItem.clientName || 'Unknown'}</span>
                          </div>
                        </div>
                        {caseItem.nextHearingDate && (
                          <div className="flex items-center gap-3 text-slate-700">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <span className="text-sm text-slate-500 block">Next Hearing</span>
                              <span className="font-semibold text-lg">{new Date(caseItem.nextHearingDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-slate-500">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-sm block">Created</span>
                            <span className="text-sm">{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {caseItem.caseDescription && (
                        <div className="bg-slate-50 rounded-2xl p-5 mb-8 border">
                          <p className="text-slate-700 leading-relaxed line-clamp-3">{caseItem.caseDescription}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-6 border-t border-slate-100">
                        {caseItem.caseStatus !== 'Closed' ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsCompleted(caseItem._id);
                            }}
                            className="flex-1 flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3.5 px-6 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Mark Completed
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-2.5 text-emerald-600 text-sm font-semibold bg-emerald-50 py-3.5 px-6 rounded-2xl flex-1">
                            <CheckCircle className="w-5 h-5" />
                            Completed
                          </div>
                        )}
                        {caseItem.nextHearingDate && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateHearing(caseItem);
                            }}
                            className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 px-6 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
                          >
                            <Calendar className="w-5 h-5" />
                            Update Hearing
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
    </>
  );
}

