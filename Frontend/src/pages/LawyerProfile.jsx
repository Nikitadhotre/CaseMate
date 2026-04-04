import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, MapPin, Cake, Briefcase, Clock, Edit, DollarSign, FileText, CheckCircle, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LawyerProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, pending: 0, history: [] });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/lawyer/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProfile(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCases = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/lawyer/cases`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCases(response.data.cases || []);
        }
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };

    fetchProfile();
    fetchCases();
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
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span className="text-slate-200 capitalize">{profile.role}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="text-slate-200">{profile.availabilityStatus || 'Offline'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/edit-lawyer-profile')}
                className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 bg-slate-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Professional Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{profile.experience || 0}</div>
                  <div className="text-sm text-slate-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{cases.length}</div>
                  <div className="text-sm text-slate-600">Active Cases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">0</div>
                  <div className="text-sm text-slate-600">Completed Cases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">₹0</div>
                  <div className="text-sm text-slate-600">Total Earnings</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h3>
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
                    <Cake className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Date of Birth</p>
                      <p className="text-slate-700">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Gender</p>
                      <p className="text-slate-700">{profile.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="text-slate-700">{profile.address || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">City</p>
                      <p className="text-slate-700">{profile.city || 'Not provided'}</p>
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

              {/* Professional Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Briefcase className="w-6 h-6 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Specialization</h4>
                    </div>
                    <p className="text-slate-700">{profile.specialization || 'Not specified'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Calendar className="w-6 h-6 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Experience</h4>
                    </div>
                    <p className="text-slate-700">{profile.experience ? `${profile.experience} years` : 'Not specified'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-6 h-6 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Bar License</h4>
                    </div>
                    <p className="text-slate-700">{profile.barLicenseNumber || 'Not provided'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="w-6 h-6 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Availability</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.availabilityStatus === 'Online' ? 'bg-green-100 text-green-800' :
                      profile.availabilityStatus === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {profile.availabilityStatus || 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Case Management */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Case Management</h3>
                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-slate-900">Active Cases</h4>
                      <span className="text-slate-600">{cases.length} cases</span>
                    </div>
                    {cases.length > 0 ? (
                      <div className="space-y-4">
                        {cases.slice(0, 3).map((caseItem, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                            <div>
                              <p className="font-semibold text-slate-900">{caseItem.title}</p>
                              <p className="text-sm text-slate-600">Client: {caseItem.clientName}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                caseItem.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {caseItem.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600">No active cases</p>
                    )}
                  </div>
                </motion.div>

                {/* Payments */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Payments</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <h4 className="text-lg font-semibold text-slate-900">Total Earnings</h4>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">₹0</p>
                      <p className="text-sm text-slate-600">All time</p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="w-6 h-6 text-yellow-600" />
                        <h4 className="text-lg font-semibold text-slate-900">Pending Payments</h4>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">₹0</p>
                      <p className="text-sm text-slate-600">Awaiting settlement</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
