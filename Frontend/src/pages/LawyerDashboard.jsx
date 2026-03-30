import { useState, useEffect } from 'react';
import { Plus, Calendar, FileText, Bell, Clock, AlertCircle, LogOut, User, Edit, Eye, CheckCircle, XCircle, FolderOpen, Layers, ChevronLeft, ChevronRight, Search, Mail, Phone, Users, TrendingUp, DollarSign, Target, MessageSquare, Send, BarChart3, PieChart, Clock3, CheckSquare, Briefcase, Activity as ActivityIcon } from 'lucide-react';
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
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [activeView, setActiveView] = useState(searchParams.get('view') || 'dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // New features state
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [caseStats, setCaseStats] = useState({
    totalRevenue: 0,
    monthlyEarnings: 0,
    successRate: 0,
    avgCaseDuration: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Update activeView, activeFilter when URL changes
  useEffect(() => {
    const view = searchParams.get('view') || 'dashboard';
    setActiveView(view);
    const filter = searchParams.get('filter');
    if (filter) {
      setActiveFilter(filter);
    }
    // Auto-open add case form if navigating from sidebar
    if (searchParams.get('action') === 'add-case' || view === 'add-case') {
      setShowAddCase(true);
    }
  }, [searchParams.toString()]);



  const filteredClients = clients.filter(client => {
    const searchLower = clientSearch.toLowerCase();
    return (
      client.name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.phone?.toLowerCase().includes(searchLower)
    );
  });

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
    if (activeView === 'clients') {
      fetchClients();
    }
  }, [activeView]);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/cases/lawyer/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedCases = response.data.cases || [];
      setCases(fetchedCases);
      
      // Calculate case statistics
      const totalRevenue = fetchedCases.reduce((sum, c) => sum + (c.fees || 0), 0);
      const closedCases = fetchedCases.filter(c => c.caseStatus === 'Closed').length;
      const successRate = fetchedCases.length > 0 ? Math.round((closedCases / fetchedCases.length) * 100) : 0;
      
      setCaseStats({
        totalRevenue,
        monthlyEarnings: totalRevenue * 0.15, // Mock monthly calculation
        successRate,
        avgCaseDuration: 45 // Mock average days
      });
      
      // Set messages
      setMessages([
        { id: 1, from: 'Admin', message: 'New case assigned', time: '1 hour ago', read: false },
        { id: 2, from: 'Client', message: 'Document uploaded for Case #567', time: '3 hours ago', read: true }
      ]);
      
      // Generate notifications
      setNotifications([
        { id: 1, type: 'hearing', message: `${upcomingHearings.length} hearings this week`, time: 'just now' },
        { id: 2, type: 'case', message: '2 new cases added', time: 'today' }
      ]);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch cases');
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/lawyer/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoadingClients(false);
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
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* New Features: Stats Bar */}
          {activeView === 'dashboard' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 opacity-80" />
                  <div>
                    <p className="text-xs opacity-80">Total Revenue</p>
                    <p className="text-xl font-bold">₹{caseStats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 opacity-80" />
                  <div>
                    <p className="text-xs opacity-80">Success Rate</p>
                    <p className="text-xl font-bold">{caseStats.successRate}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-8 h-8 opacity-80" />
                  <div>
                    <p className="text-xs opacity-80">Active Cases</p>
                    <p className="text-xl font-bold">{cases.filter(c => c.caseStatus !== 'Closed').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Clock3 className="w-8 h-8 opacity-80" />
                  <div>
                    <p className="text-xs opacity-80">Avg Duration</p>
                    <p className="text-xl font-bold">{caseStats.avgCaseDuration} days</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Header with Search & Messages */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases, clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Messages */}
              <button
                onClick={() => setShowMessages(!showMessages)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-gray-600" />
                {messages.filter(m => !m.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {messages.filter(m => !m.read).length}
                  </span>
                )}
              </button>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
          
          {/* Messages Panel */}
          {showMessages && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Messages
                </h3>
                <button onClick={() => setShowMessages(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-3">
                {messages.length > 0 ? messages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-lg border ${msg.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{msg.from}</p>
                        <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-4">No messages</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Full-width Content */}
          <div>
            {/* Calendar View */}
            {activeView === 'calendar' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Calendar</h2>
                <div className="flex items-center justify-between mb-4">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-base font-semibold text-gray-700">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs font-semibold text-gray-500 py-1">{day}</div>
                  ))}
                  {(() => {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const hearingDates = upcomingHearings.map(h => new Date(h.hearingDate).getDate());
                    const cells = [];
                    for (let i = 0; i < firstDay; i++) {
                      cells.push(<div key={`empty-${i}`} className="h-9"></div>);
                    }
                    for (let day = 1; day <= daysInMonth; day++) {
                      const isToday = day === today.getDate();
                      const hasHearing = hearingDates.includes(day);
                      cells.push(
                        <div key={day} className={`h-9 flex items-center justify-center text-sm rounded-md ${
                          isToday ? 'bg-indigo-600 text-white font-semibold' : 
                          hasHearing ? 'bg-amber-100 text-amber-700 font-semibold cursor-pointer hover:bg-amber-200' : 
                          'text-gray-700 hover:bg-gray-100'
                        }`}>
                          {day}
                        </div>
                      );
                    }
                    return cells;
                  })()}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Hearings</h3>
                  <div className="space-y-2">
                    {upcomingHearings.map((hearing) => (
                      <div key={hearing.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <Calendar className="w-5 h-5 text-amber-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{hearing.title}</p>
                          <p className="text-xs text-gray-500">{new Date(hearing.hearingDate).toLocaleDateString()} - {hearing.clientName}</p>
                        </div>
                      </div>
                    ))}
                    {upcomingHearings.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No upcoming hearings</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications View */}
            {activeView === 'notifications' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Notifications</h2>
                <div className="space-y-3">
                  {upcomingHearings.length > 0 ? (
                    upcomingHearings.map((hearing) => (
                      <div key={hearing.id} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Hearing: {hearing.title}</p>
                          <p className="text-xs text-gray-600 mt-1">Date: {new Date(hearing.hearingDate).toLocaleDateString()} at {new Date(hearing.hearingDate).toLocaleTimeString()}</p>
                          <p className="text-xs text-gray-500">Client: {hearing.clientName}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dashboard View (default) - Shows all sections */}
            {activeView === 'dashboard' && (
              <>
                {/* Performance Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Cases by Status</h3>
                      <PieChart className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Open</span>
                        <span className="text-sm font-semibold text-green-600">{cases.filter(c => c.caseStatus === 'Open').length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">In Progress</span>
                        <span className="text-sm font-semibold text-blue-600">{cases.filter(c => c.caseStatus === 'In Progress').length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Closed</span>
                        <span className="text-sm font-semibold text-gray-600">{cases.filter(c => c.caseStatus === 'Closed').length}</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
                      <ActivityIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">2 cases completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">5 new documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span className="text-gray-600">{upcomingHearings.length} hearings scheduled</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Quick Stats</h3>
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">This Month</p>
                        <p className="text-lg font-bold text-indigo-600">₹{caseStats.monthlyEarnings.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Clients</p>
                        <p className="text-lg font-bold text-gray-900">{clients.length}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {upcomingHearings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-5 mb-5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Bell className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold">Upcoming Hearings</h3>
                    </div>
                    <div className="space-y-3">
                      {upcomingHearings.slice(0, 3).map((hearing, index) => (
                        <motion.div
                          key={hearing.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="bg-white/10 rounded-xl p-4 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <div className="flex items-start gap-3">
                            <Calendar className="w-8 h-8 text-blue-200 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base text-white mb-1 truncate">{hearing.title}</h4>
                              <p className="text-blue-100 text-sm mb-2">Client: <span className="font-semibold">{hearing.clientName}</span></p>
                              <div className="flex gap-3 text-xs">
                                <span className="bg-white/20 px-2 py-0.5 rounded-lg">
                                  {new Date(hearing.hearingDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                                <span className="bg-white/20 px-2 py-0.5 rounded-lg">
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
                        <p className="text-blue-200 text-sm font-semibold text-center pt-3 border-t border-white/20">
                          +{upcomingHearings.length - 3} more hearings
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Mini Calendar */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-gray-900">Calendar</h3>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold text-gray-700">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-xs font-semibold text-gray-500 py-1">{day}</div>
                    ))}
                    {(() => {
                      const today = new Date();
                      const year = today.getFullYear();
                      const month = today.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      const hearingDates = upcomingHearings.map(h => new Date(h.hearingDate).getDate());
                      const cells = [];
                      for (let i = 0; i < firstDay; i++) {
                        cells.push(<div key={`empty-${i}`} className="h-9"></div>);
                      }
                      for (let day = 1; day <= daysInMonth; day++) {
                        const isToday = day === today.getDate();
                        const hasHearing = hearingDates.includes(day);
                        cells.push(
                          <div key={day} className={`h-9 flex items-center justify-center text-sm rounded-md ${
                            isToday ? 'bg-indigo-600 text-white font-semibold' : 
                            hasHearing ? 'bg-amber-100 text-amber-700 font-semibold cursor-pointer hover:bg-amber-200' : 
                            'text-gray-700 hover:bg-gray-100'
                          }`}>
                            {day}
                          </div>
                        );
                      }
                      return cells;
                    })()}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-amber-100"></div>
                      <span className="text-xs text-gray-600">Hearing</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-indigo-600"></div>
                      <span className="text-xs text-gray-600">Today</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Add Case View */}
            {activeView === 'add-case' && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Case</h2>
                  <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Case Title
                      </label>
                      <input
                        type="text"
                        value={formData.caseTitle}
                        onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                        placeholder="Enter case title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Case Type
                      </label>
                      <select
                        value={formData.caseType}
                        onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Email or Phone
                      </label>
                      <input
                        type="text"
                        value={formData.clientIdentifier}
                        onChange={(e) => setFormData({ ...formData, clientIdentifier: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                        placeholder="Enter client's email or phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Next Hearing Date
                      </label>
                      <input
                        type="date"
                        value={formData.nextHearingDate}
                        onChange={(e) => setFormData({ ...formData, nextHearingDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Case Fees (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.fees}
                        onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                        placeholder="Enter case fees"
                        min="0"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Case Description</label>
                      <textarea
                        value={formData.caseDescription}
                        onChange={(e) => setFormData({ ...formData, caseDescription: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all resize-none"
                        placeholder="Enter detailed case description"
                        required
                      ></textarea>
                    </div>
                    <div className="md:col-span-2 flex gap-3 pt-2">
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-indigo-600 text-white py-2.5 px-6 rounded-md font-semibold text-sm shadow-sm hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Adding...' : 'Add Case'}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => {
                          setShowAddCase(false);
                          window.history.back();
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gray-100 border border-gray-300 text-gray-700 py-2.5 px-6 rounded-md font-semibold text-sm hover:bg-gray-200 transition-all duration-300"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Clients View */}
            {activeView === 'clients' && (
              <div className="space-y-5">
                {/* Search Bar */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search clients by name, email or phone..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Clients List */}
                {loadingClients ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-600 mb-2">
                      {clientSearch ? 'No clients found' : 'No clients yet'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {clientSearch ? 'Try adjusting your search' : 'Your clients will appear here'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredClients.map((client, index) => (
                      <motion.div
                        key={client._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <span className="text-xl font-bold text-indigo-600">
                              {client.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 truncate">{client.name || 'Unknown'}</h3>
                            <div className="mt-2 space-y-1.5">
                              {client.email && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="truncate">{client.email}</span>
                                </div>
                              )}
                              {client.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span>{client.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/view-case-details/${client._id}`)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            View Cases
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            Contact
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cases View */}
            {activeView === 'cases' && (
              <>
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500">Total Cases</p>
                    <p className="text-xl font-bold text-gray-900">{cases.length}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500">Open</p>
                    <p className="text-xl font-bold text-green-600">{cases.filter(c => c.caseStatus === 'Open').length}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500">In Progress</p>
                    <p className="text-xl font-bold text-blue-600">{cases.filter(c => c.caseStatus === 'In Progress').length}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500">Closed</p>
                    <p className="text-xl font-bold text-gray-600">{cases.filter(c => c.caseStatus === 'Closed').length}</p>
                  </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-5">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search cases..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          activeFilter === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setActiveFilter('Open')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          activeFilter === 'Open'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => setActiveFilter('In Progress')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          activeFilter === 'In Progress'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => setActiveFilter('Closed')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          activeFilter === 'Closed'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Closed
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cases List */}
                {filteredCases.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-600 mb-2">
                      {activeFilter === 'all' ? 'No cases yet' : `No ${activeFilter} cases`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Use Sidebar to add cases
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredCases.map((caseItem, index) => (
                      <motion.div
                        key={caseItem._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        className="group bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/update-case/${caseItem._id}`)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded">
                                {caseItem.caseType}
                              </span>
                              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded ${
                                caseItem.caseStatus === 'Open' 
                                  ? 'bg-green-100 text-green-700' 
                                  : caseItem.caseStatus === 'In Progress' 
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {caseItem.caseStatus}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                              {caseItem.caseTitle}
                            </h3>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200 flex items-center justify-center transition-all duration-300">
                            <FileText className="w-5 h-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="space-y-2.5 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{caseItem.clientName || 'Unknown'}</span>
                          </div>
                          {caseItem.nextHearingDate && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-amber-500" />
                              <span>{new Date(caseItem.nextHearingDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Created: {new Date(caseItem.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          {caseItem.caseStatus !== 'Closed' ? (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsCompleted(caseItem._id);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-emerald-600 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </motion.button>
                          ) : (
                            <div className="flex-1 flex items-center justify-center gap-1.5 text-emerald-600 py-2 px-3 rounded-md text-sm font-medium bg-emerald-50">
                              <CheckCircle className="w-4 h-4" />
                              Done
                            </div>
                          )}
                          {caseItem.nextHearingDate && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateHearing(caseItem);
                              }}
                              className="flex items-center justify-center gap-1.5 bg-amber-500 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors"
                            >
                              <Calendar className="w-4 h-4" />
                              Update
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
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

