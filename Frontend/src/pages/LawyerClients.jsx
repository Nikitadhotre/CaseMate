import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Users, User, Phone, Mail, MapPin, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LawyerClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/lawyer/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClients(response.data.clients || []);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full"></div></div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <Users className="w-12 h-12 text-slate-600" />
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Clients</h1>
          <p className="text-xl text-slate-600 mt-1">{clients.length} Active Clients</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 border border-slate-100 transition-all duration-500 cursor-pointer hover:border-slate-200"
          >
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <User className="w-10 h-10 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-slate-900 mb-1 line-clamp-1">{client.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="text-slate-600 line-clamp-1">{client.email}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl font-semibold">
                  <FolderOpen className="w-4 h-4" />
                  {client.cases} Active Cases
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>View Profile</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {clients.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-xl"
        >
          <Users className="w-24 h-24 text-slate-300 mx-auto mb-8" />
          <h3 className="text-3xl font-bold text-slate-600 mb-4">No Clients Yet</h3>
          <p className="text-xl text-slate-500 max-w-md mx-auto mb-8">Manage your clients and their cases from one place.</p>
          <button className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-slate-900 hover:to-slate-950 transition-all duration-300">
            + Add Client
            <User className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

