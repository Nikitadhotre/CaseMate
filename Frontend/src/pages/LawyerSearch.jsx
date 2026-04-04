import { useState, useEffect } from 'react';
import { Search, Star, Phone, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LawyerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await fetch('${import.meta.env.VITE_API_URL}/api/client/lawyers');
        if (!response.ok) {
          throw new Error('Failed to fetch lawyers');
        }
        const data = await response.json();
        setLawyers(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  const filteredLawyers = lawyers.filter((lawyer) =>
    lawyer.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Find Your Lawyer
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Search lawyers by specialization (Criminal, Civil, Family, Corporate, etc.)
          </p>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by specialization or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-lg"
            />
          </div>
        </motion.div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">Loading lawyers...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer, index) => (
              <motion.div
                key={lawyer._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-slate-100 rounded-full p-4">
                    <User className="w-12 h-12 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{lawyer.name}</h3>
                    <p className="text-slate-600 font-medium">{lawyer.specialization}</p>
                    <p className="text-sm text-slate-500">{lawyer.experience} years experience</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-900">{lawyer.rating}</span>
                  </div>
                  <span className="text-slate-500">({lawyer.reviews} reviews)</span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{lawyer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{lawyer.email}</span>
                  </div>
                </div>

                <Link to={`/lawyer/${lawyer._id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
                  >
                    View Profile
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && filteredLawyers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-slate-600">No lawyers found matching your search.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
