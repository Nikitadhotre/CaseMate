import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, FolderOpen, Clock, CheckCircle, Plus, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LawyerCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cases/lawyer/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(response.data.cases || []);
    } catch (err) {
      setError('Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full"></div></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <FolderOpen className="w-12 h-12 text-slate-600" />
          <div>
            <h1 className="text-4xl font-bold text-slate-900">My Cases</h1>
            <p className="text-xl text-slate-600 mt-1">{cases.length} Total Cases</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/lawyer-dashboard')}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-blue-700 transition-all duration-300 border-2 border-blue-500"
        >
          <Plus className="w-6 h-6" />
          Add New Case
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-slate-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{cases.length}</p>
              <p className="text-slate-600 font-semibold">All Cases</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-emerald-50 rounded-3xl p-8 shadow-xl border border-emerald-100 hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-800">{cases.filter(c => c.caseStatus === 'Open').length}</p>
              <p className="text-emerald-700 font-semibold">Open</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-blue-50 rounded-3xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-800">{cases.filter(c => c.caseStatus === 'In Progress').length}</p>
              <p className="text-blue-700 font-semibold">In Progress</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-50 rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-slate-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{cases.filter(c => c.caseStatus === 'Closed').length}</p>
              <p className="text-slate-700 font-semibold">Completed</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {cases.map((caseItem, index) => (
          <motion.div
            key={caseItem._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 border border-slate-100 transition-all duration-500 cursor-pointer overflow-hidden hover:border-slate-200"
            onClick={() => window.open(`/update-case/${caseItem._id}`, '_blank')}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 pr-4">
                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-800">
                  {caseItem.caseTitle}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold">
                    {caseItem.caseType}
                  </span>
                  <span className={`px-3 py-1 text-sm font-bold rounded-xl ${
                    caseItem.caseStatus === 'Open' ? 'bg-emerald-100 text-emerald-800' :
                    caseItem.caseStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {caseItem.caseStatus}
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-lg group-hover:from-slate-200 group-hover:to-slate-300 transition-all">
                <FileText className="w-8 h-8 text-slate-600" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Client</p>
                  <p className="font-semibold text-slate-900">{caseItem.clientName || 'N/A'}</p>
                </div>
              </div>
              {caseItem.nextHearingDate && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Next Hearing</p>
                    <p className="font-semibold text-slate-900">{new Date(caseItem.nextHearingDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            {caseItem.caseDescription && (
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="text-slate-700 leading-relaxed line-clamp-3">{caseItem.caseDescription}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button className="flex-1 bg-slate-800 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl">
                View Details
              </button>
              <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl">
                Actions
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {cases.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-xl"
        >
          <FileText className="w-24 h-24 text-slate-300 mx-auto mb-8" />
          <h3 className="text-3xl font-bold text-slate-600 mb-4">No Cases Yet</h3>
          <p className="text-xl text-slate-500 max-w-md mx-auto mb-8">Start managing your first case and track everything in one place.</p>
          <button onClick={() => navigate('/lawyer-dashboard')} className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-slate-900 hover:to-slate-950 transition-all duration-300">
            + Add New Case
            <Plus className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

