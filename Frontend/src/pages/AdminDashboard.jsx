import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, UserCheck, BarChart3, Shield, LogOut, Eye, CheckCircle, XCircle, User, Mail, Phone, Calendar, Edit, FileText, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [clients, setClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/dashboard');
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/clients');
      setClients(response.data.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const fetchLawyers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/lawyers');
      setLawyers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch lawyers:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'clients') {
      fetchClients();
    } else if (activeTab === 'lawyers') {
      fetchLawyers();
    }
  }, [activeTab]);

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

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">System overview and management</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'clients'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveTab('lawyers')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'lawyers'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lawyers
            </button>

          </div>
        </div>

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
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="font-medium text-slate-900">Manage Users</div>
                    <div className="text-sm text-slate-600">View and edit user accounts</div>
                  </button>
                  <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="font-medium text-slate-900">System Settings</div>
                    <div className="text-sm text-slate-600">Configure application settings</div>
                  </button>
                  <button className="w-full text-left p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="font-medium text-slate-900">Reports</div>
                    <div className="text-sm text-slate-600">Generate system reports</div>
                  </button>
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
      </div>
    </div>
  );
}
