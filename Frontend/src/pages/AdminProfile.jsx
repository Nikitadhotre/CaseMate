import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, Edit, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemOverview, setSystemOverview] = useState({
    totalLawyers: 0,
    totalClients: 0,
    activeCases: 0,
    pendingVerifications: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProfile(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchSystemOverview = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/overview`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setSystemOverview(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching system overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchSystemOverview();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-16 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pt-24 pb-16 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Profile Not Found</h2>
          <p className="text-slate-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-white rounded-full p-6">
                  <User className="w-16 h-16 text-slate-700" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-slate-200 capitalize">{profile.role}</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/edit-admin-profile')}
                className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            </div>


          </div>

          <div className="px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Admin Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">Admin Information</h3>
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
                      <p className="text-sm text-slate-500">Role</p>
                      <p className="text-slate-700 capitalize">{profile.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Account Status</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        profile.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {profile.verified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Member Since</p>
                      <p className="text-slate-700">
                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Management Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">Management Controls</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-50 rounded-lg p-6 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <FileText className="w-6 h-6 text-green-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Case Management</h4>
                    </div>
                    <p className="text-slate-600 mb-4">Monitor active cases, resolve disputes</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Active cases</span>
                      <span className="text-lg font-bold text-slate-900">{systemOverview.activeCases}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-50 rounded-lg p-6 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Analytics</h4>
                    </div>
                    <p className="text-slate-600 mb-4">View system statistics and reports</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Total users</span>
                      <span className="text-lg font-bold text-slate-900">{systemOverview.totalLawyers + systemOverview.totalClients}</span>
                    </div>
                  </motion.div>


                </div>


              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
