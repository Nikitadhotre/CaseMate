import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, MapPin, Cake, Edit, MessageCircle, Headphones } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ClientProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/client/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.id]);





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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-12">
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
          </div>

          <div className="px-8 py-8">
            {/* Edit Profile Button */}
            <div className="flex justify-end mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/edit-client-profile')}
                className="flex items-center space-x-2 bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            </div>

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Full Name</h3>
                  </div>
                  <p className="text-slate-700">{profile.name}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Email Address</h3>
                  </div>
                  <p className="text-slate-700">{profile.email}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Phone className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Phone Number</h3>
                  </div>
                  <p className="text-slate-700">{profile.phone}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Cake className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Date of Birth</h3>
                  </div>
                  <p className="text-slate-700">
                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not provided'}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Gender</h3>
                  </div>
                  <p className="text-slate-700">{profile.gender || 'Not provided'}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Address / City</h3>
                  </div>
                  <p className="text-slate-700">
                    {profile.address && profile.city ? `${profile.address}, ${profile.city}` : 'Not provided'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Profile Picture</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white rounded-full p-4 border-2 border-slate-200">
                      <User className="w-12 h-12 text-slate-700" />
                    </div>
                    <span className="text-slate-600">Default avatar</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Date of Account Creation</h3>
                  </div>
                  <p className="text-slate-700">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">User Type</h3>
                  </div>
                  <p className="text-slate-700 capitalize">{profile.role}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-6 h-6 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Account Status</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.verified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </motion.div>



            {/* Chatbot / Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Support</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/ai-chatbot')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg text-left hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <MessageCircle className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Ask Legal Chatbot</h3>
                      <p className="text-blue-100 text-sm">Get instant help with legal questions</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-6 rounded-lg text-left hover:from-slate-700 hover:to-slate-800 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <Headphones className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Contact Support</h3>
                      <p className="text-slate-100 text-sm">Get help from our support team</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
