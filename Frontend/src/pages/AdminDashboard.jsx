import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Briefcase, UserCheck, BarChart3, Shield, LogOut, AlertCircle, Clock, FolderOpen, TrendingUp, Activity, FileText, DollarSign, CheckCircle, XCircle, Search, Filter, Calendar, Bell, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [clients, setClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCaseFilter, setActiveCaseFilter] = useState('all');
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // New features state
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    const filter = searchParams.get('filter');

    if (tab) {
      setActiveTab(tab);
    } else if (filter) {
      setActiveTab('cases');
    } else {
      setActiveTab('overview');
    }

    setActiveCaseFilter(filter || 'all');
  }, [searchParams.toString()]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [dashboardRes, clientsRes, lawyersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/admin/clients', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/admin/lawyers', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const dashboard = dashboardRes.data.data || {};
        setDashboardData(dashboard);
        setClients(clientsRes.data.data || []);
        setLawyers(lawyersRes.data.data || []);
        setCases(dashboard.cases || []);
        
        // Generate notifications based on dashboard data
        const newNotifications = [];
        const pendingLawyersCount = (lawyersRes.data.data || []).filter(l => !l.verified).length;
        if (pendingLawyersCount > 0) {
          newNotifications.push({
            id: 1,
            type: 'warning',
            message: `${pendingLawyersCount} lawyer(s) pending verification`,
            timestamp: new Date()
          });
        }
        if (dashboard.upcomingHearings > 0) {
          newNotifications.push({
            id: 2,
            type: 'info',
            message: `${dashboard.upcomingHearings} upcoming hearing(s) this week`,
            timestamp: new Date()
          });
        }
        setNotifications(newNotifications);
        
        // Set recent activity
        setRecentActivity([
          { id: 1, action: 'New lawyer registered', time: '2 hours ago', icon: Briefcase },
          { id: 2, action: 'Case status updated', time: '5 hours ago', icon: FileText },
          { id: 3, action: 'Client verified', time: '1 day ago', icon: UserCheck }
        ]);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };
  
  const combinedData = [...clients.map(c => ({ ...c, type: 'client' })), ...lawyers.map(l => ({ ...l, type: 'lawyer' }))];
  const searchResults = combinedData.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Total Lawyers',
      value: dashboardData?.totalLawyers || 0,
      icon: Briefcase,
      color: 'bg-green-500',
      trend: '+8%',
    },
    {
      title: 'Total Clients',
      value: dashboardData?.totalClients || 0,
      icon: UserCheck,
      color: 'bg-purple-500',
      trend: '+15%',
    },
    {
      title: 'Total Cases',
      value: cases.length,
      icon: FileText,
      color: 'bg-orange-500',
      trend: '+5%',
    },
  ];
  
  const pendingLawyers = lawyers.filter((lawyer) => !lawyer.verified);
  
  // Quick actions
  const quickActions = [
    { label: 'Verify Lawyers', icon: CheckCircle, count: pendingLawyers.length },
    { label: 'View All Cases', icon: FolderOpen, count: cases.length },
    { label: 'View Analytics', icon: BarChart3, count: 0 },
  ];

  const filteredCases = activeCaseFilter === 'all'
    ? cases
    : cases.filter((caseItem) => caseItem.caseStatus === activeCaseFilter);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            {/* Header content */}
          </div>
          
          {/* New Features: Search & Notifications */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users, cases..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 w-64"
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                      }}
                    >
                      <p className="text-sm font-medium text-slate-900">{result.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{result.type} • {result.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (notifications.length > 0) {
                    // Clear notifications when viewed
                    setNotifications([]);
                  }
                }}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                  <div className="p-3 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-slate-500 hover:text-slate-700 text-sm"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-3 border-b border-slate-100 hover:bg-slate-50">
                          <p className="text-sm text-slate-700">{notif.message}</p>
                          <p className="text-xs text-slate-500 mt-1">Just now</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-sm">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (action.label === 'Verify Lawyers') setActiveTab('pending');
                  else if (action.label === 'View All Cases') setActiveTab('cases');
                  else setActiveTab('overview');
                }}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{action.label}</p>
                    {action.count > 0 && (
                      <p className="text-sm text-gray-500">{action.count} items</p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content area controlled by sidebar navigation */}

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-8 h-8 text-slate-600" />
              <h2 className="text-2xl font-bold text-slate-900">System Analytics</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">User Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Lawyers</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: dashboardData?.totalUsers
                              ? `${(dashboardData.totalLawyers / dashboardData.totalUsers) * 100}%`
                              : '0%',
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {dashboardData?.totalLawyers || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Clients</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: dashboardData?.totalUsers
                              ? `${(dashboardData.totalClients / dashboardData.totalUsers) * 100}%`
                              : '0%',
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {dashboardData?.totalClients || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Total Cases</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {dashboardData?.totalCases || cases.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Upcoming Hearings</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {dashboardData?.upcomingHearings || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Summary</h3>
                <div className="space-y-3">
                  <div className="w-full text-left p-4 bg-slate-50 rounded-lg">
                    <div className="font-medium text-slate-900">Open Cases</div>
                    <div className="text-sm text-slate-600">{dashboardData?.caseStatusCounts?.Open || 0}</div>
                  </div>
                  <div className="w-full text-left p-4 bg-slate-50 rounded-lg">
                    <div className="font-medium text-slate-900">In Progress</div>
                    <div className="text-sm text-slate-600">{dashboardData?.caseStatusCounts?.['In Progress'] || 0}</div>
                  </div>
                  <div className="w-full text-left p-4 bg-slate-50 rounded-lg">
                    <div className="font-medium text-slate-900">Closed Cases</div>
                    <div className="text-sm text-slate-600">{dashboardData?.caseStatusCounts?.Closed || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'clients' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <UserCheck className="w-8 h-8 text-slate-600" />
              <h2 className="text-2xl font-bold text-slate-900">Clients</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-900">{client.name}</td>
                      <td className="py-3 px-4 text-slate-600">{client.email}</td>
                      <td className="py-3 px-4 text-slate-600">{client.phone}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length === 0 && (
                <div className="text-center py-8 text-slate-500">No clients found</div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'lawyers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Briefcase className="w-8 h-8 text-slate-600" />
              <h2 className="text-2xl font-bold text-slate-900">Lawyers</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Specialization</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Experience</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {lawyers.map((lawyer) => (
                    <tr key={lawyer._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-900">{lawyer.name}</td>
                      <td className="py-3 px-4 text-slate-600">{lawyer.email}</td>
                      <td className="py-3 px-4 text-slate-600">{lawyer.phone}</td>
                      <td className="py-3 px-4 text-slate-600">{lawyer.specialization || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-600">{lawyer.experience ? `${lawyer.experience} years` : 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(lawyer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lawyers.length === 0 && (
                <div className="text-center py-8 text-slate-500">No lawyers found</div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="w-8 h-8 text-slate-600" />
              <h2 className="text-2xl font-bold text-slate-900">Pending Approvals</h2>
            </div>

            {pendingLawyers.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No pending lawyer approvals</div>
            ) : (
              <div className="grid gap-4">
                {pendingLawyers.map((lawyer) => (
                  <div key={lawyer._id} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{lawyer.name}</h3>
                        <p className="text-sm text-slate-600">{lawyer.email}</p>
                        <p className="text-sm text-slate-500">{lawyer.phone}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'cases' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <FolderOpen className="w-8 h-8 text-slate-600" />
                <h2 className="text-2xl font-bold text-slate-900">Cases</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', 'Open', 'In Progress', 'Closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveCaseFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCaseFilter === status
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredCases.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No cases found for selected filter</div>
            ) : (
              <div className="grid gap-4">
                {filteredCases.map((caseItem) => (
                  <div key={caseItem._id} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{caseItem.caseTitle}</h3>
                        <p className="text-sm text-slate-600">
                          {caseItem.caseType} • Client: {caseItem.clientName || 'N/A'}
                        </p>
                        <p className="text-sm text-slate-500">
                          Lawyer: {caseItem.lawyerId?.name || caseItem.lawyerName || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                        caseItem.caseStatus === 'Open'
                          ? 'bg-emerald-100 text-emerald-800'
                          : caseItem.caseStatus === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                      }`}>
                        {caseItem.caseStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
