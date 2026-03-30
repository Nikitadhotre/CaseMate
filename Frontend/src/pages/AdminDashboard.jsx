import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Briefcase, UserCheck, BarChart3, Shield, LogOut, AlertCircle, Clock, FolderOpen } from 'lucide-react';
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
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
    },
    {
      title: 'Total Lawyers',
      value: dashboardData?.totalLawyers || 0,
      icon: Briefcase,
      color: 'bg-green-500',
    },
    {
      title: 'Total Clients',
      value: dashboardData?.totalClients || 0,
      icon: UserCheck,
      color: 'bg-purple-500',
    },
  ];

  const filteredCases = activeCaseFilter === 'all'
    ? cases
    : cases.filter((caseItem) => caseItem.caseStatus === activeCaseFilter);

  const pendingLawyers = lawyers.filter((lawyer) => !lawyer.verified);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            {/* Empty header */}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
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
