import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, MapPin, Cake, Briefcase, Clock, Star, MessageCircle, Award, CheckCircle } from 'lucide-react';

export default function LawyerProfilePage() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/client/lawyers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lawyer details');
        }
        const data = await response.json();
        setLawyer(data.lawyer);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLawyer();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="pt-24 pb-16 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Lawyer Not Found</h2>
          <p className="text-slate-600">{error || 'Unable to load lawyer information.'}</p>
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
                  <h1 className="text-3xl font-bold text-white mb-2">{lawyer.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span className="text-slate-200 capitalize">{lawyer.role}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="text-slate-200">{lawyer.availabilityStatus || 'Offline'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Lawyer</span>
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
                  <div className="text-2xl font-bold text-slate-900">{lawyer.experience || 0}</div>
                  <div className="text-sm text-slate-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-bold text-slate-900">{lawyer.rating || 0}</span>
                  </div>
                  <div className="text-sm text-slate-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{lawyer.reviews || 0}</div>
                  <div className="text-sm text-slate-600">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold text-slate-900">{lawyer.verified ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="text-sm text-slate-600">Verified</div>
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
                <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="text-slate-700">{lawyer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="text-slate-700">{lawyer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="text-slate-700">{lawyer.address || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">City</p>
                      <p className="text-slate-700">{lawyer.city || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-500">Member Since</p>
                      <p className="text-slate-700">
                        {new Date(lawyer.createdAt).toLocaleDateString('en-US', {
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
                    <p className="text-slate-700">{lawyer.specialization || 'Not specified'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Calendar className="w-6 h-6 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Experience</h4>
                    </div>
                    <p className="text-slate-700">{lawyer.experience ? `${lawyer.experience} years` : 'Not specified'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Award className="w-6 h-6 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Bar License</h4>
                    </div>
                    <p className="text-slate-700">{lawyer.barLicenseNumber || 'Not provided'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="w-6 h-6 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Availability</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      lawyer.availabilityStatus === 'Online' ? 'bg-green-100 text-green-800' :
                      lawyer.availabilityStatus === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lawyer.availabilityStatus || 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Reviews Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Client Reviews</h3>
                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="text-lg font-semibold text-slate-900">{lawyer.rating || 0} out of 5</span>
                      </div>
                      <span className="text-slate-600">({lawyer.reviews || 0} reviews)</span>
                    </div>
                    {lawyer.reviews > 0 ? (
                      <p className="text-slate-700">Client reviews will be displayed here.</p>
                    ) : (
                      <p className="text-slate-600">No reviews yet</p>
                    )}
                  </div>
                </motion.div>

                {/* Contact Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8"
                >
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Ready to Get Started?</h4>
                    <p className="text-slate-700 mb-6">
                      Contact this lawyer to discuss your legal needs and get professional assistance.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Contact {lawyer.name}</span>
                    </motion.button>
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
